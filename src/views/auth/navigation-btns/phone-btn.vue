<template>
  <ion-button class="auth_button" router-link="/auth/phone" fill="outline" color="primary" >
    <ion-icon slot="icon-only" :icon="callOutline"/>
  </ion-button>
</template>

<script>
import {IonButton,IonIcon} from "@ionic/vue";
import {callOutline} from "ionicons/icons";

export default {
  name: "phone-btn",
  components:{IonButton,IonIcon},
  setup(){
    return{
      callOutline
    }
  }
}
</script>

<style scoped>

</style>
