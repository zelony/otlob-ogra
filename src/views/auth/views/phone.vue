<template>
  <ion-page>
    <ion-content  fullscreen>
      <ion-card color="transparent" ref="card" class="pa-2 card">
        <ion-card-content>
          <form @submit.prevent="checkPhone">
            <ion-item class="custom-item dark">
              <template v-if="confirmed">
                <ion-icon slot="start"  :icon="barcodeOutline"/>
                <ion-input maxLength="6" type="number" :placeholder="code  || 'Write Code'" v-model="code"/>
              </template>
              <template v-else>
                <ion-icon slot="start"  :icon="callOutline"/>
                <ion-input maxLength="11" type="number" :placeholder="phone  || 'No Phone Number'" v-model="phone"/>
              </template>
            </ion-item>
            <div id="sign-in-button"/>
            <Loading_btn ripple :disabled="loading" :loading="loading" type="submit" class="submit-button" expand="block" shape="round" color="tertiary" >
              {{ confirmed ? $t('Verify Code') :$t('Verify Phone') }}
            </Loading_btn>
            <Errors_alerts v-if="!loggedIn" :errors="v$.$errors"/>
          </form>
        </ion-card-content>
        <div class="mx-3.5 h-0.5 shadow-sm divider" />
        <ion-card-content>
          <ion-row>
            <ion-col size="6">
              <Google_sign_in/>
            </ion-col>
            <ion-col size="6">
              <Facebook_sign_in/>
            </ion-col>
            <ion-col size="12">
              <change-user-type/>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonInput,createAnimation,IonIcon,IonPage,IonContent,IonRow,IonCol,IonItem,IonCardContent,IonCard} from "@ionic/vue";
import {callOutline,barcodeOutline,} from "ionicons/icons"
import phoneAuth from "../mixins/phoneAuth";
import Loading_btn from "../../../components/loading_button";
import {required,maxLength,minLength,numeric} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Errors_alerts from "@/components/errors_alerts";
import ChangeUserType from "@/views/auth/components/ChangeUserType";
import Google_sign_in from "@/views/auth/components/google_sign_in";
import Facebook_sign_in from "@/views/auth/components/facebook_sign_in";
import {mapGetters} from "vuex";
import waitForLoading from "@/methods/waitForLoading";
export default {
  name: "phone_login",
  mixins:[phoneAuth],
  validations () {
    return {
      code: { required,maxLength:maxLength(6),numeric,minLength:minLength(6) },
      phone: { required,maxLength:maxLength(11),numeric,minLength:minLength(11) },
    }
  },
  methods:{
    async checkPhone(){
      if (this.confirmed){
        if (!(await this.v$.code.$validate())){
          return;
        }
        await this.verifyCode();
      }
      else{
        if (!(await this.v$.phone.$validate())){
          return;
        }
        await this.phoneVerify()
      }
      this.v$.$reset();
    }
  },
  computed:{
    ...mapGetters({loggedIn:"user/isLoggedIn"})
  },
  components:{
    Facebook_sign_in,
    Google_sign_in,
    ChangeUserType,
    Errors_alerts,
    Loading_btn,IonPage,IonContent,
    IonIcon,
    IonRow,IonCol, IonItem,IonCard,IonInput,IonCardContent},
  setup(){
    return{
      callOutline,
      barcodeOutline,
      login:true,
      v$:useVuelidate()
    }
  },
  watch:{
    loggedIn:{
      immediate:true,
      async handler(v){
        await waitForLoading(() =>this.$refs.card,100 )
        let ani = createAnimation()
            .addElement(this.$refs.card.$el)
            .duration(500)
            .fromTo('opacity', '0', '1')
            .fromTo("bottom",'-10%','10%');
        if (v){
          ani = ani.direction("reverse");
        }
        else{
          ani = ani.direction("normal");
        }
        await ani.play();
      }
    }
  }
}
</script>

<style lang="scss">
@import "../st";
</style>
<style scoped lang="scss">
ion-content{
  --background: transparent;
}

</style>
<style lang="scss" scoped>
.card{
  width: 100%;
  position: absolute;
  bottom: -11%;
  right: 0;
  left: 0;
  margin: 0;
  transition: 1s;
  opacity: 0;

}
</style>
