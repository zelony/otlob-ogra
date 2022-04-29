<template>
  <ion-header>
    <ion-toolbar color="primary">
      <close-modal-btn/>
      <ion-title>{{$t('Select Point')}}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <select-point-from-map-button @update:modelValue="change"/>
      <google-places-selector @update:modelValue="change"/>
    </ion-list>
  </ion-content>
</template>

<script>
import GooglePlacesSelector from "@/components/inputs/googlePlacesSelector";
import {modalController} from "@ionic/vue";
import SelectPointFromMapButton from "@/components/inputs/selectPointFromMapButton";
import CloseModalBtn from "@/components/buttons/closeModalBtn";
import {IonHeader,IonToolbar,IonTitle,IonContent,IonList} from "@ionic/vue";

export default {
  name: "selectPointModal",
  components: {IonHeader,IonToolbar,IonTitle,IonContent,IonList,CloseModalBtn, SelectPointFromMapButton, GooglePlacesSelector},
  emits:["update:modelValue"],
  methods:{
    change(ev){
      this.$emit("update:modelValue",ev)
      modalController.dismiss()
    },
  }
}
</script>

<style lang="scss" scoped>
ion-list{
  ion-item{
    margin: 5px 0;
  }
}
</style>
