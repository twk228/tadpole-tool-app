<template>
  <div class="page-container">
    <!-- 头部区域 -->
    <div class="header">
      <div class="logo-area">
        <span class="logo-icon">🐸</span>
        <h1 class="title">蝌蚪智汇H5平台</h1>
      </div>
      <p class="desc">小程序无法完成的功能，在这里一站汇聚</p>
      <div class="header-decoration"></div>
    </div>

    <!-- 功能列表 -->
    <div class="list-container">
      <div
        class="list-item"
        v-for="(item, index) in navList"
        :key="index"
        @click="routerGo(item)"
        :style="{ animationDelay: `${index * 0.05}s` }">
        <div class="item-left">
          <span class="item-name">{{ item.name }}</span>
        </div>
        <van-icon name="arrow" class="arrow-icon" />
      </div>
    </div>
    <van-back-top right="15vw" bottom="10vh" />
  </div>
</template>

<script lang="ts" setup name="homeIndex">
  import { ref, onMounted, onActivated } from 'vue';
  import { useRouter } from 'vue-router';
  import type { navItemType } from './types';

  const router = useRouter();

  const navList = ref<navItemType[]>([
    {
      name: '故事大全',
      path: '/story-list/index',
    },
  ]);

  const routerGo = (item: navItemType) => {
    router.push({ path: item.path });
  };

  onMounted(() => {
    console.log('首页onMounted');
  });

  onActivated(() => {
    console.log('首页激活onActivated');
    const layoutEl = document.querySelector('.layout') as HTMLElement;
    if (layoutEl) layoutEl.scrollTop = 0;
  });
</script>

<style lang="less" scoped>
  .page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f0fe 0%, #d4e4fc 100%);
    padding: 30px 20px 40px;
    box-sizing: border-box;
  }

  /* 头部 */
  .header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
  }

  .logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .logo-icon {
    font-size: 36px;
    animation: bounce 2s infinite;
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #2b5fd9, #6b3fa0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: 1px;
  }

  .desc {
    font-size: 15px;
    color: #5a6d8c;
    margin: 12px 0 0;
    letter-spacing: 0.5px;
  }

  .header-decoration {
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #2b5fd9, #6b3fa0);
    border-radius: 2px;
    margin: 20px auto 0;
    opacity: 0.7;
  }

  /* 功能卡片 */
  .list-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 18px 20px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s ease both;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      background: rgba(255, 255, 255, 1);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .item-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .item-name {
    font-size: 17px;
    font-weight: 500;
    color: #1e293b;
  }

  .arrow-icon {
    color: #94a3b8;
    font-size: 18px;
    transition: transform 0.3s ease;

    .list-item:hover & {
      transform: translateX(4px);
      color: #2b5fd9;
    }
  }

  /* 动画关键帧 */
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
