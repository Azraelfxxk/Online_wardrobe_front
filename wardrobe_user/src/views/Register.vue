<template>
  <div class="register-container">

    <el-card class="register-card">

      <div class="title">
        👔 用户注册
      </div>

      <div class="sub-title">
        加入网上衣橱，开启品质穿搭生活
      </div>

      <el-input
        v-model="username"
        placeholder="请输入用户名"
        style="margin-bottom:15px"
        @keyup.enter="register"
      />

      <el-input
        v-model="password"
        type="password"
        show-password
        placeholder="请输入密码"
        style="margin-bottom:15px"
        @keyup.enter="register"
      />

      <el-input
        v-model="rePassword"
        type="password"
        show-password
        placeholder="确认密码"
        style="margin-bottom:20px"
        @keyup.enter="register"
      />

      <el-button
        class="register-btn"
        type="primary"
        @click="register"
      >
        注册账号
      </el-button>

      <el-button
        class="back-btn"
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

  background:
  linear-gradient(
    135deg,
    #667eea,
    #764ba2
  );
}

.register-card{

  width:450px;

  padding:35px;

  border-radius:20px;

  box-shadow:
  0 15px 40px
  rgba(0,0,0,.15);

}

.title{

  text-align:center;

  font-size:34px;

  font-weight:700;

  color:#303133;

  margin-bottom:10px;

}

.sub-title{

  text-align:center;

  color:#909399;

  margin-bottom:30px;

  font-size:14px;

}

.register-btn{

  width:100%;

  height:45px;

  font-size:16px;

  font-weight:bold;

}

.back-btn{
  width:100%;
  margin-top:10px !important;
  margin-left:0 !important;
}

</style>