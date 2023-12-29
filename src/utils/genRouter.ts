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
  lastNamePath: string[] = [],
): GenRouteType[] => {
  return (
    routes
      // 排除菜单类型为B（按钮级别的）
      .filter(
        (item) => item.menu_type !== 'B' && item.parent_id == parentRoute?.id,
      )
      .map((item) => {
        // lg:系统管理，system, null
        // lg:用户管理，user,system/user/index
        // lg:name router viewPath
        const { menu_name, path, component } = item;
        let fullPath = '';
        const pathPrefix = lastNamePath.pop() || '';
        if (isUrl(path)) {
          fullPath = path;
        } else {
          fullPath = path.startsWith('/') ? path : `/${path}`;
          fullPath = path.startsWith(pathPrefix)
            ? fullPath
            : pathPrefix + fullPath;
          // "/a/b//c//c//d" ===> '/a/b/c/d'
          fullPath = [...new Set(uniqueSlash(fullPath).split('/'))].join('/');
        }
        let realRoutePath = path;
        if (parentRoute) {
          if (fullPath.startsWith(parentRoute.path)) {
            realRoutePath = fullPath.split(parentRoute.path)[1];
          } else if (!isUrl(parentRoute.path) && !isUrl(path)) {
            realRoutePath = path;
          }
        }
        realRoutePath = realRoutePath.startsWith('/')
          ? realRoutePath.slice(1)
          : realRoutePath;
        realRoutePath = realRoutePath.replace(/http(s)?:\/\//, '');
        const route: Partial<GenRouteType> = {
          path: realRoutePath,
          name: fullPath,
          meta: {
            title: menu_name,
            namePath: lastNamePath.concat(fullPath),
          },
        };
        if (item.menu_type === 'C') {
          // 目录
          const children = filterRoute(
            routes,
            item,
            lastNamePath.concat(fullPath),
          );
          if (children.length) {
            route.component = 'Layout';
            route.children = children;
            route.redirect = { name: children[0].name };
          } else {
            // 目录没有组件
            route.component = 'Layout';
            return route;
          }
        } else if (item.menu_type === 'M') {
          // 页面
          route.component = component;
          return route;
        }
        return undefined;
      })
      .filter((item): item is GenRouteType => !!item)
  );
};

export const genDynamicRouter = (menus: MenuType[]) => {
  const routeList = filterRoute(menus);
  console.log(routeList);
};
