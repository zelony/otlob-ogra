
import {getToken, onMessage, isSupported, getMessaging,} from "firebase/messaging";
const vp = 'BGNpUQvNYmuxw2hcXxY5NAdtgML9ZadELX8a303h3FCG8XX38E1s3_sqBCpdTl6TSc8zmSGuTDvVZSP4_XBCZrY'
import {
  PushNotifications,
} from '@capacitor/push-notifications';
import {setDocument} from "@/services/firebase/firestore";
const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
}
const regPromise = new Promise(resolve => {
  PushNotifications.addListener('registration',  token => {
    resolve(token.value);
  }).then(console.log)
})
// const getDeliveredNotifications = async () => {
//   const notificationList = await PushNotifications.getDeliveredNotifications();
//   console.log('delivered notifications', notificationList);
// }
export default {
  methods:{
    async initMessaging(){
      await this.checkForPermissions();
      await this.saveMessagingDeviceToken();
      this.listenToEvents();
    },
    async addListeners(){
      await PushNotifications.addListener('registrationError', err => {
        this.$store.commit("toast/error",err);
      });
      await PushNotifications.addListener('pushNotificationReceived', notification => {
        this.$store.commit("toast/info",notification);
      });
      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });
    },
    async checkForPermissions(){
      if(this.$store.getters.isWeb) {
        if (!(await isSupported())){
          throw new Error("notifications is not supported")
        }
      }
      else{
        await registerNotifications();
      }
    },
    async saveMessagingDeviceToken() {
      try{
        let token;
          if(this.$store.getters.isWeb) {
            token = await getToken(getMessaging(), {
              vapidKey: vp
            });
          }
          else{
            token = await regPromise
          }
        if (token) {
          await setDocument('fcmTokens',this.$store.state.auth.user.uid,{token})
        }
      }
      catch(e){
        this.$store.commit("toast/error",e);
      }
    },
    async listenToEvents(){
      try{
          if (this.$store.getters.isWeb){
            onMessage(getMessaging(), (payload) => {
              this.$store.commit("toast/info",payload);
            });
          }
          else{
            await this.addListeners();
          }

      }
      catch (e) {
        this.$store.commit("toast/error",e);
      }
    }
  },
}
