import { createRouter, createWebHashHistory } from 'vue-router'
import Goods from '../views/Goods.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import Order from '../views/Order.vue'
import Admin from '../views/Admin.vue'
import ManageGoods from '../views/ManageGoods.vue'
import ManageOrders from '../views/ManageOrders.vue'
import ManageUsers from '../views/ManageUsers.vue'
const routes = [
  {
    path:'/admin',
    component:Admin
  },
  {
    path:'/goods',
    component:Goods
  },
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/register',
    component:Register
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/cart',
    component:Cart
  },
  {
    path:'/orders',
    component:Order
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