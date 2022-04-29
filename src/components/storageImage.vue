<template>
  <ion-spinner name="crescent" v-if="loading"/>
  <template v-else>
    <template v-if="image">
      <img :class="{profile}" :src="thumbImage" alt="image" v-if="disabled"/>
      <viewer :images="[image]" v-else>
        <img :class="{profile}" :src="thumbImage" alt="image"/>
      </viewer>
    </template>
    <img v-else v-bind="$attrs" :class="{profile}" :src="require('@/assets/noimage.png')" alt="image"/>
  </template>
</template>

<script>
import {IonSpinner} from "@ionic/vue";
import {imageOutline} from "ionicons/icons"
import 'viewerjs/dist/viewer.css'
import {component as Viewer} from 'v-viewer'
import { storageRef} from "../services/firebase/storage";
import {getDownloadURL} from "firebase/storage";

export default {
  name: "firestorageImage",
  setup(){
    return {
      imageOutline
    }
  },
  data: () => ({
    src: null,
    thumbPath:null,
    loading:false
  }),
  emits:["click"],
  computed: {
    thumbImage(){
      if (this.thumbPath){
        return this.thumbPath;
      }
      return this.image;
    },
    image() {
      if (this.path) {
        if (this.upload) {
          return this.path;
        }
        if (this.src) {
          return this.src;
        }
        return null;
      }
      return null;
    }
  },
  props: {
    path: String,
    thumb: String,
    default:String,
    upload: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    profile:{
      type:Boolean,
      default:false
    }
  },
  watch: {
    path: {
      immediate: true,
      async handler(p) {
        if (p && !this.upload) {
          this.loading = true;
          this.src = await this.getUrl(p);
          this.loading = false;
        }
        else {
          this.src = null;
        }
      }
    },
    thumb: {
      immediate: true,
      async handler(p) {
        if (p) {
          this.thumbPath = await this.getUrl(p);
        }
        else {
          this.thumbPath = null;
        }
      }
    }

  },
  methods:{
    async getUrl(p){
      if (p.includes("http") || p.includes("data:image") || p.charAt(0) === "/") {
        return p;
      } else {
        try {
          return  await getDownloadURL(storageRef(p))
        }
        catch (e) {
          // this.$store.commit("toast/error", e);
         return null;
        }
      }
    }
  },
  components:{
    IonSpinner,
    Viewer
  }
};
</script>

<style scoped>

.profile{
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  cursor:pointer
}
</style>
