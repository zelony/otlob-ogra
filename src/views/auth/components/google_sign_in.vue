<template>
  <Loading_btn style="--ripple-color:rgba(var(--ion-color-danger),0.2)" class="auth_button" fill="outline" color="danger"  v-bind="$attrs" @click="loginWithGoogle" :loading="loading">
    <ion-icon :icon="logoGoogle" slot="icon-only"/>
  </Loading_btn>
</template>

<script>
import {IonIcon} from "@ionic/vue";
import {logoGoogle} from "ionicons/icons";
import providerMixin from "../mixins/providerMixin";
import Loading_btn from "../../../components/loading_button";
export default {
  name: "google_sign_in",
  mixins:[providerMixin],
  components:{
    Loading_btn,
    IonIcon,
  },
  setup(){
    return{
      logoGoogle
    }
  },
  methods:{
    async loginWithGoogle() {
      this.loading = true;
      try {
        await this.getGoogleAction();
      } catch (e) {
        await this.handleProviderError(e);
      }
      this.loading = false;
    }
  },
  data: () => ({ loading: false, error: null }),
}
</script>

<style scoped>

</style>
