<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{$t('Email Information')}}</ion-label>
    </ion-item-divider>
      <ion-item>
        <ion-icon slot="start" :icon="mail"></ion-icon>
        <ion-input v-model="email" :placeholder="$t('Change Email')"></ion-input>
        <ion-button slot="end" color="success" v-if="emailValid && email !== user.email" @click="updateEmail">
          <ion-icon :icon="checkmark"></ion-icon>
        </ion-button>
      </ion-item>
      <ion-item>
        <ion-icon slot="start" :icon="lockClosed"></ion-icon>
        <ion-input
            :type="passwordShown?'text':'password'"
            v-model="password" :placeholder="$t('Change Password')"/>
        <div slot="end">
          <ion-button color="tertiary" @click="passwordShown = !passwordShown">
            <ion-icon :icon="passwordShown?eyeOff:eye"></ion-icon>
          </ion-button>
          <ion-button color="success" v-if="passwordValid" @click="updatePassword">
            <ion-icon :icon="checkmark"></ion-icon>
          </ion-button>

        </div>
      </ion-item>

  </ion-item-group>

</template>
<script>
import {IonItemGroup,IonItemDivider,IonLabel,IonIcon, IonInput, IonItem,IonButton} from '@ionic/vue';
import {mail,lockClosed,eye,eyeOff,checkmark} from "ionicons/icons";
import {emailPasswordAuth} from "zelony-vue3-ionic-firebase-auth"
export default {
  name: "emailAuth",
  mixins:[emailPasswordAuth],
  setup(){
    return{
      mail,lockClosed,eye,eyeOff,checkmark
    }
  },
  components:{
    IonIcon, IonInput, IonItem,IonButton,IonItemGroup,IonItemDivider,IonLabel
  }
}
</script>

<style scoped>

</style>
