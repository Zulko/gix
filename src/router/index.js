import Vue from 'vue'
import Router from 'vue-router'
import Editor from '@/components/Editor2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Editor',
      component: Editor
    }
  ]
})
