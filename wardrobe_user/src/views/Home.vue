<template>
  <div>

    <el-container>

      <el-header class="header">
        👔 网上衣橱系统
      </el-header>

      <el-main>

        <el-card class="user-card">

          <div class="avatar-box">
            👤
          </div>

          <h2>
            欢迎回来，
            {{ user.userName }}
          </h2>

          <p>
            📱 手机号：
            {{ user.phone || '未填写' }}
          </p>

          <p>
            📍 地址：
            {{ user.address || '未填写' }}
          </p>

          <p>
            🏷️ 角色：
            {{ user.role == 1 ? '管理员' : '普通用户' }}
          </p>

          <div class="btn-group">

            <el-button
              type="info"
              @click="dialogVisible=true"
            >
              个人资料
            </el-button>

            <el-button
              type="primary"
              @click="$router.push('/goods')"
            >
              浏览商品
            </el-button>

            <el-button
              type="success"
              @click="$router.push('/cart')"
            >
              我的购物车
            </el-button>

            <el-button
              type="warning"
              @click="$router.push('/orders')"
            >
              我的订单
            </el-button>

            <el-button
              v-if="user.role == 1"
              type="info"
              @click="$router.push('/admin')"
            >
              后台管理
            </el-button>

            <el-button
              type="danger"
              @click="logout"
            >
              退出登录
            </el-button>

          </div>

        </el-card>

      </el-main>

    </el-container>

    <el-dialog
      v-model="dialogVisible"
      title="个人资料"
      width="500px"
    >

      <el-input
        v-model="form.userName"
        placeholder="用户名"
        style="margin-bottom:15px"
      />

      <el-input
        v-model="form.phone"
        placeholder="手机号"
        style="margin-bottom:15px"
      />

      <el-input
        v-model="form.address"
        placeholder="地址"
      />

      <template #footer>

        <el-button
          @click="dialogVisible=false"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          @click="saveUser"
        >
          保存修改
        </el-button>

      </template>

    </el-dialog>

  </div>
</template>

<script setup>
import { reactive,onMounted,ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/request'
import { ElMessage } from 'element-plus'

const router = useRouter()

const dialogVisible = ref(false)

const user = reactive({
  userName:'',
  phone:'',
  address:'',
  role:2
})

const form = reactive({
  userName:'',
  phone:'',
  address:''
})

onMounted(()=>{

  const loginUser =
    JSON.parse(
      localStorage.getItem('user')
    )

  if(loginUser){

    Object.assign(
      user,
      loginUser
    )

    Object.assign(
      form,
      {
        userName:
          loginUser.userName,

        phone:
          loginUser.phone,

        address:
          loginUser.address
      }
    )

  }else{

    router.push('/login')

  }

})

const saveUser = async()=>{

  try{

    const res =
      await request.post(
        '/updateUser',
        {
          userName:
            form.userName,

          phone:
            form.phone,

          address:
            form.address
        }
      )

    if(res.data.code===200){

      user.userName =
        form.userName

      user.phone =
        form.phone

      user.address =
        form.address

      const oldUser =
        JSON.parse(
          localStorage.getItem('user')
        )

      oldUser.userName =
        form.userName

      oldUser.phone =
        form.phone

      oldUser.address =
        form.address

      localStorage.setItem(
        'user',
        JSON.stringify(oldUser)
      )

      ElMessage.success(
        '修改成功'
      )

      dialogVisible.value =
        false

    }

  }catch(e){

    console.log(e)

    ElMessage.error(
      '修改失败'
    )

  }

}

const logout = ()=>{

  localStorage.removeItem('user')

  router.push('/login')

}
</script>

<style scoped>

.header{
  background:#409EFF;
  color:white;
  line-height:60px;
  font-size:22px;
  padding-left:30px;
  font-weight:bold;
}

.el-main{
  padding:40px;
  background:#f5f7fa;
  min-height:calc(100vh - 60px);
}

.user-card{
  max-width:900px;
  margin:auto;
  padding:30px;
  border-radius:15px;
  box-shadow:
    0 8px 20px
    rgba(0,0,0,.08);
}

.avatar-box{
  width:90px;
  height:90px;
  background:#409EFF;
  color:white;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:42px;
  margin:auto;
  margin-bottom:20px;
}

h2{
  text-align:center;
  margin-bottom:25px;
}

p{
  font-size:18px;
  margin-bottom:15px;
}

.btn-group{
  margin-top:30px;
}

.btn-group .el-button{
  margin-right:10px;
  margin-bottom:10px;
}

</style>