<template>
  <div class="story-list">
    <!-- 导航栏 -->
    <van-nav-bar
      title="故事大全"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft" />

    <!-- 搜索栏 -->
    <div class="search-bar" @click="goSearch">
      <van-search
        v-model="searchKeyword"
        shape="round"
        background="#4a3570"
        placeholder="搜索故事、童话..."
        input-style="color: #b8a9d9">
        <template #left-icon>
          <van-icon name="search" color="#b8a9d9" size="18" />
        </template>
      </van-search>
    </div>

    <!-- 分类标签 -->
    <van-tabs
      v-model:active="curTabIndex"
      color="#ffd666"
      title-active-color="#ffffff"
      title-inactive-color="#b8a9d9"
      background="#4a3570"
      @change="onTabChange">
      <van-tab v-for="item in tabList" :key="item.type_id" :title="item.name" />
    </van-tabs>

    <!-- 列表内容 -->
    <div class="page-content">
      <template v-if="tabList.length && !isInitialLoading">
        <!-- 故事网格 -->
        <div v-if="resDataList.length" class="story-grid">
          <div
            class="story-card"
            v-for="item in resDataList"
            :key="item.storyId"
            @click="goDetail(item)">
            <div class="story-tag">{{ item.type }}</div>
            <div class="story-cover">
              <img
                :src="`https://picsum.photos/seed/${encodeURIComponent(
                  item.title
                )}/400/300`"
                alt="封面"
                class="cover-img" />
            </div>
            <div class="story-info">
              <span class="story-title">{{ item.title }}</span>
              <span class="story-readtime">预计阅读 {{ item.readTime }}</span>
            </div>
          </div>
        </div>

        <!-- 加载更多触发点 (vant List) -->
        <van-list
          v-if="resDataList.length"
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多故事了"
          :offset="100"
          @load="onLoadMore" />

        <!-- 空状态 -->
        <van-empty
          v-if="!resDataList.length && !loading"
          description="暂无故事数据"
          :image="emptyImage" />
      </template>

      <!-- 页面首次加载骨架屏 -->
      <div v-if="isInitialLoading" class="skeleton">
        <van-skeleton
          v-for="i in 4"
          :key="i"
          title
          avatar
          :row="2"
          style="margin-bottom: 20px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="storyListIndex">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Api from '@/api/story-list';
  import type { StoryItem, TabItem } from './type';

  const router = useRouter();

  // 响应式数据
  const curTabIndex = ref(0);
  const tabList = ref<TabItem[]>([]);
  const resDataList = ref<StoryItem[]>([]);
  const loading = ref(false);
  const finished = ref(false);
  const refreshing = ref(false);
  const page = ref(1);
  const isInitialLoading = ref(true); // 首次加载骨架屏
  const searchKeyword = ref('');
  const emptyImage = 'https://img.yzcdn.cn/vant/custom-empty-image.png'; // 自定义空状态图

  // 返回上一页
  const onClickLeft = () => {
    router.back();
  };

  // 跳转搜索页
  const goSearch = () => {
    router.push('/story-list/search');
  };

  // 标签切换
  const onTabChange = (index: number) => {
    curTabIndex.value = index;
    resetAndLoad();
  };

  // 重置并加载第一页
  const resetAndLoad = () => {
    page.value = 1;
    loading.value = false;
    isInitialLoading.value = true;
    resDataList.value = [];
    finished.value = false;
    loadStoryList();
  };

  // 上拉加载更多（van-list 触发）
  const onLoadMore = () => {
    console.log('触发加载更多', loading.value, finished.value);
    if (finished.value) return;
    loadStoryList();
  };

  // 核心加载逻辑
  const loadStoryList = async () => {
    setTimeout(async () => {
      try {
        const currentTab = tabList.value[curTabIndex.value];
        const params = {
          page: page.value,
          type_id: currentTab?.type_id,
          app_id: 'kfpw9renioaqzrgi',
          app_secret: 'N5Gc3pTocnF1gXTitXuqVHlH0MARXxq7',
        };
        const res = await Api.getStoryList(params);
        const list = res.data || [];

        if (page.value === 1) {
          resDataList.value = list;
        } else {
          resDataList.value.push(...list);
        }

        if (list.length < 10) {
          finished.value = true;
        } else {
          page.value++;
        }
      } catch (err) {
        console.error('加载故事失败', err);
      } finally {
        loading.value = false;
        refreshing.value = false;
        isInitialLoading.value = false;
      }
    }, 1000); // 确保标签渲染后再加载数据，避免请求过快导致的UI问题
  };

  // 跳转详情
  const goDetail = (item: StoryItem) => {
    router.push({
      path: '/story-list/detail',
      query: { storyId: item.storyId },
    });
  };

  // 初始化
  onMounted(async () => {
    try {
      const res = await Api.getTabList({
        app_id: 'kfpw9renioaqzrgi',
        app_secret: 'N5Gc3pTocnF1gXTitXuqVHlH0MARXxq7',
      });
      tabList.value = res.data || [];
      if (tabList.value.length) {
        resetAndLoad();
      } else {
        isInitialLoading.value = false;
      }
    } catch (err) {
      console.error('获取分类失败', err);
      isInitialLoading.value = false;
    }
  });

  // 组件卸载时清理可能的事件监听（无）
</script>

<style lang="less" scoped>
  .story-list {
    min-height: 100vh;
    background: linear-gradient(135deg, #2b2050 0%, #5c3d99 100%);
    padding-bottom: 20px;
  }

  /* 搜索栏 */
  .search-bar {
    background: #4a3570;
    padding: 8px 16px 12px;
    margin-top: -1px; /* 避免顶部空隙 */
  }

  .search-bar :deep(.van-search__content) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
  }

  /* 标签栏样式增强 */
  :deep(.van-tabs__wrap) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  :deep(.van-tab) {
    font-size: 15px;
  }

  /* 内容区 */
  .page-content {
    padding: 12px;
  }

  /* 故事卡片网格 */
  .story-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .story-card {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;

    &:active {
      transform: scale(0.97);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }
  }

  .story-tag {
    position: absolute;
    top: 0;
    right: 0;
    background: #5a4580;
    color: #fff;
    font-size: 11px;
    padding: 4px 10px;
    border-bottom-left-radius: 14px;
    z-index: 2;
  }

  .story-cover {
    width: 100%;
    height: 130px;
    overflow: hidden;
  }

  .cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .story-info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .story-title {
    font-size: 15px;
    color: #ffffff;
    font-weight: 600;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .story-readtime {
    font-size: 12px;
    color: #cfc2e5;
  }

  /* 加载更多文本 */
  :deep(.van-list__finished-text),
  :deep(.van-list__loading) {
    color: #b8a9d9;
    padding: 16px 0;
  }

  /* 骨架屏 */
  .skeleton {
    padding: 12px;
  }

  :deep(.van-skeleton__avatar) {
    width: 100%;
    height: 130px;
  }

  :deep(.van-skeleton__title) {
    height: 18px;
  }

  /* 空状态文字 */
  :deep(.van-empty__description) {
    color: #b8a9d9;
    font-size: 14px;
  }
</style>
