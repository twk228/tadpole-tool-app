# 项目说明文档

本项目是基于 `Vue 3` 、 `TypeScript` 结合 `Vite` 进行搭建. 模版引擎使用了 Vue 3 `<script setup>` SFCs, 详情请查阅 [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) 。基本功能基于 `vue3-vant-mobile` 进行调整，可以参考 [vue3-vant-mobile](https://github.com/zeorcpt/vue3-vant-mobile)。

## 项目说明

### 目录结构

```base
.
├── .gitignore
├── .vscode
│   └── extensions.json
├── README.md
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.vue
│   ├── assets
│   │   └── vue.svg
│   ├── components
│   │   └── HelloWorld.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 安装依赖

```bash
yarn install
```

### 启动本地开发环境（自带热启动）

```bash
yarn dev
```

### 构建生产环境 (自带压缩)

```bash
yarn build
```

### 代码格式检查以及自动修复

```bash
yarn lint
```

## 启动说明

### IDE 插件支持

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- node 版本：建议使用大于 16.0.0 版本

**_注意_**：我们在安装时项目时，如果使用 npm 就一直使用 npm；如果使用 yarn 就一直使用 yarn；或者其他的安装，但是要保持整体的一致性，不然会有包的版本错误；（也包括后续的安装其他依赖）。

## 配置说明

### 增加 Network 地址

默认项目启动后，Network 地址为空，无法使用，可通过配置进行增加。

```ts
# vite.config.ts
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true // 解决  Network: use --host to expose
  }
})
```

## 设置@别名

1、在项目中安装依赖包

安装 `@types/node` 这个配置地址时会用到

```ts
# npm
npm install @types/node -S

# yarn
yarn add @types/node -S
```

2、 修改 `vite.config.ts` 配置

```ts
# vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"; // 依赖插件 @types/node

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //这里进行配置别名
  resolve: {
    alias: {
      '@': path.resolve('src')
    }
  }
})
```

3、修改 `tsconfig.json` 中的信息

在 `compilerOptions` 字段中添加： `"baseUrl": "./","paths": {"@/": ["src/"]}`

```ts
# tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": {"@/*": ["src/*"]} // 路径映射，相对于baseUrl
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 路由相关配置

1、安装插件

```ts
npm i vue-router@next -S
or
yarn add vuex@next -S
```

2、新增配置文件

在 `src` 下新建 `router` 目录，新建 `index.ts` 文件。

```ts
# router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'app',
    meta: {
      title: 'app'
    },
    component: () => import('../App.vue')
  },
  // 替代vue2中的'*'通配符路径
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHashHistory(), // vueRouter@3版本的mode改成了history，hash模式配置 createWebHashHistory，history模式配置 createWebHistory
  routes
});
export default router;
```

3、引入使用

在 `main.ts` 引入。

```ts
# main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

createApp(App)
.use(router)
.mount('#app')
```

在 `App.vue` 添加 `router-view`。

```ts
# App.vue
<script setup lang="ts">
</script>
​
<template>
  <router-view />
</template>
​
<style>
</style>
```

## 项目资源
项目地址： https://twk-smart-city.netlify.app
