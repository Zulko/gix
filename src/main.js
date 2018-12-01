// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

Vue.use(ElementUI, {locale})
Vue.component('icon', Icon)

const notifyOnceSeenKeys = {}
Vue.prototype.$notifyOnce = function (key, params) {
  if (notifyOnceSeenKeys[key]) {
    return
  }
  var defaults = {
    type: 'warning',
    title: 'Beware !',
    dangerouslyUseHTMLString: true,
    duration: 10000
  }
  this.$notify(Object.assign(defaults, params))
  notifyOnceSeenKeys[key] = true
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
