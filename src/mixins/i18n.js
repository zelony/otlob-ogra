import { Globalization } from '@awesome-cordova-plugins/globalization';
const i18nKey = "lang"
export default {
    methods:{
        async initGlobalization(){
            const storageLang = await this.$store.dispatch("storage/get",i18nKey);
            if (storageLang){
                this.changeLocalization(storageLang);
                return;
            }
            if (!this.$store.getters.isWeb){
                const localLang = (await Globalization.getPreferredLanguage()).value;
                if (localLang){
                    this.changeLocalization(localLang);
                }
            }
        },
        changeLocalization(lang){
            this.$i18n.locale = lang;
            this.$store.commit("api/set",["lang",lang]);
        }
    }
}
