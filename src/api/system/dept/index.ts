import request, { Response } from '@/utils/request';
import { DeptListResultType } from './types';

export const getDeptList = () => {
  return request<any, Response<DeptListResultType>>({
    url: '/dept/list',
    method: 'get',
  });
};
