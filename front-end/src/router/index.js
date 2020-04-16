import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Books from '../views/Books.vue'
import Groups from '../views/Groups.vue'
import Group from '../views/Group.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/books',
    component: Books
  },
  {
    path: '/groups',
    component: Groups
  },
  {
    path: '/groups/:id',
    component: Group
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
