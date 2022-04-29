<template>
  <ion-refresher slot="fixed" @ionRefresh="fetchInfiniteApi($event,true)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <template v-if="elements.length > 0">
    <ion-grid>
      <ion-row>
        <ion-col size="12" size-md="6" size-lg="4" size-xl="3" v-for="(el) in filteredAndSorted" :key="el.id" >
          <slot name="element" :el="el"/>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-infinite-scroll
        @ionInfinite="fetchInfiniteApi($event,false)"
        threshold="100px"
        id="infinite-scroll"
        :disabled="finished"
    >
      <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </template>
  <div class="flex justify-center align-center" style="height: 100%" v-else-if="loading">
    <Loader_component/>
  </div>
  <slot v-else name="no-data"/>
</template>

<script>
import {
  IonCol,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonRow
} from "@ionic/vue";
import infinitescroll from "../mixins/infinitescroll";
import Loader_component from "./loader_component";

export default {
  name: "list_overload",
  mixins:[infinitescroll],
  components:{
    Loader_component,
    IonGrid,IonRefresher,IonRefresherContent,IonInfiniteScrollContent,IonInfiniteScroll,IonRow,IonCol,
  },
  data:()=>({
    elements:[]
  }),
  computed:{
    infiniteScroll(){
      return{
        limit:this.limit,
        key:'elements',
      }
    },
    filteredAndSorted(){
      let elements = this.elements;
      if (this.filterFunction){
        elements = this.filterFunction(elements);
      }
      if (this.sortFunction){
        elements = elements.sort(this.sortFunction);
      }
      return elements;
    }
  },
  props:{
    apiName:{
      type:String,
      required:true
    },
    limit:{
      type:[Number,String],
      default:20
    },
    disabled:{
      type:[Boolean],
      default:false
    },
    options:{},
    sortFunction:Function,
    filterFunction:Function
  }
}
</script>

<style scoped>

</style>