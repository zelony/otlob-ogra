<template>
  <ion-page>
    <ion-content>
      <ion-card color="transparent" class="pa-2 card">
        <Auth_header/>
        <ion-card-header>
          <ion-card-title class="ion-text-center ion-text-capitalize">{{$t('Username Login')}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="login">
            <ion-item class="custom-item">
              <ion-icon slot="start" :icon="atOutline"/>
              <ion-input class="input"  v-model="username" />
            </ion-item>
            <ion-item class="custom-item" >
              <ion-icon slot="start"  :icon="lockClosedOutline"/>
              <ion-input class="input" v-model="password" />
            </ion-item>
            <Errors_alerts :errors="v$.$errors"/>
            <Loading_btn :loading="loading" type="submit" class="submit-button" expand="block" shape="round" color="primary" >
              {{$t('Login')}}
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
              <sign-up-btn/>
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
import {IonCard,IonCardTitle,IonCardHeader,IonPage,IonContent,IonRow,IonCol,IonCardContent,IonItem,IonInput,IonIcon} from "@ionic/vue"
import {atOutline,lockClosedOutline} from "ionicons/icons"
import Loading from "@/mixins/loading";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {appDomain} from "@/CONFIG";
import Loading_btn from "@/components/loading_button";
import Auth_header from "@/views/auth/components/auth_header";
import {isEmail} from "@/methods/isEmail";
import useVuelidate from '@vuelidate/core'
import { required, } from '@vuelidate/validators'
import {defineAsyncComponent} from "vue";

export default {
  name: "auth-login",
  mixins:[Loading],
  setup(){
    return{
      atOutline,lockClosedOutline,
      v$:useVuelidate()
    }
  },
  validations () {
    return {
      username: { required }, // Matches this.firstName
      password: { required }, // Matches this.lastName
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
  components:{
    Errors_alerts:defineAsyncComponent(() => import("../../../components/errors_alerts")),
    PhoneBtn:defineAsyncComponent(() => import("../navigation-btns/phone-btn")),
    SignUpBtn:defineAsyncComponent(()=>import("../navigation-btns/sign-up")),
    Facebook_sign_in:defineAsyncComponent(()=>import("../components/facebook_sign_in")),
    Google_sign_in:defineAsyncComponent(()=>import("../components/google_sign_in")),
    Auth_header,IonCardTitle,IonCardHeader,
    Loading_btn,IonPage,IonContent,
   IonCard,IonRow,IonCol,IonCardContent,IonItem,IonInput,IonIcon
  },
  methods:{
    async login(){
      if(!this.$store.state.network.connected){
        this.$store.commit("toast/internetNeeded");
        return;
      }
      if (!(await this.v$.$validate())){
        return;
      }
      this.loading = true;
        try {
          await signInWithEmailAndPassword(
              getAuth(),
              isEmail(this.username) ? this.username :`${this.username}@${appDomain}`,
              this.password
          );
        } catch (e) {
          this.$store.commit("toast/error", e);
        }
      this.loading = false;
    }
  },
}
</script>

<style lang="scss">
@import "../st";
</style>
