<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import debug from '@/utils/debug';

  onMounted(() => {
    // 因为debug是存入localStorage中的，刷新页面会从localStorage取出，根据debug控制是否隐藏
    debug.config('1');
  });
  // const queryToObject = () => {
  //   const res: any = {};
  //   if (location.hash.indexOf('?') == -1) return;
  //   const search = location.hash.split('?')[1]; // #后面的参数 返回类似于 a=10&b=20&c=30
  //   const paramArr = search.split('&');
  //   paramArr.forEach((item) => {
  //     const itemArr = item.split('=');
  //     const key = itemArr[0];
  //     const value = itemArr[1];
  //     res[key] = value;
  //   });
  //   return res;
  // };
</script>

<style>
  #app {
    font-family: Helvetica, Arial, sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    padding: 0;
    margin: 0;
  }

  .df {
    display: flex;
  }

  .df-aic {
    align-items: center;
  }

  .df-jcc {
    justify-content: center;
  }

  .df-jcsb {
    justify-content: space-between;
  }
</style>
