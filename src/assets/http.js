import axios from 'axios'

const HttpHelper = {}
// 将axios配置成Vue插件
HttpHelper.install = function fn (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
}

export default HttpHelper
