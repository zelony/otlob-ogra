<template>
  <ion-button :disabled="googleValid" @click="googleValid ? unlink() :linkWithGoogle()" :color="googleValid ? 'success' : 'tertiary'">
    <ion-icon :icon="logoGoogle"></ion-icon>
  </ion-button>
</template>

<script>
import{IonButton,IonIcon} from "@ionic/vue";
import {goAuth} from 'zelony-vue3-ionic-firebase-auth';
import {logoGoogle} from 'ionicons/icons';
export default {
  name: "linkWithGoogle",
  mixins:[goAuth],
  components:{IonButton,IonIcon},
  setup(){
    return{
      logoGoogle
    }
  },
}
</script>

<style scoped>

</style>
