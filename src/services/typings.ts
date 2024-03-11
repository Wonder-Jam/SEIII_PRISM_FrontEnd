// @ts-ignore
/* eslint-disable */

declare namespace API {
    type NewListItem = {
        key?: number;
        title: string;
        keywords: string;
        source: string;
        date: string;
    }

    type NewList = {
        data?: NewListItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type PageParams = {
        current?: number;
        pageSize?: number;
    };
}
