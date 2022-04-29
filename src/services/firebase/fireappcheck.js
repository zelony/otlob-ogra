import { initializeAppCheck,ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getApp } from 'firebase/app';
import { AppCheck } from 'capacitor-firebase-appcheck';
import {Capacitor} from "@capacitor/core";
if (process.env.NODE_ENV === "development"){
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = "413461A4-6B28-4FC5-A6B7-FEBE5232C654";
}
export const initAppCheck = async () => {
    if (Capacitor.isNativePlatform()){
        const appCheckCustomProvider = {
            getToken: async () => {
                // get the token from native
                const { token, exp } = await AppCheck.getAppCheckToken();

                return {
                    token,
                    expireTimeMillis:exp
                }
            },
            initialize:async () => {
                await AppCheck.initialize({
                    debug:process.env.NODE_ENV === "development"
                });
            }
        }
        return initializeAppCheck(getApp(),{provider:appCheckCustomProvider,isTokenAutoRefreshEnabled:true})
    }
    return initializeAppCheck(getApp(),{provider:new ReCaptchaEnterpriseProvider("6LehZXwfAAAAAFUsKjsHBVekaKcckhqsjVJZHLni"),isTokenAutoRefreshEnabled:true})
}

