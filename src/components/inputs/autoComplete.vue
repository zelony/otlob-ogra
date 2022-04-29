<template>
  <ion-item v-bind="$attrs" class="ion-margin-top custom-item" >
    <ion-icon slot="start" :icon="searchOutline"/>
    <ion-input :placeholder="$t('name of place')" :debounce="debounce" @ionChange="change"/>
  </ion-item>
  <slot name="above-list"/>
  <Loader_component v-if="loading"/>
  <ion-list v-else-if="itemsAvailable">
    <slot name="elements"/>
  </ion-list>
</template>

<script>
import {IonList,IonIcon,IonInput,IonItem} from "@ionic/vue";
import {searchOutline} from "ionicons/icons"
import Loader_component from "@/components/loader_component";
export default {
  name: "autoComplete",
  setup(){
    return{
      searchOutline
    }
  },
  components:{Loader_component,IonInput,IonItem, IonIcon,IonList},
  methods:{
    change($event){
      this.$emit('fetch',$event)
    }
  },
  props:{
    itemsAvailable:{
      type:Boolean,
      default:true
    },
    loading:{
      type:Boolean,
      default:false
    },
    debounce:{
      type:[String,Number],
      default:500
    }
  }
}
</script>

<style scoped>

</style>
