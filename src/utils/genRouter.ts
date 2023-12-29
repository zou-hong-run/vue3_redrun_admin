import { MenuType } from '@/api/permissionMenu';
import { isUrl, uniqueSlash } from './common';

export interface GenRouteType {
  path: string;
  name: string;
  meta: any;
  children: GenRouteType[] | [];
  component: string;
  redirect: {
    name: string;
  };
}

export const filterRoute = (
  routes: MenuType[],
  parentRoute: MenuType | null = null,
  ancestorPath: string[] = [],
): GenRouteType[] => {
  return (
    routes
      // 排除菜单类型为B（按钮级别的）, 并且和父路由匹配的
      .filter(
        (item) => item.menu_type !== 'B' && item.parent_id == parentRoute?.id,
      )
      .map((item) => {
        // lg:  系统管理，  sys   null
        // lg:  用户管理，  user  system/user/index
        const { menu_name, path, component } = item;
        let fullPath = '';
        // 不能直接修改ancestorPath,需要拷贝一份
        const parentPath = [...ancestorPath].pop() || '';
        // 菜单为完整路径 http://xxx.com
        if (isUrl(path)) {
          fullPath = path;
        } else {
          fullPath = path.startsWith('/') ? path : `/${path}`;
          // 如果用户自己拼接了父级路径，就不做处理，没有拼接，就自己拼接一下
          fullPath = path.startsWith(parentPath)
            ? fullPath
            : parentPath + fullPath;
          // 处理多个斜杠 "/a/b//c//c//d" ===> '/a/b/c/d'
          fullPath = [...new Set(uniqueSlash(fullPath).split('/'))].join('/');
        }
        // 防御性编程
        let realRoutePath = path;
        if (parentRoute) {
          if (fullPath.startsWith(parentRoute.path)) {
            realRoutePath = fullPath.split(parentRoute.path)[1];
          } else if (!isUrl(parentRoute.path) && !isUrl(path)) {
            realRoutePath = path;
          }
        }
        // 防止有人在路径中多加了斜杠
        realRoutePath = realRoutePath.startsWith('/')
          ? realRoutePath.slice(1)
          : realRoutePath;
        // 去除http(s)://
        // realRoutePath = realRoutePath.replace(/http(s)?:\/\//, '');
        const route: Partial<GenRouteType> = {
          path: fullPath,
          name: realRoutePath,
          meta: {
            title: menu_name,
          },
        };
        if (item.menu_type === 'C') {
          // 目录
          const children = filterRoute(
            routes,
            item,
            ancestorPath.concat(fullPath),
          );
          if (children.length) {
            route.component = 'Layout';
            route.children = children;
            route.redirect = { name: children[0].name };
          } else {
            // 目录没有组件
            route.component = 'Layout';
          }
          return route;
        } else if (item.menu_type === 'M') {
          // 页面
          const children = filterRoute(
            routes,
            item,
            ancestorPath.concat(fullPath),
          );
          if (children.length) {
            route.component = 'ParentView';
            route.children = children;
            route.redirect = { name: children[0].name };
          } else {
            // 目录没有组件
            route.component = component;
          }
          return route;
        }
        return undefined;
      })
      .filter((item): item is GenRouteType => !!item)
  );
};

export const genDynamicRouter = (menus: MenuType[]) => {
  const routers = filterRoute(menus);
  return routers;
};
