<template>
  <div class="page-wrapper">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-content">
        <div class="nav-left">
          <span class="logo">👔 网上衣橱</span>
        </div>
        
        <div class="nav-search">
          <el-input
            v-model="keyword"
            placeholder="搜索商品..."
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        
        <div class="nav-right">
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ username }}
          </span>
          <el-button text @click="$router.push('/cart')">
            <el-badge :value="cartCount" :hidden="!cartCount">
              <el-icon><ShoppingCart /></el-icon>
            </el-badge>
            购物车
          </el-button>
          <el-button text @click="$router.push('/orders')">我的订单</el-button>
          <el-button text @click="$router.push('/home')">个人中心</el-button>
          <el-button text @click="logout" class="logout-btn">退出</el-button>
        </div>
      </div>
    </div>

    <!-- 分类筛选栏 -->
    <div class="filter-bar">
      <div class="filter-content">
        <div class="filter-left">
          <span class="filter-label">分类：</span>
          <el-radio-group v-model="selectedType" size="large">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button v-for="type in typeList" :key="type" :label="type">{{ type }}</el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="filter-right">
          <span class="filter-label">排序：</span>
          <el-radio-group v-model="sortType" size="large">
            <el-radio-button label="default">综合</el-radio-button>
            <el-radio-button label="sales">销量</el-radio-button>
            <el-radio-button label="price-asc">价格↑</el-radio-button>
            <el-radio-button label="price-desc">价格↓</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 商品容器 -->
    <div class="goods-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-grid">
          <div v-for="i in 9" :key="i" class="skeleton-card">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" class="skeleton-img" />
                <el-skeleton-item variant="text" class="skeleton-title" />
                <el-skeleton-item variant="text" class="skeleton-price" />
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-else class="goods-grid">
        <div
          v-for="item in paginatedGoods"
          :key="item.id"
          class="goods-card"
          @click="showSizeDialog(item)"
        >
          <!-- 促销标签 -->
          <div class="card-tags">
            <span v-if="item.discount" class="discount-tag">{{ item.discount }}折</span>
            <span v-if="item.isHot" class="hot-tag">🔥 热销</span>
            <span v-if="item.isNew" class="new-tag">新品</span>
          </div>
          
          <!-- 商品图片 -->
          <div class="img-wrapper">
            <img :src="imgUrl(item.image)" class="goods-img" :alt="item.clothName">
            <div class="img-mask">
              <span class="view-detail">查看详情</span>
            </div>
          </div>
          
          <!-- 商品信息 -->
          <div class="goods-info-wrapper">
            <div class="goods-title">{{ item.clothName }}</div>
            
            <div class="goods-desc">
              <span class="tag">{{ item.typeName }}</span>
              <span class="tag">{{ item.style }}</span>
            </div>
            
            <div class="price-wrapper">
              <span class="current-price">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ item.price }}</span>
              </span>
              <span v-if="item.originalPrice" class="original-price">
                ¥{{ item.originalPrice }}
              </span>
              <span class="sales-count">已售{{ item.sales || 0 }}件</span>
            </div>
            
            <div class="action-wrapper">
              <el-button type="primary" class="add-cart-btn" @click.stop="showSizeDialog(item)">
                <el-icon><ShoppingCart /></el-icon>
                加入购物车
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && paginatedGoods.length === 0" description="暂无商品" />

      <!-- 分页 -->
      <div v-if="!loading && filterGoods.length > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          :total="filterGoods.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 右侧悬浮工具栏 -->
    <div class="sidebar-tools">
      <div class="tool-item cart-tool" @click="$router.push('/cart')">
        <el-badge :value="cartCount" :hidden="!cartCount">
          <el-icon><ShoppingCart /></el-icon>
        </el-badge>
        <span>购物车</span>
      </div>
      <div class="tool-item" @click="scrollToTop">
        <el-icon><Top /></el-icon>
        <span>回到顶部</span>
      </div>
    </div>

    <!-- 尺码选择弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="选择尺码"
      width="420px"
      class="size-dialog"
    >
      <div class="selected-goods" v-if="currentItem">
        <img :src="imgUrl(currentItem.image)" class="dialog-img">
        <div class="dialog-info">
          <div class="dialog-title">{{ currentItem.clothName }}</div>
          <div class="dialog-price">¥{{ currentItem.price }}</div>
        </div>
      </div>
      
      <div class="size-section">
        <div class="size-label">选择尺码：</div>
        <el-radio-group v-model="selectedSize" class="size-options">
          <el-radio-button v-for="size in sizeList" :key="size" :label="size">
            {{ size }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddCart" :disabled="!selectedSize">
          确定加入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../api/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Search, User, ShoppingCart, Top } from '@element-plus/icons-vue'

const router = useRouter()

// 用户信息
const username = ref('用户')
const cartCount = ref(0)

// 搜索和筛选
const keyword = ref('')
const selectedType = ref('')
const sortType = ref('default')
const loading = ref(true)

// 商品数据
const goodsList = ref([])
const typeList = ref(['上衣', '裤子', '裙子', '外套', '配饰'])

// 分页
const currentPage = ref(1)
const pageSize = ref(12)

// 尺码弹窗
const dialogVisible = ref(false)
const sizeList = ref([])
const selectedSize = ref('')
const currentItem = ref(null)

// 模拟销售数据
const goodsWithExtra = computed(() => {
  return goodsList.value.map((item, index) => ({
    ...item,
    originalPrice: item.price * (1 + Math.random() * 0.5).toFixed(2),
    sales: Math.floor(Math.random() * 1000),
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 3 + 8) : null,
    isHot: Math.random() > 0.8,
    isNew: Math.random() > 0.9
  }))
})

// 筛选和排序
const filterGoods = computed(() => {
  let result = goodsWithExtra.value
  
  // 关键词搜索
  if (keyword.value) {
    result = result.filter(item =>
      item.clothName?.includes(keyword.value) ||
      item.typeName?.includes(keyword.value) ||
      item.style?.includes(keyword.value)
    )
  }
  
  // 分类筛选
  if (selectedType.value) {
    result = result.filter(item => item.typeName === selectedType.value)
  }
  
  // 排序
  if (sortType.value === 'price-asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortType.value === 'price-desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  } else if (sortType.value === 'sales') {
    result = [...result].sort((a, b) => (b.sales || 0) - (a.sales || 0))
  }
  
  return result
})

// 分页数据
const paginatedGoods = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filterGoods.value.slice(start, start + pageSize.value)
})

// 获取用户信息
const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user) {
    username.value = user.username || '用户'
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await request.post('/allClothes', {})
    goodsList.value = res.data.data || []
  } catch (e) {
    console.log(e)
    ElMessage.error('获取商品失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 显示尺码弹窗
const showSizeDialog = async (item) => {
  currentItem.value = item
  selectedSize.value = ''
  try {
    const res = await request.post('/getSizeByType', { typeId: item.typeId })
    sizeList.value = res.data.data || []
    dialogVisible.value = true
  } catch (e) {
    console.log(e)
    ElMessage.error('获取尺码失败')
  }
}

// 确认加入购物车
const confirmAddCart = async () => {
  if (!selectedSize.value) {
    ElMessage.warning('请选择尺码')
    return
  }
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) {
    ElMessage.error('请先登录')
    router.push('/login')
    return
  }
  
  try {
    const res = await request.post('/addToCart', {
      clothId: currentItem.value.id,
      clothSize: selectedSize.value,
      amount: 1,
      userId: user.id
    })
    
    if (res.data.code === 200) {
      dialogVisible.value = false
      cartCount.value++
      ElMessageBox.confirm(
        currentItem.value.clothName + ' 已加入购物车，是否查看购物车？',
        '加入成功',
        {
          confirmButtonText: '查看购物车',
          cancelButtonText: '继续购物',
          type: 'success'
        }
      ).then(() => {
        router.push('/cart')
      }).catch(() => {})
    } else {
      ElMessage.error(res.data.msg || '加入购物车失败')
    }
  } catch (e) {
    console.log(e)
    ElMessage.error('加入购物车失败')
  }
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 图片地址
const imgUrl = (img) => {
  return 'http://localhost:8080/wardrobe_back/' + img
}

// 退出登录
const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  getUserInfo()
  loadData()
})
</script>

<style scoped>
/* 页面整体布局 */
.page-wrapper {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航 */
.top-nav {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(255, 80, 0, 0.3);
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 12px 40px;
  gap: 40px;
}

.nav-left {
  flex-shrink: 0;
}

.logo {
  font-size: 28px;
  font-weight: 900;
  color: white;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-search {
  flex: 1;
  max-width: 700px;
}

.search-input {
  --el-input-bg-color: white;
  --el-input-border-color: transparent;
  --el-input-hover-border-color: transparent;
  --el-input-focus-border-color: transparent;
  border-radius: 24px;
  overflow: hidden;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  padding: 4px 16px;
  box-shadow: none;
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.search-input :deep(.el-input-group__append) {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  border: none;
  border-radius: 0 24px 24px 0;
  color: white;
}

.search-input :deep(.el-button) {
  background: transparent;
  border: none;
  color: white;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.15);
  border-radius: 20px;
}

.nav-right .el-button {
  color: white;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-right .el-button:hover {
  background: rgba(255,255,255,0.15);
}

.logout-btn {
  background: rgba(255,255,255,0.1) !important;
}

/* 分类筛选栏 */
.filter-bar {
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 60px;
  z-index: 999;
}

.filter-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.filter-left,
.filter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

.filter-bar :deep(.el-radio-button__inner) {
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  margin: 0 4px;
  box-shadow: none;
}

.filter-bar :deep(.el-radio-button__original:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  border-color: #ff5000;
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.3);
}

.filter-bar :deep(.el-radio-button) {
  margin: 0;
}

/* 商品容器 */
.goods-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px;
}

/* 加载骨架屏 */
.loading-container {
  padding: 20px 0;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.skeleton-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
}

.skeleton-img {
  width: 100%;
  height: 220px;
  border-radius: 12px;
}

.skeleton-title {
  width: 80%;
  height: 24px;
  margin: 16px 0 12px;
}

.skeleton-price {
  width: 40%;
  height: 28px;
}

/* 商品网格 */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* 商品卡片 */
.goods-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.goods-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.12);
}

/* 卡片标签 */
.card-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.discount-tag {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.hot-tag,
.new-tag {
  background: linear-gradient(135deg, #ff6a00, #ff8533);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.new-tag {
  background: linear-gradient(135deg, #07c160, #10b980);
}

/* 图片区域 */
.img-wrapper {
  position: relative;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.goods-card:hover .goods-img {
  transform: scale(1.08);
}

.img-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.goods-card:hover .img-mask {
  opacity: 1;
}

.view-detail {
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  border-radius: 24px;
}

/* 商品信息 */
.goods-info-wrapper {
  padding: 16px;
}

.goods-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-desc {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  font-size: 12px;
  color: #ff5000;
  background: #fff0e6;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 价格区域 */
.price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.current-price {
  color: #ff5000;
}

.price-symbol {
  font-size: 14px;
  font-weight: 600;
}

.price-value {
  font-size: 26px;
  font-weight: 900;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.sales-count {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

/* 操作按钮 */
.action-wrapper {
  display: flex;
  gap: 10px;
}

.add-cart-btn {
  flex: 1;
  height: 40px;
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  border: none;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s;
}

.add-cart-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 80, 0, 0.4);
  transform: translateY(-2px);
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination-wrapper :deep(.el-pagination__total) {
  font-weight: 600;
}

.pagination-wrapper :deep(.el-pager li.is-active) {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  border-radius: 50%;
}

.pagination-wrapper :deep(.el-pager li:hover) {
  color: #ff5000;
}

.pagination-wrapper :deep(.el-pagination button) {
  border-radius: 50%;
}

.pagination-wrapper :deep(.el-pagination .el-pager li) {
  border-radius: 50%;
  min-width: 36px;
  height: 36px;
  line-height: 36px;
}

/* 右侧悬浮工具栏 */
.sidebar-tools {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 999;
}

.tool-item {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s;
  margin-bottom: 12px;
  font-size: 12px;
  color: #666;
}

.tool-item:hover {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  color: white;
  transform: scale(1.1);
}

.cart-tool {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  color: white;
}

.cart-tool:hover {
  background: linear-gradient(135deg, #ff6a00, #ff8533);
}

/* 尺码选择弹窗 */
.size-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

.size-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #ff5000, #ff6a00);
  color: white;
  margin: 0;
  padding: 20px;
}

.size-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
}

.size-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

.selected-goods {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 20px;
}

.dialog-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.dialog-info {
  flex: 1;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.dialog-price {
  font-size: 22px;
  font-weight: 900;
  color: #ff5000;
}

.size-section {
  padding: 10px 0;
}

.size-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-options :deep(.el-radio-button__inner) {
  border: 2px solid #eee;
  border-radius: 8px;
  padding: 10px 20px;
}

.size-options :deep(.el-radio-button__original:checked + .el-radio-button__inner) {
  border-color: #ff5000;
  background: #fff0e6;
  color: #ff5000;
}

/* 响应式 */
@media (max-width: 1200px) {
  .goods-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .loading-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-content {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .nav-content {
    padding: 10px 16px;
    flex-wrap: wrap;
  }
  .nav-search {
    order: 3;
    max-width: 100%;
    width: 100%;
  }
  .goods-container {
    padding: 16px;
  }
  .goods-grid {
    grid-template-columns: 1fr;
  }
  .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
