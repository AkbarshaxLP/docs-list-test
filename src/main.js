import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import plugins from './plugins/element-ui'
Vue.use(plugins)

import './assets/scss/glob.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
