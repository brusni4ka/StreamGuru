import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import ScreenRecord from '@/components/ScreenRecord/ScreenRecord'
import Videos from '@/components/Videos/Videos'
import Chat from '@/components/Chat/Chat'
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
    },
    {
      path: '/videos',
      name: 'videos',
      component: Videos
    },
    {
      path: '/chat/:hash',
      name: 'chat',
      component: Chat
    }
  ]
})
