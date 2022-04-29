<template>
  <Loading_btn ripple @click="changeType" expand="block" shape="round"
               :color="color" >
    <ion-icon :icon="icon"/>
    {{ text }}
  </Loading_btn>
</template>

<script>
import Loading_btn from "@/components/loading_button";
import {mapState} from "vuex"
import {IonIcon} from "@ionic/vue"
import {carOutline,personOutline} from "ionicons/icons"
export default {
  name: "ChangeUserType",
  computed:{
    color(){
      return this.type === "user" ? "tertiary" : "secondary";
    },
    text(){
      return this.type === "user" ? this.$t('Log in driver') : this.$t('Log in user');
    },
    icon(){
      return this.type === "user" ? carOutline : personOutline;
    },
    ...mapState({type:state => state.user.type})
  },
  components: {Loading_btn,IonIcon},
  methods:{
    changeType(){
      if (this.type === "user"){
        this.$store.commit("user/set",["type","driver"]);
      }
      else{
        this.$store.commit("user/set",["type","user"]);
      }
      this.$store.dispatch("user/changeUserType");
    }
  }
}
</script>

<style scoped>

</style>
