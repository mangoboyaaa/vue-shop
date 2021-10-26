import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import './assets/font_2886105_3csdefatfzs/iconfont.css'
Vue.config.productionTip = false
Vue.prototype.$http=axios
//配置请求的根路径
axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{

  
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config



})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
