<template>
  <div style="padding:30px">

    <h2>用户管理</h2>

    <div style="margin-bottom:20px">

      <el-input
        v-model="userName"
        placeholder="用户名"
        style="width:200px;margin-right:10px"
      />

      <el-input
        v-model="phone"
        placeholder="手机号"
        style="width:200px;margin-right:10px"
      />

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
      :data="userList"
      border
      style="width:100%"
    >

      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />

      <el-table-column
        prop="userName"
        label="用户名"
      />

      <el-table-column
         label="手机号"
        >
      <template #default="scope">
        {{ scope.row.phone || '未填写' }}
      </template>
      </el-table-column>

<el-table-column
  label="地址"
>
  <template #default="scope">
    {{ scope.row.address || '未填写' }}
  </template>
</el-table-column>

      <el-table-column
        label="状态"
        width="100"
      >
        <template #default="scope">

          <el-tag
            v-if="scope.row.status==1"
            type="success"
          >
            正常
          </el-tag>

          <el-tag
            v-else
            type="danger"
          >
            已禁用
          </el-tag>

        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        width="220"
      >
        <template #default="scope">

          <el-tag
            v-if="scope.row.role==1"
            type="danger"
          >
            管理员
          </el-tag>

          <el-tag
            v-else
            type="success"
          >
            普通用户
          </el-tag>

        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="120"
      >
        <template #default="scope">

          <el-button
            v-if="scope.row.status==1"
            type="warning"
            size="small"
            @click="changeStatus(scope.row.id,0)"
          >
            禁用
          </el-button>

          <el-button
            v-else
            type="success"
            size="small"
            @click="changeStatus(scope.row.id,1)"
          >
            启用
          </el-button>

          <el-button
            type="danger"
            size="small"
            @click="delUser(scope.row.id)"
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
import { ElMessage,ElMessageBox } from 'element-plus'

const userList = ref([])

const userName = ref('')

const phone = ref('')

const loadData = async()=>{

  try{

    const res = await request.post(
      '/getUserByParam',
      {
        userName:userName.value,
        phone:phone.value
      }
    )

    userList.value =
      res.data.data || []

  }catch(e){

    console.log(e)

    ElMessage.error(
      '加载失败'
    )

  }

}

const resetSearch = ()=>{

  userName.value = ''

  phone.value = ''

  loadData()

}
const changeStatus = async(
  id,
  status
)=>{

  try{

    const res =
      await request.post(
        '/changeUserStatus',
        {
          id:id,
          status:status
        }
      )

    if(res.data.code===200){

      ElMessage.success(
        status===1
          ? '启用成功'
          : '禁用成功'
      )

      loadData()

    }

  }catch(e){

    console.log(e)

    ElMessage.error(
      '操作失败'
    )

  }

}
const delUser = (id)=>{

  ElMessageBox.confirm(
    '确定删除该用户吗？',
    '提示',
    {
      type:'warning'
    }
  )
  .then(async()=>{

    try{

      const res = await request.post(
        '/delUser',
        {
          id:id
        }
      )

      if(res.data.code===200){

        ElMessage.success(
          '删除成功'
        )

        loadData()

      }else{

        ElMessage.error(
          res.data.msg
        )

      }

    }catch(e){

      console.log(e)

      ElMessage.error(
        '删除失败'
      )

    }

  })
  .catch(()=>{})

}

onMounted(()=>{

  loadData()

})
</script>