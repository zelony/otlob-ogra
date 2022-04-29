<template>
<ion-page>
  <ion-header collapse="fade" translucent>
    <ion-toolbar>
      <ion-title class="ion-text-center">{{ $t("Complete data") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <image_selector v-model="fields.nf" v-if="data.nf" :label="$t('National face')" />
      <image_selector v-model="fields.nb" v-if="data.nb" :label="$t('National back')"/>
      <image_selector v-model="fields.ls" v-if="data.ls" :label="$t('License face')"/>
      <image_selector v-model="fields.le" v-if="data.le" :label="$t('License back')"/>
      <ion-item>
        <ion-icon slot="start"/>
        <ion-label>{{$t('manager')}}</ion-label>
        <ion-toggle slot="end" v-model="manager"/>
      </ion-item>
    </ion-list>
  </ion-content>
</ion-page>
</template>

<script>
import {IonPage,IonHeader,IonLabel,IonList,IonToolbar,IonTitle,IonContent,IonItem,IonIcon,IonToggle} from "@ionic/vue"
import image_selector from "@/components/inputs/image_selector";
import {mapState} from "vuex";
import  {personSharp} from "ionicons/icons"
export default {
  name: "driver-completeData",
  components:{IonLabel,image_selector, IonPage,IonHeader,IonList,IonToolbar,IonTitle,IonContent,IonItem,IonIcon,IonToggle},
  computed:{
    ...mapState({data:state => state.driver.data})
  },
  data:()=>({
    fields:{},
    manager:false
  }),
}
</script>

<style scoped>

</style>
