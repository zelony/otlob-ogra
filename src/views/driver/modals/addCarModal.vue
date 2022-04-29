<template>
<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-button @click="dismiss">
        <ion-icon :icon="closeOutline"/>
      </ion-button>
    </ion-buttons>
    <ion-title>{{$t('new car')}}</ion-title>
  </ion-toolbar>
</ion-header>
  <ion-content class="ion-padding">
    <form @submit.prevent="addCar">
      <ion-item fill="outline">
        <ion-icon slot="start" :icon="atOutline"/>
        <ion-label position="floating">{{$t('Car Name')}}</ion-label>
        <ion-input :placeholder="$t('First car name')" v-model="newCar.name"/>
      </ion-item>
      <ion-item fill="outline">
        <ion-icon slot="start" :icon="atOutline"/>
        <ion-label position="floating">{{$t('Car Name')}}</ion-label>
        <ion-input :placeholder="$t('First car name')" v-model="newCar.name"/>
      </ion-item>
      <color-picker v-model="newCar.color" :label="$t('Color')" />
      <Image_selector :label="$t('License face')" v-model="newCar.lic_start"/>
      <Image_selector :label="$t('License back')" v-model="newCar.lic_end"/>
      <Image_selector :label="$t('Car Label')" v-model="newCar.car_label_image"/>
    </form>
  </ion-content>
</template>

<script>
import {
  IonHeader,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  modalController
} from "@ionic/vue"
import {atOutline,closeOutline,calendarOutline,colorPaletteOutline} from "ionicons/icons"
import Image_selector from "@/components/inputs/image_selector";
import ColorPicker from "@/components/inputs/color_picker";

export default {
  name: "addCarModal",
  components:{Image_selector,ColorPicker, IonHeader,IonButton,IonButtons,IonToolbar,IonTitle,IonContent,IonItem,IonIcon,IonLabel},
  setup(){
    return{
      atOutline,calendarOutline,colorPaletteOutline,closeOutline,
      dismiss(){
        modalController.dismiss();
      }
    }
  },
  data:()=>({
    newCar:{
      name:null,
      model:null,
      color:null,
      label:null,
      lic_start:null,
      lic_end:null,
      car_label_image:null
    }
  }),
  methods:{
    addCar(){

    }
  }
}
</script>

<style scoped>

</style>
