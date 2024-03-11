import { message } from "antd";
import useSWR, { SWRConfiguration } from "swr";

interface ResponseDataWrapper<T> {
  code: number;
  msg: string;
  data: T;
}
interface FetcherPayLoad {
  input: RequestInfo;
  init: RequestInit;
}
export const Fetcher = async <T>(params: FetcherPayLoad): Promise<T> => {
  const controller = new AbortController();
  window.setTimeout(() => controller.abort(), 30000);
  const response = await fetch(params.input, {
    ...params.init,
    credentials: "include",
  }).catch(() => {
    throw new Error("NetWork Connection Error");
  });
  const responseData: ResponseDataWrapper<T> = await response.json();
  if (!response.ok) {
    message.error(responseData.msg)
    throw new Error(`Request failed with status ${response.status}`);
  }
  return responseData.data;
};

const encodeUriFromParams = <T extends object | undefined = undefined>(
  params?: T
): string => {
  if (!params) {
    return "";
  }
  const uri = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
  return uri && `?${uri}`;
};

export const useGet = <
  ResponseData,
  RequestData extends object | undefined = undefined
>(
  path: string,
  params?: RequestData,
  config?: SWRConfiguration
) => {
  const key: FetcherPayLoad = {
    input: path + encodeUriFromParams<RequestData>(params),
    init: {
      method: "GET",
    },
  };
  // fetcher 通过全局配置提供
  // <Data = any, Error = any, SWRKey extends Key = null>(key: SWRKey, fetcher: Fetcher<Data, SWRKey> | null, config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined): SWRResponse<Data, Error>;
  return useSWR<ResponseData, Error, FetcherPayLoad>(key, config);
};

export const usePost = <ResponseData, RequestData>(
  path: string,
  data: RequestData,
  config?: SWRConfiguration
) => {
  const key: FetcherPayLoad = {
    input: path,
    init: {
      method: "POST",
      body: JSON.stringify(data),
    },
  };
  return useSWR<ResponseData, Error, FetcherPayLoad>(key, config);
};

export const useDelete = <RequestData>(
  path: string,
  data?: RequestData,
  config?: SWRConfiguration
) => {
  const key: FetcherPayLoad = {
    input: path,
    init: {
      method: "DELETE",
      body: JSON.stringify(data),
    },
  };
  return useSWR<any, Error, FetcherPayLoad>(key, config);
};
