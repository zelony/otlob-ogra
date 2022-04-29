<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title class="ion-text-center">{{ $t('Add trip') }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <point-selector :label="$t('from')" v-model="trip.f"/>
      <point-selector :label="$t('to')" v-model="trip.t"/>
    </ion-list>
  </ion-content>
</template>

<script>
import {IonContent,IonTitle,IonHeader,IonToolbar,IonList} from "@ionic/vue"
import {mapOutline} from "ionicons/icons"
import PointSelector from "@/components/inputs/pointSelector";
import {mapState} from "vuex";
export default {
  name: "addTrip",
  components:{PointSelector,IonTitle, IonContent,IonList,IonHeader,IonToolbar},
  computed:{
    ...mapState({trip:state => state.trip.new}),
  },
  setup(){
    return{
      mapOutline
    }
  }
}
</script>

<style scoped lang="scss">
ion-list{

}
</style>
