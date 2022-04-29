import {httpsCallable,getFunctions} from "firebase/functions";
// import {incrementMetric, startTrace, stopTrace} from "../../services/performance";
const isJson = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
export default {
    namespaced: true,
    mutations:{
      set(state,[val,key]){
          state[key] = val;
      }
    },
    state:{
      lang:process.env.VUE_APP_I18N_LOCALE
    },
    actions: {
        async callApi({ dispatch,commit,rootState,state }, { name, options = undefined, cache=true,standalone = false},) {
            if (!cache && !rootState.network.connected){
                commit("toast/internetNeeded",null,{root:true})
                return;
            }
            try {
                console.log(rootState.network.connected || !cache)
                if (rootState.network.connected || !cache){
                    // await startTrace("fetchData",);
                    const nameAnal =rootState.user.type === "user" ? `user-requests` : `driver-requests`;
                    const funcName = standalone ? name : nameAnal;
                    options = options ? {...options,l:state.lang} : {l:state.lang};
                    options = standalone ? options : Object.assign(options || {}, {_:name});
                    // await incrementMetric("fetchData",nameAnal,1)
                    const request = httpsCallable(getFunctions(),funcName);
                    const response = await request(options);
                    const {data} = response;
                    if (data) {
                        if (data.error) {
                            throw data;
                        }
                        let returnVal;
                        if (isJson(data)) {
                            returnVal =  JSON.parse(data);
                        } else {
                            returnVal = data;
                        }
                        if (cache){
                            dispatch("storage/set",[`${name}/${JSON.stringify(options)}`,returnVal],{root:true})
                        }
                        // await stopTrace("fetchData",);
                        return returnVal
                    }
                    throw new Error(data);
                }
                else{
                    return await dispatch("storage/get", `${name}/${JSON.stringify(options)}`, {root: true});
                }
            } catch (e) {
                commit("toast/error", e, { root: true });
                return null;
            }
        }
    }
};
