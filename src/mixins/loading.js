import {loadingController} from "@ionic/vue";
export default {
    data:()=>({
        ___l:null,
        loading:false
    }),
    methods:{
        async presentLoading({message="Please Wait loading",duration=0} = {}) {
            this.loading = true;
            const loading = await loadingController
                .create({
                    cssClass: 'my-custom-class',
                    message,
                    duration,
                });

            await loading.present();
            this.___l = loading;
        },
        async dismissLoading(){
            this.loading = false;
            await this.___l.dismiss();
            this.___l = null;
        }
    }

}
