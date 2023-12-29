import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const constRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页面',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'not_find',
    meta: {
      title: '未知页面',
    },
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404页面',
    },
    component: () => import('@/views/error/404.vue'),
  },
  {
    path: '/401',
    name: '401',
    meta: {
      title: '401页面',
    },
    component: () => import('@/views/error/401.vue'),
  },
];

export { constRoutes };
