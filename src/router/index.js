import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import user from '../components/user/user'
import rights from '../components/power/rights'
import roles from '../components/power/roles'
import categories from '../components/goods/categories'
import params from '../components/goods/params'
import list from '../components/goods/list'
import add from '../components/goods/add'
import order from '../components/order/order'
import report from '../components/report/report'
Vue.use(VueRouter)



const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
    path:'/login',
    component:login
  },
{
  path:'/home',
  component:home,
  redirect:'/welcome',
  children:[{
   
   path:'/welcome',
   component:welcome,
  
  },
{
  path:'/users',
  component:user,
},{
  path:'/rights',
  component:rights
},{
  path:'/roles',
  component:roles
},{
  path:'/categories',
  component:categories
},{
  path:'/params',
  component:params
},{
  path:'/goods',
  component:list,
  
},{
  path:'/goods/add',
    component:add
},
{
  path:'/orders',
  component:order
},
{
  path:'/reports',
  component:report
}

]
}

]
})

//挂载路由守卫
router.beforeEach((to,from,next)=>{
     /* 
     to 将跳转
     from 从哪来
     next 允许跳转
     */
    if(to.path==='/login'){
      return next()
    }

    const tokenStr=window.sessionStorage.getItem('token') //从window拿到token

    if(!tokenStr){
      return next('/login')
    }
    next()
})



export default router
