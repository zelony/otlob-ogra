<template>
  <ion-item fill="outline">
    <ion-icon slot="start" :icon="colorPaletteOutline"/>
    <ion-label position="floating">{{label || $t('color picker')}}</ion-label>
    <ion-input readonly @ionFocus="showPicker" :modelValue="modelValue ? $t('color selected =>') : undefined"/>
    <ion-button slot="end" :style="{'--background':modelValue}" @click="showPicker">
      <color-picker slot="icon-only" ref="color"
                    @update:pureColor="$emit('update:modelValue',$event)"
                    :pureColor="modelValue"
      />
    </ion-button>
  </ion-item>
</template>

<script>
import {ColorPicker} from "vue3-colorpicker";
import {colorPaletteOutline} from 'ionicons/icons';
import {IonItem,IonLabel,IonIcon,IonButton,IonInput} from "@ionic/vue"
import "vue3-colorpicker/style.css";
export default {
  name: "color_picker",
  setup(){
    return{
      colorPaletteOutline
    }
  },
  components:{
    ColorPicker,IonItem,IonLabel,IonIcon,IonButton,IonInput
  },
  methods:{
    showPicker(){
      this.$refs.color.showPicker = true;
    },
  },
  props:{
    modelValue:String,
    label:String
  }
}
</script>

<style >
.vc-color-wrap{
  margin: 0!important;
  box-shadow: none!important;
}
</style>
