import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' //导入全局样式表
import axios from 'axios'
import './assets/font_2886105_3csdefatfzs/iconfont.css'  //导入字体图标
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor' //导入富文本编辑器
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.component('treeTable', TreeTable)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
//配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config    //拿到token并供后续router使用
})

Vue.filter('dateFormat',function(originVal){
   const dt=new Date(originVal)

   const year =dt.getFullYear()
   const month=(dt.getMonth()+1+'').padStart(2,'0')
   const day=(dt.getDate()+1+'').padStart(2,'0')
   const hour=(dt.getHours()+'').padStart(2,'0')
   const minute=(dt.getMinutes()+'').padStart(2,'0')
   const seconds=(dt.getSeconds()+'').padStart(2,'0')
return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
