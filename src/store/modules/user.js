import {signOut,getAuth} from "firebase/auth"
const formatPhone = (phoneNumber,countryCode = "+2") => {
    if (!phoneNumber)return null;
    phoneNumber = phoneNumber.replace(countryCode,"");
    if (!phoneNumber)return null;
    return phoneNumber;
}
const typeKey = "t";
export default {
    namespaced:true,
    state:{
        user:{},
        loaded:false,
        type:"user"
    },
    mutations:{
        set(state,[key,value]){
            state[key] = value;
        }
    },
    getters:{
        isLoggedIn(state){
            return state.user && Object.keys(state.user).length>0
        }
    },
    actions:{
        async changeUserType({dispatch,state}){
            await dispatch("storage/set",[typeKey,state.type],{root:true})
        },
        async initUserType({dispatch,commit}){
            const value = await dispatch("storage/get",typeKey,{root:true});
            await commit("set",["type",value || "user"]);
        },
        async login({dispatch,commit,state},{user}){
            try {
                let login = await dispatch("api/callApi", {
                    name: "login",
                    standalone:true,
                    options:{
                      type: state.type
                    }
                },{root:true});
                if (!login) {
                    commit("toast/error", {
                        code: "not-authorized",
                        message: "failed to log in"
                    },{root:true});
                    await signOut(getAuth())
                    return false;
                }
                commit("set", ["user",{
                    uid: user.uid,
                    number:formatPhone(user.phoneNumber),
                    providers:user.providerData,
                    name:login.name || user.displayName,
                    id:login.id,
                    profile:login.profile || user.photoURL,
                    email: user.email,
                }]);
                if (state.type === "driver"){
                    commit("driver/set",["data",{
                        nf:login.nf,
                        nb:login.nb,
                        ls:login.ls,
                        le:login.le,
                        v:login.v,
                        r:login.r,
                    }],{root:true});

                }
                return true;
            } catch (e) {
                commit("toast/error", {
                    code: "failed-login",
                    message: "failed to log in"
                },{root:true});
                await signOut(getAuth())
                return false;
            }
        },
        async logout({dispatch}){
            await signOut(getAuth());
            dispatch("storage/removeAll",null,{root:true});
            dispatch("trip/closeListener",null,{root:true})
        },
    }
}
