// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import Http from '@/assets/http.js'
import App from './App'
import router from './router'
import '@/assets/css/index.css'

Vue.use(ElementUI)
Vue.use(Http)

// 设置全局过滤器
Vue.filter('fmtDate', function (v) {
  return moment(v).format('YYYY-MM-DD hh:mm:ss')
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
