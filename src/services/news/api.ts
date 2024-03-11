// @ts-ignore
/* eslint-disable */

import { Fetcher, useDelete, useGet } from "../fetcher";

export type NewListItem = {
  id: number;
  title: string;
  date: string;
  source: string;
  url?: string;
  category?: string;
  keywords: string;
};

export type NewList = {
  page: NewListItem[];
  count: number;
};

export type ProTablePagination = {
  current?: number;
  pageSize?: number;
};
export type Pagination = {
  size: number;
  current: number;
};

export async function removeNew({ key }: { key: (number | undefined)[] }) {
  const deletePromise = key.map((id) => {
    return useDelete(`/api/news/${id}`);
  });
  const deleteResults = await Promise.all(deletePromise);
  return deleteResults;
}

export async function getNewsList(params: ProTablePagination, sort: any, fliter: any) {
  console.log("getNewsList");
  console.log(sort, fliter);
  const data = await Fetcher<NewList>({
    input: `/api/news/list?${new URLSearchParams(
      JSON.parse(
        JSON.stringify({
          size: params.pageSize,
          current: 0, //TODO
        })
      )
    ).toString()}`,
    init: {},
  });
  // const { data } = useGet<NewList,Pagination>('/api/news/list',{
  //   current:params.current ?? 0,
  //   size:params.pageSize ?? 10
  // }) 不能直接调用hook - 如果在request中使用的话
  return {
    data: data.page,
    success: true,
  };
}

export function useGetNewsDetail(id: number) {
  return useGet<string>(`/api/news/${id}`);
}

export async function updateNew(options?: { [key: string]: any }) {
  // TODO: 修改请求方式和路径
  // return request<API.NewListItem>('/api/news/{id}', {
  //     method: 'PUT',
  //     ...(options || {}),
  // });
}
