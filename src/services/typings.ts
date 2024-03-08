// @ts-ignore
/* eslint-disable */

declare namespace API {
    type NewListItem = {
        key?: number;
        title: string;
        desc: string;
        callNo?: number;
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
