export default {
    namespaced: true,
    state: {
        show: false,
        text: null,
        enabled:false
    },
    mutations: {
        set(state, [key, val]) {
            state[key] = val;
        }
    },
}
