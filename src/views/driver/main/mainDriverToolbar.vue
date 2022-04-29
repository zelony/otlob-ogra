<template>
<ion-header collapse="fade" translucent>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button router-link="/user/profile">
        <ion-icon slot="icon-only" :icon="personCircle"/>
      </ion-button>
    </ion-buttons>
    <ion-title class="ion-text-center ion-text-capitalize">{{ $t($route.name) }}</ion-title>
    <ion-buttons slot="end">
      <ion-button router-link="/user/wallet">
        <ion-icon slot="icon-only" :icon="walletOutline"/>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
</template>

<script>
import {IonHeader,IonToolbar,IonTitle,IonButtons,IonButton,IonIcon} from "@ionic/vue"
import {personCircle,walletOutline} from "ionicons/icons"
export default {
  name: "mainUserToolbar",
  components:{IonHeader,IonToolbar,IonTitle,IonButtons,IonButton,IonIcon},
  setup(){
    return{
      personCircle,
      walletOutline
    }
  }
}
</script>

<style>

</style>
