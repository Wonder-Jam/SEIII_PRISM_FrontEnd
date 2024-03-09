// @ts-ignore
/* eslint-disable */

import { useDelete, useGet } from "../fetcher";
type NewListItem = {
  key?: number;
  title: string;
  desc: string;
  callNo?: number;
};

type NewList = {
  data?: NewListItem[];
  /** 列表的内容总数 */
  total?: number;
  success?: boolean;
};

type Pagination = {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
};
export async function removeNew({ key }: { key: (number | undefined)[]  }) {
    const deletePromise = key.map((id) => {
       return useDelete(`api/news/${id}`)
    })
    const deleteResults = await Promise.all(deletePromise)
    return deleteResults
  // TODO: 请求路径
  // return request<Record<string, any>>('/api/news/{id}', {
  //     method: 'DELETE',
  //     ...(options || {}),
  // });
}

export async function useGetNewsList(
  params: Pagination,
  options?: { [key: string]: any }
) {
  return useGet<NewListItem[], Pagination>("/api/news/list", params, options);
  // return request<API.NewList>('/api/news/list', {
  //     method: 'GET',
  //     params: {
  //         ...params,
  //     },
  //     ...(options || {}),
  // });
}

export async function useGetNewsDetail(id: number) {
  return useGet<NewListItem>(`/api/news/${id}`);
}

export async function updateNew(options?: { [key: string]: any }) {
  // TODO: 修改请求方式和路径
  // return request<API.NewListItem>('/api/news/{id}', {
  //     method: 'PUT',
  //     ...(options || {}),
  // });
}
