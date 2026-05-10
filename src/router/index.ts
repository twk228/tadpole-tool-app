import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 示例使用
export const demoRoutes: Array<RouteRecordRaw> = [
  // 首页
  {
    path: '/home/index',
    name: 'homeIndex',
    meta: {
      title: '蝌蚪智汇H5平台',
    },
    component: () => import('@/pages/home/index.vue'),
  },
  // story-list
  {
    path: '/story-list/index',
    name: 'storyListIndex',
    meta: {
      title: '故事大全',
    },
    component: () => import('@/pages/story-list/index.vue'),
  },
  {
    path: '/story-list/search',
    name: 'storyListSearch',
    meta: {
      title: '搜索故事',
    },
    component: () => import('@/pages/story-list/search.vue'),
  },
  {
    path: '/story-list/detail',
    name: 'storyListDetail',
    meta: {
      title: '故事详情',
    },
    component: () => import('@/pages/story-list/detail.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404 Not Found',
    },
    component: () => import('@/pages/404.vue'),
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home/index',
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
