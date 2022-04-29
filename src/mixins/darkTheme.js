//first check if has an option changed
//if has an option - put it
// if not use system prefereces
const themeKey = "th";
export default {
    data:()=>({
       isDark:false
    }),
    methods:{
        changeTheme(val){
            document.body.classList.toggle('dark', val);
            this.isDark = val;
            this.$store.dispatch("storage/set",[themeKey,val])
        },
        async checkTheme(){
            const theme = await this.$store.dispatch("storage/get",themeKey);
            if (theme){
                this.changeTheme(theme);
            }
            else{
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
                this.changeTheme(prefersDark.matches);
            }
            this.listenToSystemPreferenceChange();
        },
        listenToSystemPreferenceChange(){
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            prefersDark.addEventListener("change",(e)=>{
                this.changeTheme(e.matches);
            })
        }
    }
}

// Listen for changes to the prefers-color-scheme media query

// Called when the app loads