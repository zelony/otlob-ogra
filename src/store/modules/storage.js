import { Storage } from '@ionic/storage';
import waitForLoading from "../../methods/waitForLoading";

export default {
    namespaced:true,
    state:{
        storage:null
    },
    mutations:{
        setStorage(state,storage){
            state.storage = storage;
        },
    },
    actions:{
        async getStorage({state}){
            await waitForLoading(() => state.storage);
            return state.storage;
        },
        async get({dispatch},key){
            const storage = await dispatch('getStorage');
            const data = await storage.get(key);
            if (data){
                return data
            }
            return null;
        },
        async set({dispatch},[key,val]){
            const storage = await dispatch('getStorage');
            return await storage.set(key,val)
        },
        async remove({state},key){
            return await state.storage.remove(key)
        },
        async removeAll({state}){
            return await state.storage.clear()
        },
        async create({commit}){
            try {
                const store = new Storage();
                commit("setStorage",await store.create());
            }
            catch (e){
                commit("toast/error",e,{root:true})
            }

        }
    }
}