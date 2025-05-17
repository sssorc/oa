import Vuex from 'vuex';
import theme from './modules/theme';

const store = new Vuex.Store({
    state: {
        round: true,
    },
    actions: {},
    getters: {},
    mutations: {
        toggleRound(value) {
            console.log('toggle round', value);
            this.state.round = value;
        },
    },
    modules: {
        theme,
    },
});

export default store;
