<template>
  <div class="layout">
    <!-- <router-view /> -->
    <router-view v-slot="{ Component, route }">
      <transition :name="typeof route.meta.transition === 'string' ? route.meta.transition : 'slide-left'"
        mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.layout {
  position: absolute;
  max-width: 375px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #f8f8f8;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

}

.slide-left-enter-active,
.slide-right-enter-active {
  transition: transform 0.3s;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
