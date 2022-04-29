<template>
  <ion-header class="bg-transparent">
    <ion-toolbar class="transparent border-b-2 border-primary">
      <ion-buttons slot="primary">
        <ion-button  class="text-primary relative" @click="closeModal">
          <ion-icon slot="icon-only"  :icon="closeOutline"/>
        </ion-button>
      </ion-buttons>
      Add New Chat
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, modalController} from "@ionic/vue";
import {closeOutline} from "ionicons/icons";
export default {
  name: "add_new_chat_toolbar",
  components:{IonHeader,IonToolbar,IonButtons,IonButton,IonIcon},
  setup(){
    return{
      closeOutline
    }
  },
  methods:{
    closeModal(){
      modalController.dismiss();
    }
  }
}
</script>