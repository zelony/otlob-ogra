<template>
<ion-page>
  <ion-content>
    <div class="w-full h-full" ref="map" />
    <ion-fab vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button color="danger" @click="close">
        <ion-icon :icon="closeOutline"/>
      </ion-fab-button>
    </ion-fab>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button color="success" @click="emitLocation"><ion-icon :icon="checkmark"/></ion-fab-button>
    </ion-fab>
  </ion-content>
</ion-page>
</template>

<script>
import {IonPage, IonContent, IonFab, IonFabButton, IonIcon, modalController} from "@ionic/vue";
import {mapState} from "vuex";
import {checkmark,closeOutline} from "ionicons/icons"
export default {
  name: "selectPointMap",
  components:{IonPage,IonContent,IonFab,IonFabButton,IonIcon},
  setup(){
    return{
      checkmark,closeOutline,
      close(){
        modalController.dismiss();
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.createMap();
    })
  },
  computed:{
    ...mapState({currentLocation:state => state.map.currentLocation})
  },
  data:()=>({
    map:null,
    marker:null,
    current:null
  }),
  methods:{
    emitLocation(){
      this.$emit("update:modelValue",this.current);
      modalController.dismiss();
    },
    createMap(){
      this.map = new window.google.maps.Map(this.$refs.map, {
        center: { lat: this.currentLocation.lat, lng: this.currentLocation.lng },
        zoom: 12,
        disableDefaultUI: true
      });
      this.current = this.currentLocation;
      this.createMarker();
      window.google.maps.event.addListener(this.map, 'center_changed', () => {
        this.marker.setPosition(this.map.center);
        this.current = {lat:this.map.center.lat(),lng:this.map.center.lng()}
      });
    },
    createMarker(){
      this.marker = new window.google.maps.Marker({
        position: { lat: this.currentLocation.lat, lng: this.currentLocation.lng },
        map:this.map,
        title: "U",
        label: {
          text: "U",
          color: "#ffffff",
        },
      });
    }
  }
}
</script>

<style scoped>

</style>
