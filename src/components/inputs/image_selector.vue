<template>
  <ion-item fill="outline">
    <ion-icon slot="start" :icon="imageOutline"/>
    <ion-label position="floating">{{label}}</ion-label>
    <file-selector v-if="isWeb"
                   slot="end"
                   @update:modelValue="handleFiles"
                   :modelValue="modelValueForFiles"
    >
      <dialog-button>
        <ion-button>
          <ion-icon slot="icon-only" :icon="cloudUploadOutline"/>
        </ion-button>
      </dialog-button>
    </file-selector>
    <ion-input v-else
               @IonFocus="chooseImage"
               :placeholder="$t('Select Image')"
               :modelValue="modelValue ? modelValue.name:undefined"
               readonly
    />
  </ion-item>
</template>

<script>
import {IonItem,IonButton,IonIcon,IonLabel,IonInput} from "@ionic/vue";
import {imageOutline,cloudUploadOutline} from "ionicons/icons"
import { ImagePicker } from '@awesome-cordova-plugins/image-picker';
import {FileSelector,DialogButton} from "vue3-file-selector"
import {mapGetters} from "vuex";
import uploadData from "@/mixins/uploadData";
export default {
  name: "image_selector",
  mixins:[uploadData],
  setup(){
    return{
      imageOutline,
      cloudUploadOutline
    }
  },
  computed:{
    ...mapGetters({isWeb:"isWeb"}),
    modelValueForFiles(){
      if (this.multiple){
        return this.modelValue ? this.modelValue : undefined;
      }
      return [this.modelValue].filter(r => !!r)
    }
  },
  methods:{
    async handleFiles(files){
      const models = [];
      for (const key of files){
        models.push(key);
      }
      this.$emit("update:modelValue",this.multiple?models:models[0]);
    },
    async chooseImage(){
      if (!this.$store.getters.isWeb){
        ImagePicker.getPictures({title:this.label,allow_video:false,
          maximumImagesCount:this.multiple ? 4 : 1,
          outputType:1})
            .then((images) => {
              this.$emit("update:modelValue",this.multiple ? images.map(r => this.dataURLtoFile(r)):this.dataURLtoFile(images[0]))
            })
      }

    }
  },
  props:{
    label:String,
    modelValue:[File,Array],
    multiple:{
      type:Boolean,
      default:false
    }
  },
  components:{IonButton,IonItem,DialogButton,IonIcon,IonLabel,IonInput,FileSelector}
}
</script>

<style scoped>

</style>
