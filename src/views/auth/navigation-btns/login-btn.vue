<template>
  <ion-button class="auth_button" router-link="/auth/login" fill="outline" color="primary" >
    <ion-icon slot="icon-only" :icon="logInOutline"/>
  </ion-button>
</template>

<script>
import {IonButton,IonIcon} from "@ionic/vue";
import {logInOutline} from "ionicons/icons";
export default {
  name: "login-btn",
  components:{IonButton,IonIcon},
  setup(){
    return{
      logInOutline
    }
  }
}
</script>

<style scoped>

</style>
