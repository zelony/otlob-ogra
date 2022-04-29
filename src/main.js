import { SplashScreen } from '@awesome-cordova-plugins/splash-screen';
SplashScreen.show();
import "@/services/firebase/firebase";
import { createApp } from 'vue'
import router from './router';
import App from './App.vue'
import { IonicVue } from '@ionic/vue';
/* Theme variables */
import './theme/variables.css';
import './theme/index.css';
import './theme/style.scss';
import store from './store'
import i18n from './plugins/i18n'
const app = createApp(App).use(i18n).use(store)
  .use(IonicVue)
  .use(router)
app.mount('#app');
store.$router = router;
