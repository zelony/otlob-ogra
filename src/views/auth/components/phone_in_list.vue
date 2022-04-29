<template>
  <ion-item v-bind="$attrs">
    <ion-icon color="dark" slot="start" :icon="call"></ion-icon>
    <template v-if="confirmed">
      <ion-input :placeholder="$t('No Code')" v-model="code"/>
      <ion-button slot="end" :disabled="!code" @click="verifyCode"  color="success">
        <ion-icon :icon="checkmark"></ion-icon>
      </ion-button>
    </template>
    <template v-else>
      <ion-input maxLength="11" :placeholder="phone  || $t('No Phone Number')" v-model="phone"/>
      <ion-button v-if="phoneVerified"  @click="unlink" color="danger">
        <ion-icon :icon="trashBin"></ion-icon>
      </ion-button>
      <ion-button v-else :disabled="!phoneValid"  @click="phoneVerify" color="success" >
        <ion-icon :icon="checkmark"></ion-icon>
      </ion-button>
    </template>
  </ion-item>
  <div id="sign-in-button"></div>
</template>

<script>
import {call,checkmark,trashBin} from 'ionicons/icons';
import {IonIcon,IonInput, IonItem,IonButton} from '@ionic/vue';
import phoneAuth from "../mixins/phoneAuth";
export default {
  mixins:[phoneAuth],
  name: "phone_in_list",
  components:{
    IonItem,
    IonInput,
    IonIcon,
    IonButton
  },
  setup(){
    return{
      call,checkmark,trashBin,
      login:false
    }
  },
  emits:["update:modelValue"],
  props:{
    modelValue:[String,Number]
  }
}
</script>

<style lang="scss">
@import "../st";
</style>