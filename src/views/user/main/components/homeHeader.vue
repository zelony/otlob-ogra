<template>
  <ion-header transclusent class="fixed">
    <ion-toolbar color="transparent" class="border-none">
      <ion-buttons slot="start" class="nav-button">
        <ion-menu-button />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {IonHeader,IonToolbar,IonButtons,IonMenuButton} from "@ionic/vue";
export default {
  name: "homeHeader",
  components:{IonHeader,IonToolbar,IonButtons,IonMenuButton}
}
</script>
<style lang="scss" scoped>
ion-header::after{
  background: none;
}
ion-menu-button{
  color:var(--ion-color-primary-contrast)
}
</style>

<style lang="scss" scoped>
.nav-button{
  background: var(--ion-color-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
