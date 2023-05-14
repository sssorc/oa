import Vuex from 'vuex'

const store = new Vuex.Store({
	state: {
		round: true,
	},
	actions: {
	},
	getters: {
	},
	mutations: {
		toggleRound(value) {
			console.log('toggle round', value);
			this.state.round = value;
		},
	},
})

export default store;