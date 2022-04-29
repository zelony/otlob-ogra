
export default function (to,next,store){
    const hasFullData = !!store.state.driver.car && !!store.state.driver.driver;
    const isLoggedIn = store.getters['user/isLoggedIn'];
    const isDriverState = store.state.user.type === "driver";
    const isSelectedCarPage = to.matched.some(r => r.name === "driver-select-car");
    if (isDriverState && isLoggedIn && !isSelectedCarPage && !hasFullData){
        next('/driver/select-car');
        return true
    }
    return false;
}
