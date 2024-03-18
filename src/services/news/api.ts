// @ts-ignore
/* eslint-disable */

import { Fetcher, encodeUriFromParams, useFetcher } from "../fetcher";

export type NewListItem = {
  id: number;
  title: string;
  date: string;
  source: string;
  url: string;
  category: string;
  keywords: string;
};

export type NewList = {
  page: NewListItem[];
  count: number;
};

export type ProTablePagination = {
  current: number;
  pageSize: number;
  total: number;
};
export type Pagination = {
  size: number;
  current: number;
};
export type SearchParams = {
  source?: string;
  start?: string;
  end?: string;
};
export async function removeNew({ key }: { key: (number | undefined)[] }) {
  const deletePromise = key.map((id) => {
    return Fetcher({
      input: `/api/news/${id}`,
      init: {
        method: "DELETE",
      },
    });
  });
  const deleteResults = await Promise.all(deletePromise);
  return deleteResults;
}

export async function getNewsList(
  params: ProTablePagination,
  searchParams: SearchParams
) {
  const { source, start, end } = searchParams;
  let path = `/api/news/list?${new URLSearchParams(
    JSON.parse(
      JSON.stringify({
        size: params.pageSize,
        current: params.current - 1, //TODO
      })
    )
  ).toString()}`;
  if (source) {
    path += `&source=${source}`;
  }
  if (start) {
    path += `&start=${start}&end=${end}`;
  }
  const data = await Fetcher<NewList>({
    input: path,
    init: {},
  });
  return {
    data: data.page,
    total: data.count * params.pageSize, //TODO： total的计算后端应该直接返回
    success: data.page.length !== 0,
  };
}

export async function getNewsDetail(id: number) {
  return await Fetcher<string>({
    input: `/api/news/${id}`,
    init: {
      method: "GET",
    },
  });
}

export interface FuzzySearchRequest {
  sentence: string;
  top: number;
}

export async function fuzzySearchNewsList(params: FuzzySearchRequest) {
  return await Fetcher<NewListItem[]>({
    input: "/api/news/search" + encodeUriFromParams(params),
    init: {
      method: "GET",
    },
  });
}

export const useGetNewsDetail = (id: number | undefined) => {
  return useFetcher<string>({
    input: `/api/news/${id}`,
    init: {
      method: "GET",
    },
  });
};

export async function updateNew(params: NewListItem & { content: string }) {
  return Fetcher<string>({ // 不能使用hook
    input: `/api/news/${params.id}`,
    init: {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  });
}
