<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>

  <div class="admin-container">

    <div class="header">

      <h1>👔 网上衣橱管理系统</h1>

      <p>Online Wardrobe Admin System</p>

    </div>

    <el-row :gutter="20">

      <el-col :span="8">

        <el-card
          class="menu-card goods"
          @click="router.push('/manageGoods')"
        >
          <div class="icon">👕</div>

          <h2>商品管理</h2>

          <p>商品新增、上下架管理</p>
        </el-card>

      </el-col>

      <el-col :span="8">

        <el-card
          class="menu-card order"
          @click="router.push('/manageOrders')"
        >
          <div class="icon">📦</div>

          <h2>订单管理</h2>

          <p>订单查询、发货管理</p>
        </el-card>

      </el-col>

      <el-col :span="8">

        <el-card
          class="menu-card user"
          @click="router.push('/manageUsers')"
        >
          <div class="icon">👤</div>

          <h2>用户管理</h2>

          <p>用户启用禁用管理</p>
        </el-card>

      </el-col>

    </el-row>

  </div>

</template>

<style scoped>

.admin-container{

  min-height:100vh;

  padding:40px;

  background:
    linear-gradient(
      135deg,
      #667eea,
      #764ba2
    );

}

.header{

  text-align:center;

  color:white;

  margin-bottom:40px;

}

.header h1{

  font-size:38px;

  margin-bottom:10px;

}

.header p{

  font-size:18px;

  opacity:.9;

}

.menu-card{

  text-align:center;

  cursor:pointer;

  transition:.3s;

  border-radius:15px;

}

.menu-card:hover{

  transform:translateY(-8px);

}

.icon{

  font-size:60px;

}

.goods{

  border-top:
    5px solid #409EFF;

}

.order{

  border-top:
    5px solid #67C23A;

}

.user{

  border-top:
    5px solid #E6A23C;

}

</style>