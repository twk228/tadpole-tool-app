<template>
  <div class="page-container">
    <div
      id="3DEarth"
      ref="ChartDataChina"
      style="width: 100vw; height: 100vh"></div>
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
          <van-button class="btn" round type="primary" @click="goDetail"
            >进入查看家园</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup name="channelLeanIndex">
  import { ref, onMounted } from 'vue';
  import { useToast } from '@/hooks';
  import * as echarts from 'echarts';
  import chinaJson from '@/utils/china.json';

  const router = useRouter();
  const { startLoading, stopLoading, showToast } = useToast();

  const isShow = ref(false);
  const selectedData = ref<any>({});

  // 关闭方法
  const onClose = () => {
    isShow.value = false;
  };

  // 去详情页面查看家园
  const goDetail = () => {
    isShow.value = false;
    router.push({
      path: '/smartCity/detail',
      query: {
        homeName: selectedData.value.name,
      },
    });
  };

  const ChartDataChina = ref();
  const state = reactive<any>({
    echartObj: null,
    dataList: [
      { name: '昌平区', value: 2 },
      { name: '东城区', value: 0 },
      { name: '房山区', value: 0 },
      { name: '海淀区', value: 0 },
      { name: '怀柔区', value: 0 },
      { name: '密云县', value: 0 },
      { name: '平谷区', value: 0 },
      { name: '石景山区', value: 0 },
      { name: '通州区', value: 0 },
      { name: '西城区', value: 0 },
      { name: '延庆县', value: 0 },
      { name: '朝阳区', value: 0 },
      { name: '丰台区', value: 0 },
      { name: '怀荣区', value: 0 },
      { name: '门头沟区', value: 0 },
      { name: '顺义区', value: 0 },
      { name: '大兴区', value: 0 },
    ],
  });
  const initEchart = () => {
    let el: HTMLElement = document.getElementById('3DEarth') as HTMLElement;
    el.style.height = `${ChartDataChina.value.offsetHeight}px`;
    var myChart = echarts.init(el);
    echarts.registerMap('北京市', chinaJson as any);
    var option = {
      tooltip: {
        formatter: function (params: any) {
          return (
            params.seriesName + '<br />' + params.name + '：' + params.value
          );
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#36E5FE',
        borderWidth: 2,
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      geo: {
        map: '北京市',
        roam: true,
        zoom: 2,
        label: {
          normal: {
            color: 'white',
            show: true,
            fontSize: 12,
          },
          emphasis: {
            color: '#FFD700',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        itemStyle: {
          normal: {
            areaColor: '#112B9B',
            borderWidth: 2,
            borderColor: '#36E5FE',
            shadowBlur: 10,
            shadowColor: '#3484F5',
            shadowOffsetX: -3,
            shadowOffsetY: 4,
          },
          emphasis: {
            areaColor: '#112B9B', // 鼠标悬停时颜色变化
            borderColor: '#FFD700',
            borderWidth: 4,
            shadowBlur: 15,
            shadowColor: '#00FFFF',
          },
        },
      },
      series: [
        {
          name: '家属院数量',
          type: 'map',
          geoIndex: 0,
          data: state.dataList,
          selectedMode: false, // 核心：关闭选中
          silent: false, // 允许点击事件
          aspectScale: 0.75,
          center: [104.2, 35.9],
          zoom: 1.3,
          // 添加鼠标悬停时的光晕效果
          hoverAnimation: true,
          // 点击跳转逻辑（可恢复）
          // click: () => { ... }
        },
        {
          name: '家属院位置',
          type: 'scatter', // 散点图，用来放自定义图标
          coordinateSystem: 'geo', // 绑定到上面的 geo 坐标系
          symbol:
            'path://M52.02139 936.001711h56.566417V287.486631l296.467166-54.376043L451.764706 252.385882l39.591016 380.084706 15.33262 16.427808V54.321283L803.155508 0 928.171123 51.419037v884.582674h43.807487V1024h-240.941177V102.071444l-152.450053 27.927273V1024H333.046417V335.236791l-152.395294 27.927273V1024H52.02139v-87.998289z m614.619038-657.112299v67.901604l17.249198-1.971337 17.413476-2.026096V274.125348l-17.413476 2.299893-17.249198 2.245133z m0-119.649198V227.251337l17.249198-2.518931 17.413476-2.464171V153.490481l-17.413476 2.792728-17.249198 2.737967z m0 239.188877v67.901604l17.249198-1.478502 17.413476-1.533263V394.650695l-17.413476 1.807059-17.249198 1.752299z m0 119.539679v67.846845l17.249198-0.985668 17.413476-1.040428v-68.449198l-17.413476 1.314224-17.249198 1.314225z m0 119.48492v67.901604c5.475936 0 11.499465-0.383316 17.249198-0.492834s11.554225-0.328556 17.413476-0.492834v-68.722995l-17.413476 0.82139-17.249198 0.766631z m-62.151872-350.459893V353.745455l16.701604-1.916578 16.865883-1.971337V282.44877l-16.865883 2.190374-16.701604 2.245134z m0-117.896899V236.012834l16.701604-2.409412 16.865883-2.409411V163.620963l-16.865883 2.683208-16.701604 2.683209z m0 235.465241V471.478075l16.701604-1.423743c5.475936-0.492834 11.225668-1.040428 16.865883-1.478503V401.167059l-16.865883 1.69754-16.701604 1.752299z m0 117.73262v66.915936l16.701604-0.985668 16.865883-0.985669V519.830588l-16.865883 1.204706-16.701604 1.259465z m0 117.677861v66.970696c5.475936 0 10.951872-0.328556 16.701604-0.492835l16.865883-0.492834V638.494118l-16.865883 0.82139-16.701604 0.711872z m62.151872 118.444492v67.846845h34.662674v-68.668235l-17.413476 0.273797h-17.249198z m-62.151872 1.040428v66.806417H637.946524V758.417112l-16.865882 0.273797h-16.701605z m-398.429091-246.417112v66.970695l16.427808-1.69754 16.811123-1.69754V508.659679l-16.811123 2.026096-16.427808 2.026097z m62.042353-7.502032v67.792085l17.303957-1.752299 17.468236-1.7523V501.048128c-5.914011 0.711872-11.718503 1.368984-17.468236 2.135615l-17.303957 2.080856z m0-119.922995v68.23016l17.303957-2.354652 17.413476-2.409412V379.865668l-17.413476 2.737968-17.303957 2.683209z m0 239.736471v68.175401l17.303957-1.204706 17.468236-1.149947v-69.161069l-17.468236 1.533262-17.303957 1.478503z m0 119.868235v67.956364l17.303957-0.602353 17.468236-0.602353v-68.942032l-17.468236 0.930909-17.303957 0.930909z m0 119.813476v68.065882h34.717433v-68.996791h-17.413476l-17.303957 0.328556zM206.059465 394.924492v67.025455l16.427808-2.245134 16.811123-2.299893V389.722353l-16.811123 2.628449-16.427808 2.57369z m0 235.465241v66.970695l16.427808-1.149947c5.475936-0.383316 10.951872-0.711872 16.811123-1.149946v-67.573048c-5.475936 0.547594-10.951872 1.040428-16.811123 1.478502l-16.427808 1.478503z m0 117.73262v66.970695l16.427808-0.547593 16.811123-0.602353V746.370053l-16.811123 0.93091-16.427808 0.876149z m0 117.73262v66.861177h33.457968v-67.40877l-16.811123 0.328556h-16.427807z',
          symbolSize: [32, 32], // 图标大小，宽高
          symbolOffset: [0, -12], // 图标偏移，微调位置，避免被地图文字挡住
          zlevel: 2, // 层级，确保图标在地图上方
          data: [
            // 格式：[经度, 纬度, 附加数据]
            {
              name: '昌平区家属院1',
              value: [116.23, 40.22, 1],
              content:
                '建立于2020年5月1日，总共有3个单元，总住户数为156户，建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户建立于2020年5月1日，总共有3个单元，总住户数为156户',
            },
            {
              name: '昌平区家属院2',
              value: [116.28, 40.25, 1],
              content: '建立于2021年5月1日，总共有2个单元，总住户数为100户',
            },
            // 其他区域的点位...
          ],
          tooltip: {
            formatter: '{b}', // 鼠标悬浮显示名称
          },
          silent: false,
          selectedMode: 'single',
          hoverLayer: true, // ✅ 手机端点击必开
          cursor: 'pointer', // ✅ 手指点击样式
          large: false, // ✅ 关闭大数据优化，保证点击灵敏
          itemStyle: {
            color: '#36E5FE', // 默认青绿色（和你原图一致）
          },
          select: {
            itemStyle: { color: 'red' },
            symbolSize: 40,
          },
        },
      ],
    };
    myChart.setOption(option);
    let lastClickTime = 0; // 记录上次点击时间
    let clickTimer: any = null;
    // 单击事件
    myChart.on('click', function (params: any) {
      if (params.seriesName === '家属院位置') {
        const now = Date.now();
        // 300ms 内算双击，不触发单击
        if (now - lastClickTime < 300) {
          clearTimeout(clickTimer);
          console.log('【双击图标】', params.name, params.data);
          isShow.value = true;
        } else {
          clickTimer = setTimeout(() => {
            console.log('【单击图标】', params.name, params.data);
            selectedData.value = params.data;
            isShow.value = true;
          }, 300);
        }
        lastClickTime = now;
      }
      // router.push({
      //   path: `${navActivePath.value}/province`,
      //   query: { provinceName: params.data.ename, province: params.name },
      // });
    });
    // 添加窗口大小改变监听事件，当窗口大小改变时，图表会重新绘制，自适应窗口大小
    window.addEventListener('resize', function () {
      myChart.resize();
    });
  };

  onMounted(() => {
    console.log('首页onMounted');
    initEchart();
  });
  onActivated(() => {
    console.log('首页激活onActivated');
    const layoutEl = document.getElementsByClassName('layout')[0];
    layoutEl.scrollTop = 0;
  });
</script>

<style lang="less" scoped>
  .page-container {
    position: relative;
    overflow: hidden;
    background: #0a1435; /* 深蓝科技背景 */
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
        // width: 100%;
        // padding: 10px;
        // position: absolute;
        // bottom: 0;
        // height: 60px;
        // // box-shadow: 0 4px 15px rgba(54, 229, 254, 0.3);
        // box-shadow: 2px 2px -20px 2px black;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // 1. 必须加宽度，不然按钮超出容器，阴影被盖住
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 60px;
        // 2. 正确的阴影写法，不使用rem单位，直接写px
        box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.3);
        // 3. 给背景色，避免透明导致阴影被内容挡住
        background: #fff;
        // 4. 给内边距，避免按钮贴边
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
