import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import home2 from '../views/home2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path:'/home2',
    component:home2
  }
  
]

const router = new VueRouter({
  routes
})

export default router
