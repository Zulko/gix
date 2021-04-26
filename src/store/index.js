import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import { state } from './state';
import getters from './getters';
import plugins from './plugins';

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  strict: true,
  plugins,
});

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./mutations'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newMutations = require('./mutations').default; // eslint-disable-line
    // swap in the new modules and mutations
    store.hotUpdate({
      mutations: newMutations,
    });
  });
}

export default store;
