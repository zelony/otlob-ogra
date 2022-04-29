<template>
  <ion-header collapse="fade" translucent>
    <ion-toolbar>
      <ion-buttons class="return-back" @click="canGoBack">
        <ion-button>
          <ion-icon slot="icon-only" :icon="chevronBackOutline"/>
        </ion-button>
      </ion-buttons>
      <ion-title class="ion-text-center">{{ $t("edit profile") }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, useIonRouter} from "@ionic/vue"
import {chevronBackOutline} from "ionicons/icons";
export default {
  name: "userProfileToolbar",
  components:{IonHeader,IonToolbar,IonButtons,IonButton,IonIcon,IonTitle},
  setup(){
    const router = useIonRouter();
    return{
      chevronBackOutline,
      canGoBack(){
        if (router.canGoBack()){
          return router.back();
        }
        router.replace("/user")
      }
    }
  }
}
</script>

<style scoped>
.return-back{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
