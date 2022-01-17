import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import CircularCountDownTimer from "vue-circular-count-down-timer";
import VueApexCharts from 'vue-apexcharts';
import "vue-easytable/libs/theme-default/index.css";
import VueEasytable from "vue-easytable";
import VueGoodTablePlugin from 'vue-good-table';
// import the styles 
import 'vue-good-table/dist/vue-good-table.css'

Vue.config.productionTip = false;
Vue.use(CircularCountDownTimer);
Vue.component('apexchart', VueApexCharts);
Vue.use(VueEasytable);
Vue.use(VueGoodTablePlugin);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
