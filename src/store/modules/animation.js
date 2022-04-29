export default {
    namespaced:true,
    state:{
        finished:false,
        loading:false
    },
    mutations:{
      set(state,[key,val]){
          state[key] = val;
      }
    },
    actions:{

    }
}
