import request, { Response } from '@/utils/request';
import { PostListResultType } from './types';

export const getPostList = () => {
  return request<any, Response<PostListResultType>>({
    url: '/post/list',
    method: 'get',
  });
};
