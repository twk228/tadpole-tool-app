<template>
  <div class="list-card2">
    <div class="left-section">
      <div class="count-box">
        <div class="count" :class="{ 'm-t-10': item.countRatio }">
          <span class="num">{{ item.count }}</span>
        </div>
        <div class="count">亿元</div>
        <div class="countRatio" v-if="item.countRatio"
          >{{ item.countRatio }}%</div
        >
      </div>
      <div class="title">{{ item.title }}</div>
      <!-- 应1.2.1需求：隐藏掉“环比” -->
      <!-- <div class="linkRelativeRatio" v-if="item.linkCount == 0">
        环比 <span class="text-color-green">持平</span>
        /
        <span class="text-color-green">0%</span>
      </div>
      <div class="linkRelativeRatio" v-if="item.linkCount > 0">
        环比 <span class="text-color-green">↑+{{ item.linkCount }}</span
        >万元
        {{ item.linkRatio ? '/' : '' }}
        <span class="text-color-green" v-if="item.linkRatio === 0"
          >{{ item.linkRatio }}%</span
        >
        <span class="text-color-green" v-if="item.linkRatio > 0"
          >↑+{{ item.linkRatio }}%</span
        >
        <span class="text-color-red" v-if="item.linkRatio < 0"
          >↓{{ item.linkRatio }}%</span
        >
      </div>
      <div class="linkRelativeRatio" v-if="item.linkCount < 0">
        环比 <span class="text-color-red">↓{{ item.linkCount }}</span
        >万元
        {{ item.linkRatio ? '/' : '' }}
        <span class="text-color-green" v-if="item.linkRatio === 0"
          >{{ item.linkRatio }}%</span
        >
        <span class="text-color-green" v-if="item.linkRatio > 0"
          >↑+{{ item.linkRatio }}%</span
        >
        <span class="text-color-red" v-if="item.linkRatio < 0"
          >↓{{ item.linkRatio }}%</span
        >
      </div> -->
    </div>
    <div class="right-section">
      <div :id="'test' + index" style="width: 100%; height: 100%"></div>
      <div
        class="empty-section"
        v-if="
          item.extendValue1 === 0 &&
          item.extendValue2 === 0 &&
          item.extendValue3 === 0
        ">
        <img src="@/assets/img/empty.png" alt="empty" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts';
  import { BarChartConfigTransverse } from '@/common/myInstall';
  import { ref, onMounted, watch } from 'vue';
  // const router = useRouter();

  const props = defineProps({
    item: {
      type: Object,
      default: {
        title: '',
        // 数量
        count: '',
        // 数量占比
        countRatio: '',
        // 环比数量
        linkCount: '',
        // 环比占比
        linkRatio: '',
        // 扩展字段1 分销或公司
        extendValue1: 0,
        // 扩展字段2 直销或经销商
        extendValue2: 0,
        // 扩展字段3 专底或商融通
        extendValue3: 0,
      },
    },
    index: { type: [Number, String], default: 0 },
  });

  // 监听数据变化
  watch(
    () => props.item,
    () => {
      setChartOption();
    },
    { deep: true }
  );

  // 图表实例
  const myCharts = ref<any>({});

  // 设置 初始化图表
  const setChartOption = () => {
    let echartData = [];
    if (props.item.title === '经销商投入') {
      echartData = [
        { name: '公司', value: props.item.extendValue1 },
        { name: '经销商', value: props.item.extendValue2 },
        { name: '商融通', value: props.item.extendValue3 },
      ];
    } else {
      echartData = [
        { name: '分销', value: props.item.extendValue1 },
        { name: '直销', value: props.item.extendValue2 },
        { name: '专底', value: props.item.extendValue3 },
      ];
    }
    let chartDom = document.getElementById('test' + props.index);
    // console.log("myCharts.value['myChart'+props.index]", myCharts.value['myChart'+props.index]);
    if (myCharts.value['myChart' + props.index]) {
      // console.log('移除 `_echarts_instance_` 属性')
      // 移除 `_echarts_instance_` 属性
      chartDom?.removeAttribute('_echarts_instance_');
    }
    let myChart = echarts.init(chartDom);
    myCharts.value['myChart' + props.index] = 'myChart' + props.index;
    myChart.clear();
    myChart.setOption(BarChartConfigTransverse(echartData), true);
    setTimeout(() => {
      myChart.resize();
    }, 10);
  };

  onMounted(() => {
    setChartOption();
    window.addEventListener('resize', () => {
      if (myCharts.value['myChart' + props.index]) {
        myCharts.value['myChart' + props.index].resize();
      }
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
      if (myCharts.value['myChart' + props.index]) {
        myCharts.value['myChart' + props.index].resize();
      }
    });
  });
</script>

<style lang="less" scoped>
  .list-card2 {
    padding: @padding-md @padding-lg;
    border-radius: 4px;
    background: #fff;
    display: flex;
    gap: @padding-xs;

    .left-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40%;
      .count-box {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 8px solid #2b72fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        letter-spacing: -0.3px;
        margin-bottom: @margin-xs;
        .count {
          color: @gray;
          font-size: 12px;
          .num {
            color: #1d2129;
            font-size: 20px;
          }
        }
        .countRatio {
          color: @gray;
          font-size: 12px;
        }
      }
      .title {
        color: #1d2129;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.3px;
        margin-bottom: @margin-base;
      }
      .linkRelativeRatio {
        color: @gray;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: -0.3px;
        white-space: nowrap;
      }
    }
    .right-section {
      flex: 1;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 100%;
      }
      .empty-section {
        position: absolute;
        top: -7px;
        right: -10px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 118px;
          height: 118px;
        }
      }
    }
  }
</style>
