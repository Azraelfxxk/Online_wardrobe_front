<template>
  <div style="padding:30px">

    <h2>商品管理</h2>

    <el-table
      :data="goodsList"
      border
      style="width:100%;margin-top:20px"
    >

      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />

      <el-table-column
        prop="clothName"
        label="商品名称"
      />

      <el-table-column
        prop="typeName"
        label="类型"
      />

      <el-table-column
        prop="style"
        label="风格"
      />

      <el-table-column
        prop="price"
        label="价格"
      />
      <el-table-column
  label="状态"
  width="100"
>
  <template #default="scope">

    <el-tag
      v-if="scope.row.status==1"
      type="success"
    >
      上架
    </el-tag>

    <el-tag
      v-else
      type="danger"
    >
      下架
    </el-tag>

  </template>
</el-table-column>

      <el-table-column
        label="操作"
        width="180"
      >

        <template #default="scope">

          <el-button
  v-if="scope.row.status==1"
  type="warning"
  size="small"
  @click="changeStatus(scope.row.id,0)"
>
  下架
</el-button>

<el-button
  v-else
  type="success"
  size="small"
  @click="changeStatus(scope.row.id,1)"
>
  上架
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

const goodsList = ref([])

const loadData = async ()=>{

  try{

    const res = await request.post(
      '/getAllClothesData',
      {}
    )

    goodsList.value =
      res.data.data

  }catch(e){

    console.log(e)

    ElMessage.error('加载失败')

  }

}
const changeStatus = async(
  id,
  status
)=>{

  try{

    const res =
      await request.post(
        '/changeClothesStatus',
        {
          id:id,
          status:status
        }
      )

    if(res.data.code===200){

      ElMessage.success(
        status===1
          ? '上架成功'
          : '下架成功'
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
const delGoods = (id)=>{

  ElMessageBox.confirm(
    '确定删除该商品吗？',
    '提示',
    {
      type:'warning'
    }
  )
  .then(async()=>{

    try{

      const res = await request.post(
        '/delClothes',
        {
          id:id
        }
      )

      if(res.data.code===200){

        ElMessage.success('删除成功')

        loadData()

      }else{

        ElMessage.error(
          res.data.msg
        )

      }

    }catch(e){

      console.log(e)

      ElMessage.error('删除失败')

    }

  })
  .catch(()=>{})

}

onMounted(()=>{

  loadData()

})
</script>