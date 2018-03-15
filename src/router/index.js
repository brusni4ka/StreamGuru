import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import ScreenRecord from '@/components/ScreenRecord/ScreenRecord'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/auth',
      name: 'Login',
      component: Login
    },
    {
      path: '/record',
      name: 'Record',
      component: ScreenRecord
    }
  ]
})
