
export default function (to,next,store){
    const hasFullData = !!store.state.driver.car && !!store.state.driver.driver;
    const isLoggedIn = store.getters['user/isLoggedIn'];
    const isValid = store.getters['driver/isValid'];
    const isDriverState = store.state.user.type === "driver";
    const isSelectedCarPage = to.matched.some(r => r.name === "driver-select-car");
    console.log(isDriverState && isLoggedIn && !isSelectedCarPage && !hasFullData && isValid)
    if ( isLoggedIn && !isSelectedCarPage  && isValid){
        next('/driver/select-car');
        return true
    }
    return false;
}
