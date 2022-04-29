<template>
  <ion-page>
    <ion-content>
      <ion-button router-link="/user/home"/>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonPage,IonButton,IonContent} from "@ionic/vue"
export default {
  name: "user-rating",
  components:{ IonPage,IonButton,IonContent}
}
</script>

<style scoped>

</style>
