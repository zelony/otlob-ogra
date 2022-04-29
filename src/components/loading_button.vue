<template>
  <ion-button v-bind="$attrs" :disabled="loading || $attrs.disabled" @click="emitClick">
    <ion-spinner name="crescent" v-if="loading"/>
    <template v-else>
      <div  v-if="$slots['icon-only']" slot="icon-only">
        <slot name="icon-only" />
      </div>
      <slot />
    </template>

  </ion-button>
</template>

<script>
import {IonButton,IonSpinner} from "@ionic/vue";
export default {
  name: "loading_btn",
  components:{IonButton,IonSpinner},
  props:{
    loading:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    emitClick(){
      if (this.loading)return;
      this.$emit('click')
    }
  },
  emits:["click"]
}
</script>

<style scoped>

</style>
