<template>
  <ion-page>
    <home-header />
    <ion-content></ion-content>
  </ion-page>
</template>

<script>
import HomeHeader from "@/views/user/main/components/homeHeader";
import {IonContent, IonPage} from "@ionic/vue";

export default {
  name: "driver-history",
  components:{HomeHeader, IonPage,IonContent}
}
</script>

<style scoped>

</style>
