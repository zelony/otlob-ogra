<template>
  <ion-item fill="outline">
    <ion-icon slot="start" :icon="mapOutline"/>
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-input
        autocomplete="off"
        autocorrect="off"
        required
        :modelValue="modelValue? `${modelValue.lat}-${modelValue.lng}` : undefined"
        @ionFocus="modalOpen = true"
    ></ion-input>
  </ion-item>
  <ion-modal can-dismiss
             handle
             :initial-breakpoint=".95"
             show-backdrop
             :backdrop-breakpoint=".95"
             :breakpoints="[0,.95]"
             @didDismiss="modalOpen = false"
             animated
             :is-open="modalOpen" >
    <select-point :modelValue="modelValue" @update:modelValue="changePoint" />
  </ion-modal>
</template>

<script>
import {IonItem,IonModal, IonLabel, IonInput, IonIcon} from "@ionic/vue"
import {mapOutline} from "ionicons/icons"
import SelectPoint from "@/modals/selectPoint";
export default {
  name: "pointSelector",
  components:{SelectPoint,IonModal, IonItem,IonLabel,IonInput,IonIcon},
  setup(){
    return{
      mapOutline
    }
  },
  data:()=>({
    modalOpen:false,
  }),
  props:{
    label:{
      type:String,
      default:null
    },
    modelValue:{
      type:Object,
      default:null
    }
  },
  methods:{
    changePoint(ev){
      this.$emit('update:modelValue',ev);
      this.modalOpen = false;
    },
  }
}
</script>

<style scoped>

</style>
