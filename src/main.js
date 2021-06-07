import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(vClickOutside);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
