import {
    signInWithPhoneNumber,
    PhoneAuthProvider,
    unlink,
    RecaptchaVerifier,
    linkWithPhoneNumber,
    getAuth
} from "firebase/auth";
import { mapState} from "vuex";
export default {
    data:()=>({
        loading:false,
        phone:null,
        times:0,
        confirmationResult:null,
        code:null,
        confirmed:false,
        recaptchaWidgetId:null,
        recaptchaVerifier:null,
    }),
    computed:{
        ...mapState({user:state => state.user.user}),
        // ...mapGetters({web:"auth/isWeb"}),
        phoneVerified(){
            return this.checkIfProviderExist('phone')
        },
        phoneValid(){
            if (this.user){
                return !!this.phone  && this.phone !== this.user.number  && this.phone.length === 11
            }
            return !!this.phone  && this.phone.length === 11
        },
        phoneFormatted(){
            if (this.phone && this.phoneValid){
                let phone = this.phone;
                phone = phone.replace('+2','');
                phone = phone.charAt(0) == 0 ? phone.substring(1,phone.length) :phone;
                return `+20${phone}`
            }
            return null;
        },
    },
    ionViewDidEnter(){
        this.resetCap();
    },
    methods:{
        resetCap(){
            document.getElementById("sign-in-button").innerHTML = '';
            this.confirmationResult=null;
            this.confirmed=null;
            this.recaptchaWidgetId=null;
            this.recaptchaVerifier=null;
        },
        checkIfLastProvider(){
            if (this.user.providers.length === 1){
                throw new Error('it is the last way to login')
            }
        },
        checkIfProviderExist(provider){
            return this.user&& Object.keys(this.user).length>0 && this.user.providers.some(r => r.providerId ===provider)
        },
        async recaptchaRender() {
            if (this.recaptchaVerifier){
                this.recaptchaVerifier.render().then(r => {
                    this.recaptchaWidgetId = r;
                });
            }
        },
        async unlink(){
            try{
                this.checkIfLastProvider()
                await unlink(getAuth().currentUser,PhoneAuthProvider.PROVIDER_ID)
                // await .unlink(this.$firebase.firebase_.auth.PhoneAuthProvider.PROVIDER_ID)
                const providers = this.user.providers.filter(r => r.providerId !== 'phone');
                await this.$store.commit('auth/set',["user", {
                    ...this.user,
                    number:null,
                    providers
                }]);
                this.$store.dispatch("user/updateFireAuth",)
            }
            catch (e) {
                this.$store.commit("toast/error",e)
            }
        },
        async verifyCode(){
            try {
                this.loading = true;
                await this.confirmationResult.confirm(this.code);
                this.code = null;
                if (!this.login){
                    const providers = new Array(...this.user.providers);
                    providers.push({
                        providerId:"phone"
                    })
                    await this.$store.commit('auth/set',["user", {
                        ...this.user,
                        number:this.phone,
                        providers
                    }]);
                    this.$emit('update:modelValue',this.phone);
                    this.$store.dispatch("user/update",{phone:this.phone})
                }
                this.confirmed = false;
                this.recaptchaVerifier.clear();
            }
            catch (e) {
                this.$store.commit("toast/error",e)
                if (e.code === "auth/account-exists-with-different-credential"){
                    this.confirmed = false;
                    this.code = null;
                    this.phone = null;
                }
            }
            this.loading = false;
        },
        async phoneVerify(){
            if (!this.phoneFormatted)return;
            this.loading = true;
            try {
                this.recaptchaVerifier =new RecaptchaVerifier('sign-in-button', {
                    'size': 'invisible',
                    'callback':async (response)=>{
                        console.log(response);
                    },
                    'expired-callback': () => {
                        this.phoneVerify();
                    },
                    isolated:true
                },getAuth(),);
                await this.recaptchaRender();
                if (this.login){
                    this.confirmationResult = await signInWithPhoneNumber(getAuth(),this.phoneFormatted, this.recaptchaVerifier);
                }
                else{
                    this.confirmationResult = await linkWithPhoneNumber(getAuth().currentUser,this.phoneFormatted, this.recaptchaVerifier);
                }
                this.confirmed = true;
            }
            catch (e) {
                this.$store.commit("toast/error",e)
            }
            this.loading = false;
        }
    },
    watch:{
        user:{
            immediate:true,
            handler(val){
                if (val){
                    this.phone =val.number
                }
            }
        }
    }
}
