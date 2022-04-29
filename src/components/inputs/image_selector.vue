<template>
  <ion-item fill="outline">
    <ion-icon slot="start" :icon="imageOutline"/>
    <ion-label position="floating">{{label}}</ion-label>
    <ion-input @IonFocus="chooseImage" :placeholder="$t('Select Image')" :modelValue="modelValue ? $t('Image selected'):undefined"
               readonly
    />
  </ion-item>
</template>

<script>
import {IonItem,IonIcon,IonLabel,IonInput} from "@ionic/vue";
import {imageOutline} from "ionicons/icons"
import { ImagePicker } from '@awesome-cordova-plugins/image-picker';
export default {
  name: "image_selector",
  setup(){
    return{
      imageOutline
    }
  },
  methods:{
    async chooseImage(){
      ImagePicker.getPictures({title:this.label,allow_video:false,
        maximumImagesCount:this.multiple ? 4 : 1,
        outputType:1})
      .then((images) => {
        this.$emit("update:modelValue",this.multiple ? images:images[0])
      })
    }
  },
  props:{
    label:String,
    modelValue:[String,Array],
    multiple:{
      type:Boolean,
      default:false
    }
  },
  components:{IonItem,IonIcon,IonLabel,IonInput}
}
</script>

<style scoped>

</style>
