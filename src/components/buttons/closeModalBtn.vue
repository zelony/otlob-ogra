<template>
  <ion-button @click="close">
    <ion-icon slot="icon-only" :icon="closeOutline"/>
  </ion-button>
</template>

<script>
import {IonButton,IonIcon,modalController} from "@ionic/vue"
import {closeOutline} from "ionicons/icons"
export default {
  name: "closeModalBtn",
  setup(){
    return {
      closeOutline,
    }
  },
  methods:{
    close(){
      console.log("clicked")
      modalController.dismiss();
    }
  },
  components:{IonButton,IonIcon}
}
</script>

<style lang="scss" scoped>
$mainMargin: 5px;
ion-button{
  position: absolute;
  right:  $mainMargin;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  z-index: 6;
}
body.rtl{
  ion-button{
    left: $mainMargin;
    right: unset;
  }
}
</style>
