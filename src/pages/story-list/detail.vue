<template>
  <div class="story-detail">
    <!-- 导航栏 - 透明玻璃风格 -->
    <van-nav-bar
      title="故事详情"
      left-text="返回"
      left-arrow
      fixed
      z-index="10"
      placeholder
      :border="false"
      @click-left="onClickLeft"
      class="transparent-nav" />

    <!-- 主要内容区域 -->
    <div class="story-container">
      <!-- 头部卡片区域 -->
      <div class="story-header glass-card">
        <div class="title-section">
          <h1 class="story-title">{{ storyData.title || '故事标题' }}</h1>
          <div class="tag-group">
            <span class="story-tag">
              <van-icon name="label-o" size="12" />
              {{ storyData.type || '故事' }}
            </span>
          </div>
        </div>

        <div class="story-meta">
          <div class="meta-left">
            <van-icon name="clock-o" />
            <span class="read-time"
              >预计阅读 {{ storyData.readTime || '5分钟' }}</span
            >
          </div>
          <div class="copy-btn" @click="copyContent">
            <van-icon name="records-o" />
            <span>复制全文</span>
          </div>
        </div>
      </div>

      <!-- 内容卡片区域 -->
      <div class="story-content glass-card">
        <div class="content-decoration"></div>
        <div class="story-text-wrapper">
          <div class="story-text">{{
            storyData.content || '故事内容加载中...'
          }}</div>
        </div>
        <!-- 底部复制提示 -->
        <div class="bottom-copy-tip" @click="copyContent">
          <van-icon name="edit" />
          <span>一键复制故事</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { showToast, showLoadingToast, closeToast } from 'vant';
  import Api from '@/api/story-list';
  import type { StoryItem } from './type';

  const router = useRouter();
  const route = useRoute();

  // 响应式数据
  const storyData = ref<StoryItem>({} as StoryItem);
  const storyId = ref<string>('');

  // 返回上一页
  const onClickLeft = () => {
    router.back();
  };

  // 复制故事内容
  const copyContent = async () => {
    const content = storyData.value.content;
    if (!content) {
      showToast({
        message: '暂无内容可复制',
        icon: 'warning-o',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      showToast({
        message: '复制成功！✨',
        icon: 'success',
        duration: 1500,
        position: 'bottom',
      });
    } catch (err) {
      // 降级方案：使用 textarea 复制
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast({
          message: '复制成功！✨',
          icon: 'success',
          duration: 1500,
          position: 'bottom',
        });
      } catch (e) {
        showToast({
          message: '复制失败，请手动复制',
          icon: 'fail',
        });
      }
      document.body.removeChild(textarea);
    }
  };

  // 获取故事详情
  const goDetail = async () => {
    if (!storyId.value) {
      showToast('故事ID无效');
      return;
    }
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
    });
    try {
      const params = {
        app_id: 'kfpw9renioaqzrgi',
        app_secret: 'N5Gc3pTocnF1gXTitXuqVHlH0MARXxq7',
        story_id: storyId.value,
      };
      const res = await Api.getStoryDetail(params);
      if (res.data) {
        storyData.value = res.data;
      } else {
        showToast('故事加载失败');
      }
    } catch (err) {
      console.error('加载故事详情失败', err);
      showToast('网络错误，请稍后重试');
    } finally {
      closeToast();
    }
  };

  // 初始化
  onMounted(() => {
    storyId.value = (route.query.storyId as string) || '';
    if (storyId.value) {
      goDetail();
    } else {
      showToast('参数错误');
    }
  });
</script>

<style lang="less" scoped>
  // 全局动画
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .story-detail {
    min-height: 100vh;
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    position: relative;
    padding-bottom: 30px;

    // 装饰性背景光晕
    &::before {
      content: '';
      position: fixed;
      top: -20%;
      right: -20%;
      width: 80%;
      height: 80%;
      background: radial-gradient(
        circle,
        rgba(100, 80, 200, 0.15) 0%,
        transparent 70%
      );
      pointer-events: none;
      z-index: 0;
    }

    &::after {
      content: '';
      position: fixed;
      bottom: -20%;
      left: -20%;
      width: 80%;
      height: 80%;
      background: radial-gradient(
        circle,
        rgba(80, 120, 200, 0.1) 0%,
        transparent 70%
      );
      pointer-events: none;
      z-index: 0;
    }
  }

  // 透明导航栏样式
  .transparent-nav {
    :deep(.van-nav-bar__content) {
      background-color: rgba(26, 26, 46, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    :deep(.van-nav-bar__title) {
      color: #fff;
      font-weight: 500;
      font-size: 18px;
    }

    :deep(.van-nav-bar__left) {
      color: #fff;
      .van-icon {
        color: #fff;
      }
      .van-nav-bar__text {
        color: #f0f0f0;
      }
    }
  }

  .story-container {
    padding: 16px;
    animation: fadeIn 0.5s ease-out;
    position: relative;
    z-index: 1;
  }

  // 玻璃卡片通用样式
  .glass-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .story-header {
    padding: 20px 20px 16px;
    margin-bottom: 20px;
    transition: all 0.3s;

    .title-section {
      margin-bottom: 16px;
    }

    .story-title {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
      margin: 0 0 12px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: -0.3px;
    }

    .tag-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .story-tag {
      background: linear-gradient(
        135deg,
        rgba(100, 108, 255, 0.8),
        rgba(80, 90, 200, 0.9)
      );
      color: #fff;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(4px);
      font-weight: 500;
      letter-spacing: 0.3px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  }

  .story-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .meta-left {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;

      .van-icon {
        font-size: 14px;
      }
    }

    .copy-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      padding: 6px 14px;
      border-radius: 40px;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(4px);

      &:active {
        transform: scale(0.96);
        background: rgba(255, 255, 255, 0.25);
      }

      .van-icon {
        font-size: 14px;
      }
    }
  }

  .story-content {
    padding: 24px 20px 20px;
    position: relative;
    overflow: hidden;

    .content-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #6c63ff, #b8a9ff, #6c63ff);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: 100% 0;
      }
      100% {
        background-position: -100% 0;
      }
    }

    .story-text-wrapper {
      max-height: 50vh;
      overflow-y: auto;
      padding-right: 4px;

      // 自定义滚动条
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }
    }

    .story-text {
      font-size: 16px;
      line-height: 1.85;
      color: rgba(255, 255, 255, 0.92);
      letter-spacing: 0.3px;
      text-align: justify;
      white-space: pre-wrap;
      word-break: break-word;
      font-weight: 400;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    }

    .bottom-copy-tip {
      margin-top: 28px;
      padding-top: 16px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;

      &:active {
        color: rgba(255, 255, 255, 0.9);
        transform: scale(0.98);
      }

      .van-icon {
        font-size: 16px;
      }
    }
  }

  // 加载提示样式覆盖
  :deep(.van-loading) {
    color: #fff;
  }
  :deep(.van-toast) {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 20px;
  }
</style>
