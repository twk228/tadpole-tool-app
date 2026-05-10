<template>
  <div class="tooltip-container">
    <!-- 触发元素 -->
    <div
      class="tooltip-trigger"
      :class="{ unselectable: disableSelection }"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @touchstart="showTooltip"
      @touchend="hideTooltip"
      @touchcancel="hideTooltip">
      <div
        class="tool-tip-text"
        ref="tooltipRef"
        @click="handleClick(text, $event)"
        >{{ text }}</div
      >
    </div>

    <!-- Tooltip 提示框 -->
    <div
      v-show="isVisible"
      class="tooltip-content"
      :class="{
        'tooltip-bottom': position === 'bottom',
        unselectable: disableSelection,
      }">
      <div class="tooltip-text">{{ text }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // 引入公共方法
  import { copyToClipboard } from '@/utils';
  import { ref } from 'vue';

  const props = defineProps({
    // 提示文本
    text: {
      type: String,
      required: true,
    },
    // 提示位置 (top/bottom)
    position: {
      type: String,
      default: 'top',
    },
    // 新增禁止选中选项
    disableSelection: {
      type: Boolean,
      default: true,
    },
  });

  const isVisible = ref(false);

  const tooltipRef: any = ref(null);
  // 显示 Tooltip
  const showTooltip = () => {
    let el = tooltipRef.value as HTMLElement;
    if (!el) {
      isVisible.value = false;
    } else {
      isVisible.value = el.clientWidth < el.scrollWidth;
    }
  };

  // 隐藏 Tooltip
  const hideTooltip = () => {
    isVisible.value = false;
  };

  const lastTapTime = ref(0);
  const handleClick = (text: string, event: any) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.value;
    lastTapTime.value = currentTime;
    // 如果两次点击在300ms内，则认为是双击
    if (tapLength < 300 && tapLength > 0) {
      // 阻止默认行为以避免可能的页面缩放
      event.preventDefault();
      // 触发复制
      copyToClipboard(text);
    }
  };
</script>

<style lang="less" scoped>
  .tooltip-container {
    position: relative;
    width: 100%;
    .tool-tip-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      line-height: 20px;
    }
  }

  /* 文字不可选中样式 */
  .unselectable {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /* 防止触摸高亮效果 */
    -webkit-tap-highlight-color: transparent;
    /* 防止长按弹出菜单 */
    -webkit-touch-callout: none;
  }

  .tooltip-content {
    // max-width: calc(375px * 0.8);
    width: calc(375px * 0.8);
    position: absolute;
    z-index: 100;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 15px;
    pointer-events: none;

    color: white;
    font-size: 14px;
    display: flex;
    justify-content: center;

    .tooltip-text {
      width: fit-content;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 6px 12px;
      text-align: left;
    }

    /* 添加小箭头 */
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    }
  }

  .tooltip-bottom {
    top: 100%;
    bottom: auto;
    margin-top: 10px;
    margin-bottom: 0;

    &::after {
      top: auto;
      bottom: 100%;
      border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
    }
  }
</style>
