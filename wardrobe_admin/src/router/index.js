import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import ManageGoods from '../views/ManageGoods.vue'
import ManageOrders from '../views/ManageOrders.vue'
import ManageUsers from '../views/ManageUsers.vue'

const routes = [

  {
    path:'/',
    redirect:'/login'
  },

  {
    path:'/login',
    component:Login
  },

  {
    path:'/admin',
    component:Admin
  },

  {
    path:'/manageGoods',
    component:ManageGoods
  },

  {
    path:'/manageOrders',
    component:ManageOrders
  },

  {
    path:'/manageUsers',
    component:ManageUsers
  }

]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router