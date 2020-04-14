import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Lottery from '../views/Lottery.vue'
import Admin from '../views/Admin.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Lottery',
    component: Lottery
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
