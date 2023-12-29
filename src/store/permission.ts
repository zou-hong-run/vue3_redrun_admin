import { getPermissionMenus } from '@/api/permissionMenu';
import { genDynamicRouter } from '@/utils/genRouter';
import { defineStore } from 'pinia';

export const usePermissionsStore = defineStore('permissions', {
  state: () => {
    return {
      routes: [],
      addRoute: [],
      defaultRoutes: [],
    };
  },
  actions: {
    async GenerateRoutes() {
      let res = await getPermissionMenus();
      if (res.code === 200) {
        // console.log(res.data.menus);
        let menus = res.data.menus;
        genDynamicRouter(menus);
      }
    },
  },
});
