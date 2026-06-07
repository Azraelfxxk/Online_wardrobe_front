<template>

  <div style="
    padding:30px;
    background:#f5f7fa;
    min-height:100vh;
  ">

    <div
      style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:20px;
      "
    >

      <h2
        style="
        margin:0;
        font-size:30px;
        color:#303133;
        "
      >
        👕 商品管理中心
      </h2>

      <el-button
        type="primary"
        size="large"
        @click="dialogVisible=true"
      >
        ➕ 新增商品
      </el-button>

    </div>

    <el-card shadow="hover">

      <el-table
        :data="goodsList"
        border
        stripe
        style="width:100%"
      >

        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />

        <el-table-column
          label="商品图片"
          width="120"
        >

          <template #default="scope">

            <img
              :src="
              'http://localhost:8080/wardrobe_back/'
              + scope.row.image
              "
              style="
              width:60px;
              height:60px;
              object-fit:cover;
              border-radius:8px;
              border:1px solid #eee;
              "
            >

          </template>

        </el-table-column>

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
          width="120"
        >

          <template #default="scope">

            <el-tag
              v-if="scope.row.status==1"
              type="success"
            >
              🟢 上架
            </el-tag>

            <el-tag
              v-else
              type="danger"
            >
              🔴 下架
            </el-tag>

          </template>

        </el-table-column>

        <el-table-column
          label="操作"
          width="240"
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

            <el-button
              type="danger"
              size="small"
              @click="delGoods(scope.row.id)"
            >
              删除
            </el-button>

          </template>

        </el-table-column>

      </el-table>

    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="🆕 新增商品"
      width="500px"
    >

      <el-input
        v-model="form.clothName"
        placeholder="商品名称"
        style="margin-bottom:10px"
      />

      <el-input
        v-model="form.typeName"
        placeholder="商品类型"
        style="margin-bottom:10px"
      />

      <el-input
        v-model="form.style"
        placeholder="商品风格"
        style="margin-bottom:10px"
      />

      <el-input
        v-model="form.price"
        placeholder="商品价格"
        style="margin-bottom:10px"
      />

      <el-upload
        action="http://localhost:8080/wardrobe_back/uploadFile"
        :show-file-list="false"
        :on-success="uploadSuccess"
      >

        <el-button type="primary">
          📷 上传图片
        </el-button>

      </el-upload>

      <div
        v-if="form.image"
        style="
        margin-top:15px;
        text-align:center;
        "
      >

        <img
          :src="'http://localhost:8080/wardrobe_back/'+form.image"
          style="
          width:150px;
          height:150px;
          object-fit:cover;
          border-radius:10px;
          border:1px solid #ddd;
          "
        />

      </div>

      <template #footer>

        <el-button
          @click="dialogVisible=false"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          @click="addGoods"
        >
          保存商品
        </el-button>

      </template>

    </el-dialog>

  </div>

</template>

<script setup>
import { ref,onMounted } from 'vue'
import request from '../api/request'
import { ElMessage,ElMessageBox } from 'element-plus'

const goodsList = ref([])

const dialogVisible = ref(false)

const form = ref({
  clothName:'',
  typeName:'',
  style:'',
  price:'',
  image:''
})

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

const uploadSuccess = (res)=>{

  if(res.code===200){

    form.value.image =
      res.data.image

    ElMessage.success(
      '图片上传成功'
    )

  }

}

const addGoods = async()=>{

  try{

    const res = await request.post(
      '/addClothes',
      {
        clothName:
          form.value.clothName,

        typeName:
          form.value.typeName,

        style:
          form.value.style,

        price:
          form.value.price,

        image:
          form.value.image
      }
    )

    if(res.data.code===200){

      ElMessage.success(
        '新增成功'
      )

      dialogVisible.value =
        false

      form.value = {
        clothName:'',
        typeName:'',
        style:'',
        price:'',
        image:''
      }

      loadData()

    }

  }catch(e){

    console.log(e)

    ElMessage.error(
      '新增失败'
    )

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

        ElMessage.success(
          '删除成功'
        )

        loadData()

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