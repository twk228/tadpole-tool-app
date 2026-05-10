import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 示例使用
export const demoRoutes: Array<RouteRecordRaw> = [
  // smart-city
  {
    path: '/smartCity/index',
    name: 'smartCityIndex',
    meta: {
      title: '智慧城市平台',
    },
    component: () => import('@/pages/smartCity/index.vue'),
  },
  {
    path: '/smartCity/detail',
    name: 'smartCityDetail',
    meta: {
      title: '智慧城市平台',
    },
    component: () => import('@/pages/smartCity/detail.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '智慧城市平台',
    },
    component: () => import('@/pages/404.vue'),
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/smartCity/index',
    children: demoRoutes,
  },
  // 替代vue2中的'*'通配符路径
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

let historyRoutes: string[] = [];

router.afterEach((to, from) => {
  // 判断导航类型
  if (historyRoutes.includes(to.path)) {
    historyRoutes = historyRoutes.filter((item) => item !== to.path);
    to.meta.transition = 'slide-right';
  } else {
    historyRoutes.push(from.path);
    to.meta.transition = 'slide-left';
  }
});
export default router;
