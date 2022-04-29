<template>
<auto-complete style="--min-height: 20px;--padding-top: 0px;--padding-bottom: 0px" :loading="loading" @fetch="getItems" :items-available="items.length >0">
  <template v-slot:elements>
    <ion-item v-for="(item,i) in items" :key="i" @click="()=>emitLocation(item.geometry.location)">
      <ion-icon slot="start" :icon="locationOutline"/>
      {{item.name}}
    </ion-item>
  </template>
</auto-complete>
</template>

<script>
import AutoComplete from "@/components/inputs/autoComplete";
import {IonItem, IonIcon} from "@ionic/vue"
import {locationOutline} from "ionicons/icons"
export default {
  name: "googlePlacesSelector",
  setup(){
    return{
      locationOutline
    }
  },
  components: {AutoComplete,IonItem,IonIcon},
  data:()=>({
    items:[],
    loading:false
  }),
  emits:["update:modelValue"],
  methods:{
    emitLocation(item){
      this.$emit("update:modelValue",{lat:item.lat(),lng:item.lng()});
    },
    getItems(ev) {
      const val = ev.target.value;
      this.items = [];
      if (val && val.trim() !== '') {
        const location = this.$store.state.map.currentLocation;
        const request = {
          query: val.trim(),
          fields: ['name', 'geometry'],
          locationBias: {radius: 10000, center: {lat: location.lat,lng:location.lng}}
        };
        const service = new window.google.maps.places.PlacesService(this.$store.state.map.map);
        this.loading = true;
        service.findPlaceFromQuery(request, (results, status) => {
          this.loading = false;
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            this.items = results;
          }
        })
      }
    }
  }
}
</script>

<style scoped>
ion-item{
  --min-height: 28px;
  --padding-bottom: 10px;
  --padding-top: 10px;
}
</style>
