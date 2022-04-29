<template>
  <ion-menu content-id="main-content" type="reveal">
    <ion-content>
      <ion-list id="inbox-list">
        <ion-menu-toggle auto-hide="false">
          <ion-item router-link="/user/home" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
<!--            <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>-->
            <ion-label>home</ion-label>
          </ion-item>
          <ion-item router-link="/user/family" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
            <!--            <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>-->
            <ion-label>family</ion-label>
          </ion-item>
          <ion-item router-link="/user/rating" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
            <!--            <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>-->
            <ion-label>rating</ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
          <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
            <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
            <ion-label>{{ p.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
      <ion-list id="labels-list" v-if="false">
        <ion-list-header>Labels</ion-list-header>

        <ion-item v-for="(label, index) in labels" lines="none" :key="index">
          <ion-icon slot="start" :ios="bookmarkOutline" :md="bookmarkSharp"></ion-icon>
          <ion-label>{{ label }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script>
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/vue";
import {bookmarkOutline, bookmarkSharp} from "ionicons/icons";

export default {
  name: "MainMenu",
  components:{
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
  },
  setup(){
    return{
      bookmarkOutline,
      bookmarkSharp,
      appPages:[],
      selectedIndex:0,
      labels:[]
    }
  }
}
</script>

<style scoped>

</style>
