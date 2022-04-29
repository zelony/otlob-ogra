import { createStore } from 'vuex'
import {Capacitor} from "@capacitor/core";
import map from "@/store/modules/map";
import loading from "@/store/modules/loading";
import user from "@/store/modules/user";
import api from "@/store/modules/api";
import toast from "@/store/modules/toast";
import network from "@/store/modules/network";
import storage from "@/store/modules/storage";
import home from "@/store/modules/home";
import driver from "@/store/modules/driver";
import trip from "@/store/modules/trip";
import animation from "@/store/modules/animation";
const store = createStore({
  state: {
  },
  getters:{
    isWeb(){
      return !Capacitor.isNativePlatform();
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    map,
    loading,
    user,
    api,
    toast,
    network,
    storage,
    home,
    driver,
    trip,
    animation
  }
})

export default store
