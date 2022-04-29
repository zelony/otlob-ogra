<template>
  <ion-page>
    <ion-router-outlet/>
  </ion-page>
</template>

<script>
import {IonPage,IonRouterOutlet} from "@ionic/vue";
export default {
  name: "auth-handler",
  components:{IonPage,IonRouterOutlet},
}
</script>

<style scoped>
.logo_contain{
  height: 150px;
  width: 260px;
  position: relative;
}
.logo{
  font-size: 360px;
  position: absolute;
  top: -50%;
  left: -20%;
}
</style>
