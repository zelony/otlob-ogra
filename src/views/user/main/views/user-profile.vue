<template>
  <ion-page>
    <home-header />
    <ion-content></ion-content>
  </ion-page>
</template>

<script>
import {IonPage,IonContent} from "@ionic/vue"
import HomeHeader from "@/views/user/main/components/homeHeader";
export default {
  name: "user-profile",
  components:{HomeHeader, IonPage,IonContent}

}
</script>

<style scoped>

</style>
