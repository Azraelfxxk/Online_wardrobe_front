<template>
  <div style="padding:30px">

    <h2>订单管理</h2>

    <div style="margin-bottom:20px">

      <el-input
        v-model="userName"
        placeholder="请输入用户名"
        style="width:200px;margin-right:10px"
      />

      <el-select
        v-model="status"
        placeholder="订单状态"
        style="width:150px;margin-right:10px"
        clearable
      >
        <el-option label="待付款" value="0" />
        <el-option label="已付款" value="1" />
        <el-option label="待收货" value="2" />
        <el-option label="已完成" value="3" />
      </el-select>

      <el-button
        type="primary"
        @click="loadData"
      >
        查询
      </el-button>

      <el-button
        @click="resetSearch"
      >
        重置
      </el-button>

    </div>

    <el-table
      :data="orderList"
      border
      style="width:100%"
    >

      <el-table-column
        prop="id"
        label="订单号"
        width="80"
      />

      <el-table-column
        prop="userName"
        label="用户名"
        width="120"
      />

      <el-table-column
        prop="clothesDetails"
        label="商品详情"
      />

      <el-table-column
        prop="price"
        label="金额"
        width="100"
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

          <el-tag
            v-if="scope.row.status==='0'"
            type="danger"
          >
            待付款
          </el-tag>

          <el-tag
            v-else-if="scope.row.status==='1'"
            type="warning"
          >
            已付款
          </el-tag>

          <el-tag
            v-else-if="scope.row.status==='2'"
            type="primary"
          >
            待收货
          </el-tag>

          <el-tag
            v-else
            type="success"
          >
            已完成
          </el-tag>

        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="120"
      >
        <template #default="scope">

          <el-button
            v-if="scope.row.status==='1'"
            type="success"
            size="small"
            @click="sendOrder(scope.row.id)"
          >
            发货
          </el-button>

          <span
            v-else
            style="color:#999"
          >
            无操作
          </span>

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

const userName = ref('')

const status = ref('')

const loadData = async()=>{

  try{

    const res = await request.post(
      '/getOrderByParams',
      {
        userName:userName.value,
        status:status.value
      }
    )

    orderList.value =
      res.data.data || []

  }catch(e){

    console.log(e)

    ElMessage.error('加载失败')

  }

}

const resetSearch = ()=>{

  userName.value = ''

  status.value = ''

  loadData()

}

const sendOrder = async(id)=>{

  try{

    const res = await request.post(
      '/sendOrder',
      {
        id:id
      }
    )

    if(res.data.code===200){

      ElMessage.success(
        '发货成功'
      )

      loadData()

    }

  }catch(e){

    console.log(e)

    ElMessage.error(
      '发货失败'
    )

  }

}

onMounted(()=>{

  loadData()

})
</script>