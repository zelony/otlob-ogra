import waitForLoading from "@/methods/waitForLoading";
import objectEqual from "@/methods/objectEqual";
export default {
    data:()=>({
        latest:null,
        finished:false,
        loading:false,
        turns:1
    }),
    methods:{
        requestNew(){
            this.fetchInfiniteApi(null,true,this.options)
        },
        async fetchInfiniteApi(e,n,options=null){
            console.log("will fetch")
            let api = this.apiName,
                index = 0;
            if (n) {
                this.latest = null;
                this[this.infiniteScroll.key] = [];
                this.finished = false;
                this.turns = 1
            }
            options = options || this.options;
            index = this.latest ? this.latest.id : 0;
            this.loading = true;
            let data= await this.$store.dispatch("api/callApi", {
                name: api,
                options: {
                    index,
                    page:this.turns,
                    limit: this.infiniteScroll.limit,
                    ...options
                }
            });
            this.loading = false;
            if (e) {
                e.target.complete();
            }
            this.started = false;
            if (!data || data.length === 0) {
                this.finished = true;
                return;
            }
            this.turns = this.turns +1;
            this[this.infiniteScroll.key].push(...data);
            this.latest = data[data.length - 1];
        }
    },
    watch:{
        options:{
            immediate:true,
            async handler(v,x){
                if (this.loading){
                    await waitForLoading(()=>!this.loading,200)
                }
                if (!objectEqual(v,x) || (typeof v === "undefined")) {
                    this.fetchInfiniteApi(null,true,v || null);
                }
                // if (!this[this.infiniteScroll.key] || this[this.infiniteScroll.key].length === 0){
                //     this.fetchInfiniteApi(null,true,v || null)
                //     return;
                // }
            }
        }
    }
}
