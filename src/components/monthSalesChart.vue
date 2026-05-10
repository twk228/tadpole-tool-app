<template>
    <div class="month-sales-chart">
        <div id="month-sales-chart" style="width:100%;height:100%;"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { BarChartConfigVertical } from '@/common/myInstall';
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
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
        { name: '目标', type: 'bar', fieldName: 'monthlyTarget', color: '#2B72FB', showBackground: true },
        { name: '销量', type: 'bar', fieldName: 'saleNum', color: '#FE6A35', showBackground: true },
        { name: '完成率', type: 'line', fieldName: 'completionRate', color: '#37CBE5', showBackground: true }
    ]
    let chartData = props.data.map((item: any)=>{
        return {
            ...item,
            completionRate: Math.round(item.completionRate * 100),
            name: item.month + '月'
        }
    })
    let chartDom = document.getElementById('month-sales-chart');
    if (myChartInstance.value) {
        // 移除 `_echarts_instance_` 属性
        chartDom?.removeAttribute('_echarts_instance_');
    }
    let myChart = echarts.init(chartDom);
    myChartInstance.value = myChart;
    myChart.clear()
    myChart.setOption(BarChartConfigVertical(chartData, seriesConfig), true);
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
.month-sales-chart {
    height: 100%;
}
</style>