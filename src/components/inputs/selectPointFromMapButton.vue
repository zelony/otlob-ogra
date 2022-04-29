<template>
  <ion-button v-bind="$attrs" fill="outline" expand="block" @click="modalOpen = true">
    <ion-icon slot="start" :icon="mapOutline"/>
    {{$t('Select from map')}}
  </ion-button>
  <ion-modal :breakpoints="[0,1]" initial-breakpoint="1" canDismiss handle swipe-to-close  @didDismiss="modalOpen = false" animated :is-open="modalOpen">
    <select-point-map @update:modelValue="changeModal"/>
  </ion-modal>
</template>

<script>
import {IonButton, IonIcon, IonModal} from "@ionic/vue"
import {mapOutline} from "ionicons/icons"
import selectPointMap from "@/modals/selectPointMap";
export default {
  name: "selectPointFromMapButton",
  components:{IonButton,IonIcon,IonModal,selectPointMap},
  setup(){
    return{
      mapOutline
    }
  },
  data:()=>({modalOpen:false}),
  methods:{
    changeModal(ev){
      this.$emit('update:modelValue',ev);
      this.modalOpen = false;
    }
  }
}
</script>

<style scoped>
ion-button{
  margin: 0;
}
</style>
