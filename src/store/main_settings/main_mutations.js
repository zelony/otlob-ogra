export default {
    set(state, [variable, value]) {
        state[variable] = value;
    },
    setState(state,val){
        Object.assign(state,val);
    }
}