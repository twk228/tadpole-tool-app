<template>
    <!-- 列表触底加载组件 -->
    <div class="list-load">
        <!-- 哨兵 -->
        <div class="sentinel"></div>
        <div class="van-list__loading" v-if="!finished">
            <div class="van-loading van-loading--circular van-list__loading-icon" aria-live="polite" aria-busy="true">
                <span class="van-loading__spinner van-loading__spinner--circular"><svg class="van-loading__circular"
                        viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20" fill="none"></circle>
                    </svg></span><span class="van-loading__text">加载中...</span>
            </div>
        </div>
        <div class="van-list__finished-text" v-if="finished">{{ finishedText }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps({
    finished: {
        type: Boolean,
        default: false
    },
    finishedText: {
        type: String,
        default: '没有更多了'
    }
});

const emit = defineEmits(['loadMore'])

onMounted(() => {
    // 创建Observer实例
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!props.finished) {
                    // 当哨兵元素进入视口时加载更多内容
                    emit('loadMore');
                }
            }
        });
    }, {
        rootMargin: '0px 0px 0px 0px'
    });

    // 开始观察哨兵元素
    const sentinel: HTMLElement = document.querySelector('.sentinel') as HTMLElement;
    observer.observe(sentinel);
})

</script>

<style lang="less" scoped>

</style>
