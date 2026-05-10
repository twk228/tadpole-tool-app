<template>
  <!-- <van-overlay :show="modelShow" z-index="3" class-name="model-frame" @click="closeFun()"> -->
  <van-overlay :show="modelShow" z-index="13" class-name="model-frame">
    <div class="model-inner" @click.stop>
      <div class="model-frame-inner">
        <div class="inner-head">
          <!-- 筛选<text class="close" @click="closeFun()"></text> -->
          筛选<slot name="tool"></slot>
        </div>
        <div class="inner-body">
          <slot name="inner"></slot>
        </div>
        <div class="inner-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup lang="ts">
const props = defineProps({
  modelShow: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['closeModel']);

// 关闭
const closeFun = () => {
  emit('closeModel', false);
};

onMounted(() => { });
</script>

<style lang="less" scoped>
.model-frame {
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-frame-inner {
  width: 80vw;
  background: #fff;
  border-radius: 8px;

  .inner-head {
    height: 96px;
    position: relative;
    font-weight: 500;
    font-size: 32px;
    color: #323233;
    display: flex;
    align-items: center;
    justify-content: center;

    .close {
      width: 96px;
      height: 96px;
      position: absolute;
      top: 0;
      right: 0;
      background: url('@/assets/icons/icon-close.png') no-repeat center / 44px auto;
    }
  }

  .inner-body {
    min-height: 200px;
    overflow-y: auto;
    padding-bottom: 32px;
  }

  .inner-footer {}
}
</style>
