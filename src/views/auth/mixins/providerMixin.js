import {
    FacebookAuthProvider,
    fetchSignInMethodsForEmail, getAuth,
    GoogleAuthProvider, signInWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth"

import {alertController} from "@ionic/vue";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {FacebookLogin} from "@capacitor-community/facebook-login";
export default {
    methods:{
        async showPasswordPrompt(){
            return new Promise((resolve) => {
                alertController.create({
                        cssClass: 'my-custom-class',
                        header: this.$t('enter password'),
                        inputs: [
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: '***',
                                cssClass: 'custom-item',
                                attributes: {
                                    minLength: 8,
                                }
                            }
                        ],
                        buttons: [
                            {
                                text: this.$t('Cancel'),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    resolve(null);
                                    // console.log('Confirm Cancel')
                                },
                            },
                            {
                                text: 'Ok',
                                handler: (data) => {
                                    resolve(data.password);
                                },
                            },
                        ],
                    })
                    .then(alert => {
                        alert.present().then(()=>{
                            console.log("alert appeared")
                        });
                    });
            });
        },
        async linkEmailAndPassword(email,pendingCred){
            try {
                const password = await this.showPasswordPrompt();
                const result = await signInWithEmailAndPassword(getAuth(),email, password);
                result.user.linkWithCredential(pendingCred)
            }
            catch (e) {
                if (e.code === "auth/wrong-password"){
                    return await this.linkEmailAndPassword()
                }
                throw e;
            }
        },
        async getGoogleAction(){
            // return await FirebaseAuthentication.signInWithGoogle();
            if (this.$store.getters.isWeb){
                return await signInWithPopup(getAuth(),new GoogleAuthProvider());
            }
            else{
                console.log("will initialize")
                GoogleAuth.initialize({
                    client_id:process.env.VUE_APP_GOOGLE_CLIENT_ID,
                    scopes: ['profile', 'email'],
                    clientId:process.env.VUE_APP_GOOGLE_CLIENT_ID,
                    androidClientId:process.env.VUE_APP_ANDROID_ID,
                    serverClientId:process.env.VUE_APP_GOOGLE_CLIENT_ID,
                    forceCodeForRefreshToken:true,
                    grantOfflineAccess: true,
                });
                console.log("initialized")
                const googleUser = await GoogleAuth.signIn();
                console.log("signed In",JSON.stringify(googleUser))
                const GoogleCredential = GoogleAuthProvider.credential(googleUser.authentication.idToken, googleUser.authentication.accessToken);
                return await signInWithCredential(getAuth(),GoogleCredential)
            }
        },
        async getFacebookAction(){
            // return await FirebaseAuthentication.signInWithFacebook();
            if(this.$store.getters.isWeb){
                return await signInWithPopup(getAuth(),new FacebookAuthProvider());
            }
            else{
                const FACEBOOK_PERMISSIONS = ["email","public_profile"];
                FacebookLogin.initialize({appId:process.env.VUE_APP_FACEBOOK_ID,locale:this.$i18n.locale}).then(console.log).catch(console.log);
                const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
                if (result.accessToken && result.accessToken.token) {
                    const FacebookCredential = FacebookAuthProvider.credential(result.accessToken.token);
                    return await signInWithCredential(getAuth(),FacebookCredential)
                }
            }
        },
        async handleProviderError(error){
            console.log(error);
            if (["auth/popup-closed-by-user"].includes(error.code)){
                return;
            }
            if (error.code === 'auth/account-exists-with-different-credential') {
                const pendingCred = error.credential;
                const email = error.email;
                // Get sign-in methods for this email.
                const methods =await fetchSignInMethodsForEmail(getAuth(),email);
                console.log(methods);
                // Step 3.
                // If the user has several sign-in methods,
                // the first method in the list will be the "recommended" method to use.
                if (methods[0] === 'password') {
                    // Asks the user their password.
                    // In real scenario, you should handle this asynchronously.
                    await this.linkEmailAndPassword(email,pendingCred);
                    return;
                }
                // All the other cases are external providers.
                // Construct provider object for that provider.
                // TODO: implement getProviderForProviderId.
                const func = methods[0] === "google.com" ? this.getGoogleAction :this.getFacebookAction;
                // At this point, you should let the user know that they already have an account
                // but with a different provider, and let them validate the fact they want to
                // sign in with this provider.
                // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                // so in real scenario you should ask the user to click on a "continue" button
                // that will trigger the signInWithPopup.
                const result = await func();
                await result.user.linkAndRetrieveDataWithCredential(pendingCred);
                // .then(function(result) {
                //     // Remember that the user may have signed in with an account that has a different email
                //     // address than the first one. This can happen as Firebase doesn't control the provider's
                //     // sign in flow and the user is free to login using whichever account they own.
                //     // Step 4b.
                //     // Link to Google credential.
                //     // As we have access to the pending credential, we can directly call the link method.
                //    ;
                // });
            }
            else{
                this.$store.commit("toast/error", error);
            }
        }
    }
}
