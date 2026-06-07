<template>
  <div class="register-container">

    <el-card class="register-card">

      <h2>用户注册</h2>

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

      <el-input
        v-model="rePassword"
        type="password"
        placeholder="确认密码"
        style="margin-bottom:15px"
      />

      <el-button
        type="primary"
        style="width:100%"
        @click="register"
      >
        注册
      </el-button>

      <el-button
        style="width:100%;margin-top:10px"
        @click="$router.push('/login')"
      >
        返回登录
      </el-button>

    </el-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '../api/request'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const rePassword = ref('')

const register = async () => {

  if (!username.value || !password.value || !rePassword.value) {
    ElMessage.error('请填写完整信息')
    return
  }

  if (password.value !== rePassword.value) {
    ElMessage.error('两次密码不一致')
    return
  }

  try {

    const res = await request.post('/register', {

   userName: username.value,
   password: password.value,


    })

    if (res.data.code !== 200) {
      ElMessage.error(res.data.msg)
      return
    }

    ElMessage.success('注册成功')

    router.push('/login')

  } catch (e) {

    console.error(e)

    ElMessage.error('注册失败')
  }
}
</script>

<style scoped>

.register-container{
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:linear-gradient(135deg,#43cea2,#185a9d);
}

.register-card{
  width:420px;
  padding:20px;
}

</style>