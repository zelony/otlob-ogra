import {connectAuthEmulator, getAuth} from "firebase/auth";
// import {FirebaseAuthentication,} from "@capacitor-firebase/authentication";

export const initFireAuth = () => {
    const auth = getAuth();
    if (auth.config.emulator && auth.config.emulator.url)return ;
    if (process.env.NODE_ENV === "development"){
        connectAuthEmulator(auth,"http://localhost:9099/",{disableWarnings:true});
    }
    return auth;
}
