<template>
<ion-page>
  <ion-header collapse="fade" translucent>
    <ion-toolbar>
      <ion-title class="ion-text-center">{{ $t("Select car") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <List_overload api-name="cars-select" limit="10">
      <template v-slot:element="{el}">
        {{el}}
      </template>
      <template v-slot:no-data>
        <Warning_alert :text="$t('no cars you are a driver in')"/>
      </template>
    </List_overload>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="modalOpen = true">
        <ion-icon :icon="addOutline"/>
      </ion-fab-button>
    </ion-fab>
    <ion-modal animated canDismiss handle @didDismiss="modalOpen = false" :is-open="modalOpen">
      <add-car-modal/>
    </ion-modal>
  </ion-content>
</ion-page>
</template>

<script>
import {IonPage,IonModal,IonTitle,IonFab,IonFabButton,IonIcon,IonContent,IonHeader,IonToolbar} from "@ionic/vue";
import List_overload from "@/components/list_overload";
import Warning_alert from "@/components/warning_alert";
import {addOutline} from "ionicons/icons"
import AddCarModal from "@/views/driver/modals/addCarModal";
export default {
  name: "driver-selectCar",
  setup(){
    return{
      addOutline
    }
  },
  data:()=>({
    modalOpen:false
  }),
  components:{
    AddCarModal,
    Warning_alert, List_overload,IonModal,IonFab,IonFabButton,IonIcon, IonPage,IonTitle,IonContent,IonHeader,IonToolbar}
}
</script>

<style scoped>

</style>
