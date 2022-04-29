<template>
  <Loading_btn fill="outline" class="auth_button" v-bind="$attrs" @click="loginFacebook" :loading="loading">
    <ion-icon :icon="logoFacebook" slot="icon-only"/>
  </Loading_btn>
</template>

<script>
import {IonIcon} from "@ionic/vue";
import {logoFacebook} from "ionicons/icons";
import providerMixin from "../mixins/providerMixin";
import Loading_btn from "@/components/loading_button";

export default {
  name: "facebook_sign_in",
  mixins:[providerMixin],
  components:{
    Loading_btn,
    IonIcon,
  },
  setup(){
    return{
      logoFacebook
    }
  },
  methods:{
    async loginFacebook() {
      this.loading = true;
      try {
        await this.getFacebookAction();
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
.auth_button{
  --color: #4267B2;
  --border-color: #4267B2;
  --ripple-color:#4267B2
}
</style>
