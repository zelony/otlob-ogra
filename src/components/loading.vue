<template>
  <ion-page ref="element" v-if="loading.enabled && loading.show">
    <ion-content color="light">
      <div class="center" style="flex-direction: column">
        <Loader_component/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonPage,IonContent} from "@ionic/vue"
import Loader_component from "@/components/loader_component";
import {mapState} from "vuex";
export default {
  name: "loading_screen",
  computed:{
    ...mapState({loading:state => state.loading})
  },
  components: {Loader_component,IonPage,IonContent}
}
</script>

<style scoped>

</style>
