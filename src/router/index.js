import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [{
  path: '/home',
  name: 'home',
  component: () => import(/* webpackChunkName: "home" */ '../views/Home/Home.vue'),
},
{
  path: '/docs',
  name: 'docs',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "docs" */ '../views/Docs.vue'),
},
{
  path: '/editor',
  name: 'editor',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "editor" */ '../views/Editor/Editor.vue'),
},
{
  path: '/',
  redirect: {
    name: 'home',
  },
},
];

const router = new VueRouter({
  routes,
});

export default router;
