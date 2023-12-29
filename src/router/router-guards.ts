import { Router } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getAccessToken } from '@/utils/auth';
import { setTitle } from '@/utils/setTitle';
import { useUserStore } from '@/store/user';
import { usePermissionsStore } from '@/store/permission';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/404', '/401'];

export const createRouterGuards = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore();
    const permissionsStore = usePermissionsStore();
    let access_token = getAccessToken();
    // console.log(to, '===', from);
    NProgress.start();
    if (access_token) {
      // 设置网页标题
      setTitle(to.meta.title as string);
      if (to.path === '/login') {
        NProgress.done();
        return '/';
      } else {
        // 没有角色信息
        if (userStore.roles.length === 0) {
          try {
            await userStore.GetInfo();
            let accessRoutes = await permissionsStore.GenerateRoutes();
            console.log(accessRoutes);
            // accessRoutes.forEach((route) => {
            //   // if(!isHttp())
            //   router.addRoute(route);
            // });
            // return {
            //   replace: true,
            //   ...to,
            // };
            return true;
          } catch (error) {
            userStore.LogOut();
          }
        } else {
          return true;
        }
      }
      console.log('comming');
    } else {
      // 在免登录白名单中，直接放行
      if (whiteList.includes(to.path)) {
        return true;
      } else {
        NProgress.done();
        return `/login?redirect=${to.fullPath}`;
      }
    }
  });
  router.afterEach(async () => {
    NProgress.done();
  });
  router.onError((error) => {
    NProgress.done();
    console.log('路由错误', error);
  });
};
