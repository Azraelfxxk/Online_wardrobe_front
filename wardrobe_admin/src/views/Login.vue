<template>
  <div class="login-container">

    <el-card class="login-card">

      <h2>网上衣橱后台管理系统</h2>

      <p class="sub-title">
        Administrator Console
      </p>

      <el-input
        v-model="username"
        placeholder="请输入管理员账号"
        style="margin-bottom:15px"
        @keyup.enter="login"
      />

      <el-input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        style="margin-bottom:15px"
        @keyup.enter="login"
      />

      <el-button
        type="primary"
        style="width:100%"
        @click="login"
      >
        登录后台
      </el-button>

      <el-alert
        title="管理员账号由系统预先创建"
        type="warning"
        :closable="false"
        style="margin-top:15px"
      />

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

    const res = await request.post(
      '/login',
      {
        account: username.value,
        password: password.value
      }
    )

    if (res.data.code !== 200) {

      ElMessage.error(res.data.msg)
      return

    }

    const user = res.data.data

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    )

    if(user.role != 1){

      ElMessage.error(
        '该账号不是管理员账号'
      )

      return

    }

    ElMessage.success('登录成功')

    router.push('/admin')

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
  background:linear-gradient(
    135deg,
    #232526,
    #414345
  );
}

.login-card{
  width:420px;
  padding:20px;
}

h2{
  text-align:center;
  margin-bottom:10px;
}

.sub-title{
  text-align:center;
  color:#999;
  margin-bottom:25px;
}

</style>