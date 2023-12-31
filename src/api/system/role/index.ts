import request, { Response } from '@/utils/request';
import { RoleListResultType } from './types';

export const getRoleList = () => {
  return request<any, Response<RoleListResultType>>({
    url: '/role/list',
    method: 'get',
  });
};
