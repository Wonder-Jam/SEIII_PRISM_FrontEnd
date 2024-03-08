// @ts-ignore
/* eslint-disable */

export async function removeNew(options?: { [key: string]: any }) {
    // TODO: 请求路径
    // return request<Record<string, any>>('/api/news/{id}', {
    //     method: 'DELETE',
    //     ...(options || {}),
    // });
}

export async function getNews(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    },
    options?: { [key: string]: any },
) {
    // return request<API.NewList>('/api/news/list', {
    //     method: 'GET',
    //     params: {
    //         ...params,
    //     },
    //     ...(options || {}),
    // });
}

export async function updateNew(options?: { [key: string]: any }) {
    // TODO: 修改请求方式和路径
    // return request<API.NewListItem>('/api/news/{id}', {
    //     method: 'PUT',
    //     ...(options || {}),
    // });
}
