<template>
<ion-page>
  <ion-header >
    <ion-toolbar color="primary" class=" border-b-2 text-white border-primary">
      <ion-buttons slot="primary">
        <ion-button  class="text-white relative" @click="closeModal">
          <ion-icon slot="icon-only"  :icon="closeOutline"/>
        </ion-button>
      </ion-buttons>
      <ion-title class="text-3xl font-bold text-center">Add New Chat</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-refresher slot="fixed" @ionRefresh="change({target:{value:selectedTab}},$event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <ion-segment v-model="selectedTab" @ionChange="change">
      <ion-segment-button v-for="type in sections"  :value="type.value" :key="type.value">
        <ion-label>{{ type.text }}</ion-label>
      </ion-segment-button>
    </ion-segment>

    <div class="flex justify-center align-center" style="height: 100%" v-if="loading">
      <Loader_component/>
    </div>
    <template v-else>
      <ion-item class="custom-item dark">
        <ion-icon color="#fff" slot="start" :icon="searchOutline"/>
        <ion-input :disabled="loading" v-model="searchText"/>
      </ion-item>
      <ion-list >
        <ion-item v-for="user in filteredUsers" :key="user.id" @click="addChat(user.id)">
          <ion-avatar slot="start" class="relative overflow-hidden bg-gray-200">
            <firestorage-image profile  :path="user.profile"/>
          </ion-avatar>
          <ion-label>
            <h2>{{user.name}}</h2>
            <ion-chip v-if="user.role_en">
              {{user.role_en}}
            </ion-chip>
            <ion-chip v-if="user.phones && user.phones.length" color="primary">
              <ion-icon :icon="callOutline" />
              {{user.phones[0]}}
            </ion-chip>
            <ion-chip v-if="user.emails && user.emails.length" color="danger">
              <ion-icon :icon="mailOutline" />
              {{user.emails[0]}}
            </ion-chip>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>

  </ion-content>
</ion-page>
</template>

<script>

import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
    IonInput,

} from "@ionic/vue";
import {closeOutline,searchOutline,callOutline,mailOutline} from "ionicons/icons";
import Loader_component from "../../../components/loader_component";
import FirestorageImage from "../../../components/storageImage";
import {addRoom} from "../../../services/firebase/firestore";
import { Contacts } from '@capacitor-community/contacts'
import object from "../../../mixins/object";
export default {
  name: "addUserModal",
  mixins:[object],
  components:{
    FirestorageImage,IonChip,IonInput,
    Loader_component,IonList,IonItem,IonAvatar,
    IonPage,IonContent,IonRefresher,IonRefresherContent,IonSegment,IonSegmentButton,IonLabel,IonIcon,IonHeader,IonToolbar,IonButtons,IonButton,IonTitle
  },
  data:()=>({
    loading:false,
    users:[],
    coaches:[],
    contacts:[],
    selectedTab:2,
    searchText:null
  }),
  computed:{
    filteredUsers(){
      if (this.searchText){
        if (!isNaN(this.searchText)){
          return this.users.filter(x =>{
            return x.phones && x.phones.length > 0 && x.phones.some(r => r.includes(this.arabicPhoneToEnglish(this.searchText)))
          });
        }
        else{
          return this.users.filter(x => {
            return x.name.toLowerCase().includes(this.searchText.toLowerCase())
          });
        }

      }
      return this.users
    }
  },
  setup(){
    return{
      searchOutline,
      closeOutline,
      callOutline,
      mailOutline,
      sections:[
        {
          text:"Coaches",
          value:2
        },
        {
          text:"Yours",
          value:1
        },
      ]
    }
  },

  methods:{
    arabicPhoneToEnglish(number){
      const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      return p2e(number)
    },
    async addChat(id){
      this.loading = true;
      try {
        if (this.selectedTab === 1){
          const contact = this.contacts[this.contacts.findIndex(r => r.id === id)];
          const check = await this.$store.dispatch("api/callApi",{
            name:"requests-user",
            options:{
              func:"friends-search",
              phones:contact.phones,
              emails:contact.email
            }
          });
          if (check && check.length >0){
            await addRoom({
              users: [check[0].id, this.$store.state.user.id],
              lastUpdated: new Date(),
              typingUsers: []
            });
          }
          else{
            const phone = contact.phones.length && contact.phones[0];
            const refId = await this.$store.dispatch("api/callApi",{
              name:"requests-user",
              options:{
                func:"get_ref_id"
              }
            });
            const text = `Hi That is the invitation from me to join application, <a href='https://brain-muscle.web.app/'> https://brain-muscle.web.app/ </a> <br> My Code:${refId.refId}`
            if (phone){
              window.open(`whatsapp://send?phone=${phone}&text=${text}`, '_system');
            }
            else{
              window.open(`mailto:${contact.emails[0]}?subject='gym invitation'&body=${text}`);
            }
          }
        }
        else{
          await addRoom({
            users: [id, this.$store.state.user.id],
            lastUpdated: new Date(),
            typingUsers: []
          });
        }
        this.$emit("added")
        this.closeModal();
      }
      catch (e) {
        this.$store.commit("toast/error",e)
      }
      this.loading = false;
    },
    closeModal(){
      this.$emit("close");
      // modalController.dismiss("sss","admin","add-chat");
    },
    async getCoaches(){
      try {
        const result = await this.$store.dispatch("api/callApi", {
          name: "requests-user",
          options:{
            func:"coaches-get"
          }
        });
        if (result){
          this.coaches = result;
          this.users = this.performObject(result);
        }
      }
      catch (e) {
        this.$store.commit("toast/error",e);
        if (this.coaches){
          this.users = this.performObject(this.coaches);
        }
      }
    },
    async getContacts(){
      try {
        if(this.$store.getters.isWeb){
          this.users = [];
          return;
        }
        const prRequested = await Contacts.getPermissions()
        if (prRequested.granted){
          const result = await Contacts.getContacts();
          const contacts = [];
          for (const key in result.contacts.filter(x => x.phoneNumbers.length || x.emails.length)) {
            const contact = result.contacts[key];
            contacts.push({
              id:contact.contactId,
              profile:contact.photoThumbnail,
              name:contact.displayName,
              phones:contact.phoneNumbers.map(r => this.arabicPhoneToEnglish(r.number)),
              emails:contact.emails.map(r => r.address)
            });
          }
          this.contacts = contacts;
          this.users = this.performObject(contacts);
        }
      }
      catch (e) {
        this.$store.commit("toast/error",e)
        if (this.contacts && this.contacts.length > 0){
          this.users = this.performObject(this.contacts)
        }
      }
    },
    async change(ev,event){
      const value = ev.target.value;
      this.users = [];
      this.loading = true;
      if (value == 1){
        //ion get contacts
        await this.getContacts();
      }
      else{
        await this.getCoaches();
      }
      if (event){
        event.target.complete()
      }
      this.loading = false;
    }
  },
  mounted() {
    this.change({target:{value:2}})
  }
}
</script>

<style scoped>

</style>
