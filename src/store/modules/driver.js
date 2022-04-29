export default {
    namespaced:true,
    state:{
        car:null,
        driver:null,
        data:{}
    },
    mutations:{
        set(state,[key,value]){
            state[key] = value;
        }
    },
    getters:{
        isValid(state){
            if (Object.keys(state.data).length>0)return false;
            return !!state.data.v
            // const role = parseInt(state.data.r);
            // if (role){
            //     if (role === 1){
            //         return state.data.nf && state.data.nb && state.data.ls && state.data.le
            //     }
            //     return state.data.nf && state.data.nb
            // }
            // return false
        }
    }
}
