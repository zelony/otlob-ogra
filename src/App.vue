<template>
  <ion-app>
    <ion-router-outlet/>
    <Loading_screen/>
    <Background_ani/>
  </ion-app>
</template>

<script >
import { defineComponent } from 'vue';
import {IonApp, IonRouterOutlet, useIonRouter} from "@ionic/vue";
import {initFireAuth} from "@/services/firebase/fireauth";
import {onAuthStateChanged,getAuth,browserLocalPersistence,setPersistence} from "firebase/auth";
import {initAppCheck} from "@/services/firebase/fireappcheck";
import {initFunctions} from "@/services/firebase/fireFunctions";
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen';
import messaging from "@/mixins/messaging";
import darkTheme from "@/mixins/darkTheme";
import i18n from "@/mixins/i18n";
import Loading_screen from "@/components/loading";
import waitForLoading from "@/methods/waitForLoading";
import Background_ani from "@/components/background_animation/background_ani";

export default defineComponent({
  name: 'App',
  components:{Background_ani, Loading_screen, IonApp,IonRouterOutlet},
  mixins:[messaging,darkTheme,i18n],
  setup(){
    initFireAuth();
    initAppCheck();
    initFunctions();
    return{
      router:useIonRouter(),
      start(){
        // loadFonts()
        // defineCustomElements(window)
      }
    }
  },
  mounted() {
    this.$store.dispatch("storage/create")
    this.checkTheme();
    SplashScreen.hide();
    this.$nextTick(()=>{
      this.$store.dispatch("network/start");
      this.$store.dispatch("map/initLocationWatcher");
      this.initGlobalization();
      this.loginListener();
      this.start();
    });
  },
  methods:{
    hidePage(){
      const splits = document.getElementsByTagName('ion-split-pane');
      if (splits.length > 0){
        const el = splits[0];
        el.classList.add('ion-page-hidden')
      }
      const tab = document.getElementById('tabs-page-handler');
      if (tab){
        tab.classList.add('ion-page-hidden')
      }
    },
    showPage(){
      const splits = document.getElementsByTagName('ion-split-pane');
      if (splits.length > 0){
        const el = splits[0];
        el.classList.remove('ion-page-hidden')
      }
      const tab = document.getElementById('tabs-page-handler');
      if (tab){
        tab.classList.remove('ion-page-hidden')
      }
      // const els = document.querySelectorAll('ion-app > ion-router-outlet > ion-page');
      // els.forEach(el => el.classList.add("ion-page-hidden"));
    },
    async handleLogin(user){
      try {
        // this.$store.commit("loading/set",["show",true]);
        // this.$store.commit("loading/set",["text","Checking Data"]);
        if (user) {

          await this.$store.dispatch("user/initUserType");
          const r = await this.$store.dispatch("user/login",{user});
          if (!r)return;
          this.$store.commit("user/set", ["loaded", true]);
          // await this.$store.dispatch("initCheck",this.$store.state.user);
          this.$store.dispatch("map/init");
          this.$store.dispatch("trip/init")
          await setPersistence(getAuth(), browserLocalPersistence);
          await waitForLoading(()=>this.$store.state.animation.finished,200);
          this.$store.commit("loading/set",["enabled",true]);
          this.$store.commit("user/set", ["loaded", true]);
          // this.showPage();
          if (this.$route.matched.some(r => r.meta.onlyWhenLogout)) {
            await this.router.replace(`/${this.$store.state.user.type}`)
          }
          this.$store.commit("animation/set",["finished",false])
          // this.initMessaging();
          // setCrachyliticsUserId(user.uid);
          // enablePrivacyScreen();
          // analyticsSetUserId(user.uid);
          // analyticsSetCollectionEnabled(true);
          // this.$store.dispatch("user/updateFireAuth")
          // stopTrace("login")

        } else {
          this.$store.commit("user/set", ["loaded", true]);
          this.$store.commit("loading/set", ["enabled", false]);
          // await analyticsSetCollectionEnabled(false);
          await this.$store.commit('user/set',["user",{}]);
          await this.$store.dispatch("storage/removeAll");
          // this.hidePage();
          if (!this.$route.matched.some(r => r.meta.onlyWhenLogout)) {
            this.router.replace('/login')
          }
        }
        // this.$store.commit("loading/set",["show",false]);
        // sendUnsentReports();
      } catch (e) {
        this.$store.commit("toast/error", e);
      }
    },
    async loginListener(){
      onAuthStateChanged(
          getAuth(),
          async user => {
           this.handleLogin(user);
          },
          e => this.$store.commit("toast/error", e)
      );
    },
  }
});
</script>

<style>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
