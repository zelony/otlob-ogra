<template>
  <ion-button :disabled="facebookValid" @click="linkWithFacebook" :color="facebookValid ? 'success' : 'tertiary'">
    <ion-icon :icon="logoFacebook"></ion-icon>
  </ion-button>
</template>

<script>
import{IonButton,IonIcon} from "@ionic/vue";
import {logoFacebook} from "ionicons/icons";
import {fbAuth} from 'zelony-vue3-ionic-firebase-auth';
export default {
  mixins:[fbAuth],
  components:{IonButton,IonIcon},
  setup(){
    return{
      logoFacebook
    }
  },
  name: "linkWithFacebook"
}
</script>

<style scoped>

</style>
