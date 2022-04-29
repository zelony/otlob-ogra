
export default {
    namespaced:true,
    state:{
        type:"",
        loaded:false
    },
    mutations:{
        set(state,[key,val]){
            state[key] = val;
        },
        setHomeType(state,val){
            state.type = val;
        }
    },
}
