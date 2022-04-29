<template>
  <ion-page>
    <ion-content>
      <ion-card color="transparent" class="pa-2 card">
        <Auth_header/>
        <ion-card-header>
          <ion-card-title class="ion-text-center ion-text-capitalize">{{$t('Sign up')}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="signUp">
            <ion-item class="custom-item">
              <ion-icon slot="start" :icon="atOutline"/>
              <ion-input class="input"  v-model="username" />
            </ion-item>
            <ion-item class="custom-item" >
              <ion-icon slot="start"  :icon="lockClosedOutline"/>
              <ion-input class="input" v-model="password" />
            </ion-item>
            <Loading_btn :loading="loading" type="submit" class="submit-button" expand="block" shape="round" color="primary" >
              {{$t('Sign Up')}}
            </Loading_btn>
          </form>
        </ion-card-content>
        <div class="mx-3.5 h-0.5 shadow-sm divider" />
        <ion-card-content>
          <ion-row>
            <ion-col size="3">
              <Google_sign_in/>
            </ion-col>
            <ion-col size="3">
              <Facebook_sign_in/>
            </ion-col>
            <ion-col size="3">
              <login-btn/>
            </ion-col>
            <ion-col size="3">
              <phone-btn/>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonCard,IonCardHeader,IonCardTitle,
  IonCardContent,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,IonPage,IonContent,
  IonRow, useIonRouter
} from "@ionic/vue";
import {atOutline, lockClosedOutline} from "ionicons/icons";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {appDomain} from "@/CONFIG";
import Loading_btn from "@/components/loading_button";
import Auth_header from "@/views/auth/components/auth_header";
import Google_sign_in from "../components/google_sign_in";
import Facebook_sign_in from "../components/facebook_sign_in";
import LoginBtn from "../navigation-btns/login-btn";
import PhoneBtn from "../navigation-btns/phone-btn";
import {isEmail} from "@/methods/isEmail";
export default {
  name: "sign-up",
  components:{
    PhoneBtn,
    LoginBtn,IonPage,IonContent,
    Facebook_sign_in,
    Google_sign_in,
    Auth_header,
    Loading_btn,
 IonCard,IonRow,IonCardHeader,IonCardTitle,IonCol,IonCardContent,IonItem,IonInput,IonIcon},
  setup(){
    return{
      router:useIonRouter(),
      atOutline,lockClosedOutline,
    }
  },
  computed:{
    username:{
      get(){
        return this.$store.state.user.username
      },
      set(val){
        this.$store.commit('user/set',['username',val])
      }
    },
    password:{
      get(){
        return this.$store.state.user.password
      },
      set(val){
        this.$store.commit('user/set',['password',val])
      }
    }
  },
  data:()=>({loading:false}),
  methods:{
  async signUp(){
    if(!this.$store.state.network.connected){
      this.$store.commit("toast/internetNeeded");
      return;
    }
    this.loading = true;
    try {
      await createUserWithEmailAndPassword(
          getAuth(),
          isEmail(this.username) ? this.username :`${this.username}@${appDomain}`,
          this.password
      );
    } catch (e) {
      if (e.code === "auth/email-already-in-use"){
        await this.router.push('/login');
      }
      else{
        this.$store.commit("toast/error", e);
      }
    }
    this.loading = false;
  }

  }
}


</script>

<style lang="scss">
@import "../st";
</style>
