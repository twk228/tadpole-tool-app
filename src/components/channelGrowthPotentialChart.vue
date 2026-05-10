<template>
    <!-- 渠道成长性（近五年销量）图表组件 -->
    <div class="channel-growth-potential-chart">
        <div id="channel-growth-potential-chart" style="width:100%;height:100%;"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { BarChartConfigVertical } from '@/common/myInstall';
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
// 监听数据变化
watch(() => props.data, () => {
    setChartOption();
}, { deep: true })

// 图表实例
const myChartInstance = ref<any>(null);

// 设置 初始化图表
const setChartOption = () => {
    let seriesConfig = [
        { name: '欧航欧马可', type: 'bar', fieldName: 'ohomk', color: 'rgba(43, 114, 251, 0.8)' },
        { name: '奥铃', type: 'bar', fieldName: 'al', color: 'rgba(254, 106, 53, 0.8)' },
        { name: '图雅诺', type: 'bar', fieldName: 'tyn', color: 'rgba(106, 209, 254, 0.8)' },
        { name: '欧曼', type: 'bar', fieldName: 'om', color: 'rgba(106, 129, 254, 0.8)' },
        { name: '欧曼星辉', type: 'bar', fieldName: 'omxh', color: 'rgba(26, 129, 54, 0.8)' },
        { name: '皮卡', type: 'bar', fieldName: 'pk', color: 'rgba(255, 174, 76, 0.8)' },
        { name: '祥菱', type: 'bar', fieldName: 'xl', color: 'rgba(83, 127, 241, 0.8)' },
        { name: '瑞沃', type: 'bar', fieldName: 'rw', color: 'rgba(63, 220, 126, 0.8)' },
        { name: '领航', type: 'bar', fieldName: 'lh', color: 'rgba(140, 99, 218, 0.8)' },
        { name: '时代新能源', type: 'bar', fieldName: 'sdxny', color: 'rgba(43, 183, 220, 0.8)' },
        { name: '时代专底', type: 'bar', fieldName: 'sdzd', color: 'rgba(255, 206, 31, 0.8)' },
    ]
    let chartData = props.data[Object.keys(props.data)[0]].map((item: any)=>{
        return { name: item.year + '年', year: item.year }
    });
    Object.keys(props.data).forEach((key: string)=>{
        let fieldName: string = (seriesConfig.find(i=>i.name === key) as any).fieldName;
        props.data[key].forEach((i: any, index: number)=>{
            if(i.year === chartData[index].year){
                chartData[index][fieldName] = i.sales;
            }
        })
    })
    let chartDom = document.getElementById('channel-growth-potential-chart');
    if (myChartInstance.value) {
        // 移除 `_echarts_instance_` 属性
        chartDom?.removeAttribute('_echarts_instance_');
    }
    let myChart = echarts.init(chartDom);
    myChartInstance.value = myChart;
    myChart.clear()
    myChart.setOption(BarChartConfigVertical(chartData, seriesConfig.filter((i:any)=>!!props.data[i.name]), true), true);
    setTimeout(() => {
        myChart.resize();
    }, 10)
}

onMounted(() => {
    setChartOption();
    window.addEventListener('resize', () => {
        if (myChartInstance.value) {
            myChartInstance.value.resize();
        }
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        if (myChartInstance.value) {
            myChartInstance.value.resize();
        }
    });
});
</script>


<style lang="less" scoped>
.channel-growth-potential-chart {
    height: 100%;
}
</style>