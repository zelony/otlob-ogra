import main_mutations from "../main_settings/main_mutations";
import { Network } from '@capacitor/network';

export default {
    namespaced:true,
    state:{
        connected:false
    },
    mutations:main_mutations,
    actions:{
       async start({commit}){
           const connectionStatus = await Network.getStatus();
           commit("set",["connected",connectionStatus.connected]);
           Network.addListener('networkStatusChange', status => {
               commit("set",["connected",status.connected]);
               console.log('Network status changed', status);
           });
        }
    }
}
