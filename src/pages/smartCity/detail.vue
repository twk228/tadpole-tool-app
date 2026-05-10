<template>
  <div class="detail-container">
    <div class="header">
      <div class="back-section" @click="backFn">
        <van-icon class="icon" name="arrow-left" />返回
      </div>
      <div class="title">{{ homeName }}</div>
    </div>
    <div id="viewer" style="width: 100vw; height: 100vh"></div>
    <!-- 弹出层部分 -->
    <van-popup v-model:show="isShow" round position="bottom" z-index="10000001">
      <div class="popup-container">
        <div class="popup-header">
          <div class="title">{{ selectedData.name }}</div>
          <div class="close" @click="onClose">
            <van-icon name="cross" />
          </div>
        </div>
        <div class="popup-content">{{ selectedData.content }}</div>
        <div class="popup-footer">
          <van-button class="btn" round type="primary" @click="onClose">
            关闭
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup name="smartCityDetail">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useToast } from '@/hooks';
  import { useRouter, useRoute } from 'vue-router';
  // 引入核心
  import { Viewer } from '@photo-sphere-viewer/core';
  import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
  // 必须引入样式
  import '@photo-sphere-viewer/core/index.css';
  import '@photo-sphere-viewer/markers-plugin/index.css';

  const router = useRouter();
  const route = useRoute();

  const isShow = ref(false);
  const homeName = ref<string>('');
  const selectedData = ref<any>({});

  const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';
  const points = [
    {
      id: 'unit1',
      yaw: -1.95,
      pitch: 0,
      tooltip: '1单元',
      content: '这是1单元的详细信息',
    },
    {
      id: 'unit2',
      yaw: 0,
      pitch: -0.03,
      tooltip: '2单元',
      content: '这是2单元的详细信息',
    },
    {
      id: 'unit3',
      yaw: 1.68,
      pitch: -0.05,
      tooltip: '3单元',
      content: '这是3单元的详细信息',
    },
  ];

  // 关闭方法
  const onClose = () => {
    isShow.value = false;
  };

  // 返回方法
  const backFn = () => {
    router.back();
  };

  const viewer = ref<Viewer | null>(null);
  const markersPlugin = ref<any>(null);

  // 只在 onMounted 初始化一次，不在 onActivated 里重复创建
  onMounted(() => {
    if (route.query.homeName) {
      homeName.value = route.query.homeName as string;
    }

    const viewerDom = document.querySelector('#viewer');
    if (!viewerDom) return;

    viewer.value = new Viewer({
      container: viewerDom as HTMLElement,
      panorama: '/1.png',
      plugins: [
        MarkersPlugin.withConfig({
          markers: points.map((pt, i) => ({
            id: pt.id,
            position: pt,
            image: baseUrl + 'pictos/pin-red.png',
            size: { width: 32, height: 32 },
            anchor: 'bottom center',
            tooltip: pt.tooltip,
          })),
        }),
      ],
    });

    markersPlugin.value = viewer.value?.getPlugin(MarkersPlugin);

    // 标记点击事件
    markersPlugin.value?.addEventListener('select-marker', (ev: any) => {
      points.forEach((pt) => {
        if (pt.id === ev.marker.config.id) {
          markersPlugin.value.updateMarker({
            id: ev.marker.config.id,
            image: baseUrl + 'pictos/pin-blue.png',
          });
        } else {
          markersPlugin.value.updateMarker({
            id: pt.id,
            image: baseUrl + 'pictos/pin-red.png',
          });
        }
      });

      selectedData.value = {
        name: ev.marker.config.position.tooltip,
        content: ev.marker.config.position.content,
      };
      isShow.value = true;
    });
  });

  // 销毁实例，防止内存泄漏和重复创建
  onUnmounted(() => {
    if (viewer.value) {
      viewer.value.destroy();
      viewer.value = null;
    }
  });
</script>

<style lang="less" scoped>
  .detail-container {
    position: relative;
    overflow: hidden;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      .back-section {
        color: #fff;
        font-size: 18px;
        margin-top: 5px;
        position: absolute;
        left: 10px;
        .icon {
          margin-right: 4px;
        }
      }
      .title {
        color: #fff;
        font-size: 18px;
      }
    }
    .popup-container {
      height: 70vh;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .popup-header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        .close {
          position: absolute;
          right: 10px;
          top: 16px;
          cursor: pointer;
        }
      }
      .popup-content {
        flex: 1;
        padding: 0 10px;
        font-size: 16px;
        overflow-y: auto;
        color: #323233;
        line-height: 25px;
        padding-bottom: 80px;
      }
      .popup-footer {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 60px;
        box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.3);
        background: #fff;
        padding: 10px;
        box-sizing: border-box;
        .btn {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
