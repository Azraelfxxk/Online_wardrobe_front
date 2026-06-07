<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div style="padding:30px">

    <h2>管理员后台</h2>

    <el-button
      type="primary"
      @click="router.push('/manageGoods')"
    >
      商品管理
    </el-button>

    <el-button
      type="success"
      @click="router.push('/manageOrders')"
    >
      订单管理
    </el-button>

    <el-button
      type="warning"
      @click="router.push('/manageUsers')"
    >
      用户管理
    </el-button>

  </div>
</template>