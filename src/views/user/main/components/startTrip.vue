<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button @click="addTripModal">
      <ion-icon :icon="add"/>
    </ion-fab-button>
  </ion-fab>
</template>

<script>
import {modalController,IonIcon,IonFab,IonFabButton} from "@ionic/vue";
import addTrip from "@/views/user/main/modals/addTrip";
import {add} from "ionicons/icons"
export default {
  name: "startTrip",
  components:{IonFab,IonFabButton,IonIcon},
  setup(){
    return{
      add
    }
  },
  data:()=>({
    addTrip:true
  }),
  methods:{
    async addTripModal(){
      // eslint-disable-next-line no-constant-condition
      const modal = await modalController.create({
        component: addTrip,
        breakpoints: [0,0.5,1],
        initialBreakpoint: 0.5,
        backdropBreakpoint:0.2,
        swipeToClose:true,
        cssClass:"add-trip",
        showBackdrop:true
      });
      await modal.present();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
