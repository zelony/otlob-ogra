import { createRouter, createWebHistory } from '@ionic/vue-router';
import store from "@/store";
import routes from "@/router/routes";
import waitForLoading from "@/methods/waitForLoading";
import driverRedirect from "@/router/navigations/drive-redirect";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0;
    if (to.hash) {
      scrollTo = to.hash;
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
    }
    return window.scroll({
      top: scrollTo,
      behavior: 'smooth'
    });
  }
})

router.beforeEach((to, from, next)=> {
  store.commit("loading/set",["show",true]);
  store.commit("loading/set",["text","loading"]);
  waitForLoading(()=>store.state.user.loaded,200).then(function () {
      try{
        const isLoginPage = to.matched.some(function (r) { return r.meta.onlyWhenLogout; });
        // const isPublicPage = to.matched.some(function (r) { return r.meta.public; });
        const isLoggedIn = store.getters['user/isLoggedIn'];
        const type = store.state.user.type;
        const isUser = to.matched.some(r => r.path.includes("user"));
        const isDriver = to.matched.some(r => r.path.includes("driver"));
        const userDriver = type === "driver";
        if (!isLoggedIn && !isLoginPage) {
          return next("/auth");
        }
        if (isLoginPage && isLoggedIn){
          if (isUser){
            return next("/user")
          }
          return next("/driver")
        }
        if (isUser && type === "driver"){
          return next("/driver")
        }
        if (isDriver && type === "user"){
          return next("/user")
        }
        if (userDriver && isDriver){
          const driverValid = store.getters["driver/isValid"];
          const isDriverSetupData = to.matched.some(r => r.name === "driver-setup-data")
          console.log(driverValid,isDriverSetupData)
          if (driverValid &&isDriverSetupData ){
            return next("/driver/select-car")
          }
          if (!driverValid && !isDriverSetupData){
            return next("/driver/setup-data")
          }
        }
        if (driverRedirect(to,next,store))return
        return next();
      }
      catch (e) {
        console.log(e)
      }
  }).catch(console.log);
})
router.afterEach(()=>{
  store.commit("loading/set",["show",false]);
})
export default router
