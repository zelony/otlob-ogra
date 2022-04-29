<template>
  <ion-page>
    <home-header />
    <ion-content fullscreen>
      <Fully_map/>
      <template v-if="type === 'x'"/>
      <start-trip v-else/>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonPage,IonContent} from "@ionic/vue"
import HomeHeader from "@/views/user/main/components/homeHeader";
import Fully_map from "@/views/user/main/components/map";
import {mapState} from "vuex";
import StartTrip from "@/views/user/main/components/startTrip";
export default {
  name: "user-home",
  components: {StartTrip, Fully_map, HomeHeader,IonPage,IonContent},
  computed:{
    ...mapState({type:state =>state.home.type })
  },
}
</script>

<style scoped>

</style>
