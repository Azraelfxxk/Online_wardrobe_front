<template>
  <div class="cart-container">
	
    <div class="top-bar">

      <el-button @click="$router.push('/goods')">
        继续购物
      </el-button>

      <el-button @click="loadCart">
        刷新购物车
      </el-button>

    </div>

    <h2>我的购物车</h2>

    <el-card style="margin-bottom:20px">

      <h3>收货信息</h3>

      <el-input
        v-model="phone"
        placeholder="联系电话"
        style="margin-bottom:10px"
      />

      <el-input
        v-model="address"
        placeholder="收货地址"
      />

    </el-card>

    <el-table
      :data="cartList"
      border
      style="width:100%"
    >

      <el-table-column
        prop="clothName"
        label="商品名称"
      />

      <el-table-column
        prop="clothSize"
        label="尺码"
      />

      <el-table-column
        prop="amount"
        label="数量"
      />

      <el-table-column
        prop="price"
        label="单价"
      />

      <el-table-column
        prop="totalPrice"
        label="小计"
      />

      <el-table-column
        label="操作"
        width="120"
      >

        <template #default="scope">

          <el-button
            type="danger"
            size="small"
            @click="deleteCart(scope.row.id)"
          >
            删除
          </el-button>

        </template>

      </el-table-column>

    </el-table>

    <div style="margin-top:20px">

      <el-button
        type="success"
        size="large"
        @click="submitOrder"
      >
        提交订单
      </el-button>

    </div>

  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import request from '../api/request'
import { ElMessage } from 'element-plus'

const cartList = ref([])

const phone = ref('')
const address = ref('')

const loadCart = async ()=>{

  try{

    const user =
      JSON.parse(localStorage.getItem('user'))

    const res = await request.post(
      '/getCartDataByUser',
      {
        userId:user.id
      }
    )

    cartList.value = res.data.data || []

  }catch(e){

    console.log(e)

    ElMessage.error('获取购物车失败')
  }

}

const deleteCart = async(id)=>{

  try{

    await request.post(
      '/delCartData',
      {
        id:id
      }
    )

    ElMessage.success('删除成功')

    loadCart()

  }catch(e){

    console.log(e)

    ElMessage.error('删除失败')
  }

}

const submitOrder = async ()=>{

  const user =
    JSON.parse(localStorage.getItem('user'))

  if(cartList.value.length===0){

    ElMessage.warning('购物车为空')
    return

  }

  if(phone.value.trim()===''){

    ElMessage.warning('请输入联系电话')
    return

  }

  if(address.value.trim()===''){

    ElMessage.warning('请输入收货地址')
    return

  }

  try{

    await request.post(
      '/updateUser',
      {
        userName:user.userName,
        phone:phone.value,
        address:address.value
      }
    )

    user.phone = phone.value
    user.address = address.value

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    )

    const res = await request.post(
      '/addOrder',
      {
        userId:user.id
      }
    )

    if(res.data.code===200){

      ElMessage.success('下单成功')

      loadCart()

    }else{

      ElMessage.error(
        res.data.msg || '下单失败'
      )

    }

  }catch(e){

    console.log(e)

    ElMessage.error('下单失败')
  }

}

onMounted(()=>{

  const user =
    JSON.parse(localStorage.getItem('user'))

  if(user){

    phone.value = user.phone || ''
    address.value = user.address || ''

  }

  loadCart()

})
</script>

<style scoped>

.cart-container{
  padding:30px;
}

.top-bar{
  margin-bottom:20px;
}

</style>
