<template>
  <div class="order-container">

    <div class="top-bar">

      <el-button
        @click="$router.push('/home')"
      >
        返回首页
      </el-button>

      <el-button
        @click="loadOrders"
      >
        刷新订单
      </el-button>

    </div>

    <h2>我的订单</h2>

    <el-table
      :data="orderList"
      border
      style="width:100%"
    >

      <el-table-column
        prop="id"
        label="订单号"
        width="100"
      />

      <el-table-column
        prop="clothesDetails"
        label="商品详情"
      />

      <el-table-column
        prop="price"
        label="金额"
        width="120"
      />

      <el-table-column
        prop="address"
        label="收货地址"
      />

      <el-table-column
        prop="time"
        label="下单时间"
        width="180"
      />

      <el-table-column
        label="状态"
        width="120"
      >
        <template #default="scope">
          {{ statusText(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="220"
      >
        <template #default="scope">

          <el-button
            v-if="scope.row.status==='0'"
            type="primary"
            size="small"
            @click="payOrder(scope.row.id)"
          >
            付款
          </el-button>

          <el-button
            v-if="scope.row.status==='2'"
            type="success"
            size="small"
            @click="receiveOrder(scope.row.id)"
          >
            收货
          </el-button>

          <el-button
            type="danger"
            size="small"
            @click="deleteOrder(scope.row.id)"
          >
            删除
          </el-button>

        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import request from '../api/request'
import { ElMessage } from 'element-plus'

const orderList = ref([])

const loadOrders = async()=>{

  const user =
    JSON.parse(localStorage.getItem('user'))

  const res = await request.post(
    '/getOrderByUser',
    {
      userId:user.id
    }
  )

  orderList.value = res.data.data || []
}

const payOrder = async(id)=>{

  await request.post(
    '/payOrder',
    {
      id:id
    }
  )

  ElMessage.success('付款成功')

  loadOrders()
}

const receiveOrder = async(id)=>{

  await request.post(
    '/receiveOrder',
    {
      id:id
    }
  )

  ElMessage.success('确认收货成功')

  loadOrders()
}

const deleteOrder = async(id)=>{

  await request.post(
    '/delOrderData',
    {
      id:id
    }
  )

  ElMessage.success('删除成功')

  loadOrders()
}

const statusText=(status)=>{

  if(status==='0') return '待付款'
  if(status==='1') return '已付款'
  if(status==='2') return '待收货'
  if(status==='3') return '已完成'

  return status
}

onMounted(()=>{
  loadOrders()
})
</script>

<style scoped>

.order-container{
  padding:30px;
}

.top-bar{
  margin-bottom:20px;
}

</style>