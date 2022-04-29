<template>
<ion-item v-bind="$attrs" color="warning">
  <ion-icon slot="start" :icon="warningOutline"/>
  <ion-label>{{text || $t('warning')}}</ion-label>
</ion-item>
</template>

<script>
import {IonItem,IonIcon,IonLabel} from "@ionic/vue";
import {warningOutline} from "ionicons/icons"
export default {
  name: "warning_alert",
  setup(){
    return{
      warningOutline
    }
  },
  props:{
    text:String
  },
  components:{IonItem,IonIcon,IonLabel}
}
</script>

<style scoped>

</style>
