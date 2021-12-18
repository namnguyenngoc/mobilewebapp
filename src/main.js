import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import CircularCountDownTimer from "vue-circular-count-down-timer";

Vue.config.productionTip = false
Vue.use(CircularCountDownTimer)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
