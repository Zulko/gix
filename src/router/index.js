import Vue from 'vue'
import Router from 'vue-router'
import Editor from '@/components/Editor/Editor'
import Home from '@/components/Home/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/editor',
      name: 'Editor',
      component: Editor
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
