<template>
  <ion-split-pane content-id="main-content">
    <main-menu/>
    <ion-router-outlet id="main-content"/>
  </ion-split-pane>
</template>

<script>
import {  IonRouterOutlet, IonSplitPane } from '@ionic/vue';
import MainMenu from "@/views/user/main/components/MainMenu";
export default {
  name: "mainView",
  components: {
    MainMenu,
    IonRouterOutlet,
    IonSplitPane,
  },
}
</script>

<style lang="scss" scoped>
.menu-content{
  transition: .5s;
  //&.menu-content-open{
  //  top: 5%;
  //  bottom: 5%;
  //
  //}
}
</style>
