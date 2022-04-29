<template>
  <ion-button class="auth_button" router-link="/auth/sign-up" fill="outline" color="primary" >
    <ion-icon :icon="personAddOutline"/>
  </ion-button>
</template>

<script>
import {IonButton,IonIcon} from "@ionic/vue";
import {personAddOutline} from "ionicons/icons"
export default {
  name: "sign-up-btn",
  components:{IonButton,IonIcon},
  setup(){
    return{
      personAddOutline
    }
  }
}
</script>

<style scoped>

</style>
