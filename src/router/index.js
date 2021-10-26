import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import user from '../components/user/user'
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
}]
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
