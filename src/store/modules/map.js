
import { Loader } from "@googlemaps/js-api-loader"
import waitForLoading from "@/methods/waitForLoading";
import {Geolocation} from "@capacitor/geolocation";
import {createMap} from "@/services/map";
export default {
    namespaced:true,
    state:{
        markers:[],
        map:null,
        initialized:false,
        currentLocation:{}
    },
    mutations:{
      set(state,[key,val]){
          state[key] = val;
      }
    },
    actions:{
        async init({commit}){
            const loader = new Loader({
                // apiKey: process.env.VUE_APP_MAP_API,
                version: "weekly",
                language:"ar",
                region:"EG",
                libraries:["places"]
            });
            await loader.load();
            commit("set",["initialized",true]);
        },
        async create({commit,state}){
            const element = document.getElementById("map");
            await waitForLoading(() =>state.initialized,20);
            await waitForLoading(()=>Object.keys(state.currentLocation).length>0)
            commit("set",["map",createMap(element,state.currentLocation.lat,state.currentLocation.lng)]);
        },
        async initLocationWatcher({rootGetters,commit}){
            if (!rootGetters.isWeb){
                await Geolocation.requestPermissions();
            }
            Geolocation.watchPosition({enableHighAccuracy: true}, (coordinates) => {
                commit("set", ["currentLocation",coordinates ?  {
                    lat: coordinates.coords.latitude,
                    lng: coordinates.coords.longitude
                }:{}])
            })
        },
        async setCamera({state},{lat,lng,zoom=8}){
            state.map.setCenter(new window.google.maps.LatLng(lat, lng));
            state.map.setZoom(zoom);
        }
    }
}
