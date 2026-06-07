<template>
  <div class="login-container">

    <el-card class="login-card">

      <h2>网上衣橱系统</h2>

      <el-input
          v-model="username"
          placeholder="请输入用户名"
          style="margin-bottom:15px"
      />

      <el-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          style="margin-bottom:15px"
      />

      <el-button
          type="primary"
          style="width:100%"
          @click="login"
      >
        登录
      </el-button>

      <el-button
          style="width:100%;margin-top:10px"
          @click="$router.push('/register')"
      >
        注册
      </el-button>

    </el-card>

  </div>
</template>

<script setup>
import request from '../api/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')

const login = async () => {

  if (!username.value || !password.value) {
    ElMessage.error('请输入账号密码')
    return
  }

  try {

    const res = await request.post('/login', {
      account: username.value,
      password: password.value
    })

    console.log(res.data)

    if (res.data.code !== 200) {
      ElMessage.error(res.data.msg)
      return
    }

    localStorage.setItem(
      'user',
      JSON.stringify(res.data.data)
    )

    ElMessage.success('登录成功')

localStorage.setItem(
    'user',
    JSON.stringify(res.data.data)
    )

router.push('/goods')

  } catch (e) {

    console.error(e)

    ElMessage.error('登录失败')
  }
}

</script>

<style scoped>

.login-container{
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#667eea,#764ba2);
}

.login-card{
    width:400px;
    padding:20px;
}

</style>