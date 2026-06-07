<template>
  <div class="goods-container">

    <div class="top-bar">

      <el-button
        @click="$router.push('/home')"
      >
        返回首页
      </el-button>

      <el-button
        type="success"
        @click="$router.push('/cart')"
      >
        查看购物车
      </el-button>

    </div>

    <h2>商品列表</h2>

    <el-row :gutter="20">

      <el-col
        :span="8"
        v-for="item in goodsList"
        :key="item.id"
      >

        <el-card class="goods-card">

          <img
            :src="imgUrl(item.image)"
            class="goods-img"
          >

          <h3>{{ item.clothName }}</h3>

          <p>类型：{{ item.typeName }}</p >

          <p>风格：{{ item.style }}</p >

          <p class="price">
            ￥{{ item.price }}
          </p >

          <el-button
            type="primary"
            @click="showSizeDialog(item)"
          >
            加入购物车
          </el-button>

        </el-card>

      </el-col>

    </el-row>

    <el-dialog
      v-model="dialogVisible"
      title="选择尺码"
      width="400px"
    >

      <el-select
        v-model="selectedSize"
        placeholder="请选择尺码"
        style="width:100%"
      >

        <el-option
          v-for="size in sizeList"
          :key="size"
          :label="size"
          :value="size"
        />

      </el-select>

      <template #footer>

        <el-button
          @click="dialogVisible=false"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          @click="confirmAddCart"
        >
          确定
        </el-button>

      </template>

    </el-dialog>

  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import request from '../api/request'
import { ElMessage,ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const goodsList = ref([])

const dialogVisible = ref(false)

const sizeList = ref([])

const selectedSize = ref('')

const currentItem = ref(null)

const loadData = async()=>{

  try{

    const res = await request.post(
      '/allClothes',
      {}
    )

    goodsList.value =
      res.data.data || []

  }catch(e){

    console.log(e)

    ElMessage.error('获取商品失败')

  }

}

const showSizeDialog = async(item)=>{

  currentItem.value = item

  selectedSize.value = ''

  try{

    const res = await request.post(
      '/getSizeByType',
      {
        typeId:item.typeId
      }
    )

    sizeList.value =
      res.data.data || []

    dialogVisible.value = true

  }catch(e){

    console.log(e)

    ElMessage.error('获取尺码失败')

  }

}

const confirmAddCart = async()=>{

  if(!selectedSize.value){

    ElMessage.warning('请选择尺码')

    return

  }

  const user =
    JSON.parse(
      localStorage.getItem('user')
    )

  if(!user){

    ElMessage.error('请先登录')

    return

  }

  try{

    const res = await request.post(
      '/addToCart',
      {
        clothId:currentItem.value.id,
        clothSize:selectedSize.value,
        amount:1,
        userId:user.id
      }
    )

    if(res.data.code===200){

      dialogVisible.value = false

      ElMessageBox.confirm(
        currentItem.value.clothName +
        ' 已加入购物车，是否查看购物车？',
        '成功',
        {
          confirmButtonText:'查看购物车',
          cancelButtonText:'继续购物',
          type:'success'
        }
      )
      .then(()=>{

        router.push('/cart')

      })
      .catch(()=>{})

    }else{

      ElMessage.error(
        res.data.msg || '加入购物车失败'
      )

    }

  }catch(e){

    console.log(e)

    ElMessage.error('加入购物车失败')

  }

}

const imgUrl=(img)=>{

  return (
    'http://localhost:8080/wardrobe_back/' +
    img
  )

}

onMounted(()=>{

  loadData()

})
</script>

<style scoped>

.goods-container{
  padding:30px;
}

.top-bar{
  margin-bottom:20px;
}

.goods-card{
  margin-bottom:20px;
}

.goods-img{
  width:100%;
  height:220px;
  object-fit:cover;
}

.price{
  color:red;
  font-size:20px;
  font-weight:bold;
}

</style>