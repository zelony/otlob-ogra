import {collection, updateDoc, getFirestore, limit, onSnapshot, orderBy, query, where, doc} from "firebase/firestore";
import {modalController} from "@ionic/vue";
import addRating from "@/views/user/main/modals/addRating";
const tripKey = "trips";
const tripCol = collection(getFirestore(),tripKey);
export default {
    namespaced:true,
    state:{
        snapShotListener:null,
        tripData:null,
        new:{

        }
    },
    mutations:{
      set(state,[key,value]){
          state[key] = value;
      },
        setOfNew(state,[key,val]){
          state.new[key] = val;
        }
    },
    actions:{
        init({rootState,commit,dispatch}){
            let q = null;
            if (rootState.user.type === "user"){
                q = query(tripCol,orderBy("t","desc"),where("i","==",rootState.user.user.id),limit(1))
            }
            else{
                q = query(tripCol,orderBy("t","desc"),where('c',"==",rootState.driver.car),limit(1))
            }
            commit("set",["snapShotListener",onSnapshot(q,snapshot => {
                dispatch("handleSnapshot",snapshot);
            })])
        },
        closeListener({state,commit}){
            if (state.snapShotListener){
                state.snapShotListener();
            }
            commit("set",["snapShotListener",null]);
            commit("set",["tripData",null])
        },
        async handleSnapshot({commit,rootState},snapshot){
            const type = rootState.user.type;
            const isUser = type === "user";
            if (snapshot.empty){
                commit("home/setHomeType","no-trip",{root:true});
                return;
            }
            const snapDoc = snapshot.docs[0];
            commit("set",["tripData",{...doc.data(),id:snapDoc.id}]);
            const s = snapDoc.get('s');
            if (s === 'pending' && isUser){
                if (Date.now() - snapDoc.get('t').toMillis() > 300000){
                    await updateDoc(doc(getFirestore(), tripKey, snapDoc.id),{s:'failed'});
                    commit("home/setHomeType","no-trip",{root:true});
                }
                else{
                    commit("home/setHomeType","pending",{root:true})
                }
            }
            else if(s === "accepted"){
                commit("home/setHomeType","waiting-driver",{root:true});
            }
            else if(s === "in-car"){
                commit("home/setHomeType","driving",{root:true});
            }
            else if(s === "ended"){
                commit("home/setHomeType","no-trip",{root:true});
                if (isUser){
                    const rating = snapDoc.get('r');
                    if (!rating){
                        const modal = await modalController.create({
                            component:addRating,
                            animated:true,
                        });
                        await modal.present();
                    }
                }
            }
            else if (s === "finished"){
                commit("home/setHomeType","no-trip",{root:true});
            }
            console.log(snapshot);
        }
    }
}
