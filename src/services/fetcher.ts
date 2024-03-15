import { message } from "antd";
import { useEffect, useState } from "react";

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
    message.error(responseData.msg);
    throw new Error(`Request failed with status ${response.status}`);
  }
  return responseData.data;
};

export const useFetcher = <T>(
  params: FetcherPayLoad
): { isLoading: boolean; data: T | null; error: Error | null } => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const controller = new AbortController();
  useEffect(() => {
    if (
      typeof params.input === "string" &&
      (params.input.includes("undefined") || params.input.includes("null"))
    ) {
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        window.setTimeout(() => controller.abort(), 30000);
        const response = await fetch(params.input, {
          ...params.init,
          credentials: "include",
        }).catch(() => {
          throw new Error("Network Connection Error");
        });
        const responseData: ResponseDataWrapper<T> = await response.json();
        if (!response.ok) {
          setError(new Error(responseData.msg));
        } else {
          setError(null);
          setData(responseData.data);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [params.input, JSON.stringify(params.init.body)]);
  return { isLoading, data, error };
};
export const encodeUriFromParams = <T extends object | undefined = undefined>(
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

// export const useGet = <
//   ResponseData,
//   RequestData extends object | undefined = undefined
// >(
//   path: string,
//   params?: RequestData,
//   config?: SWRConfiguration
// ) => {
//   const key: FetcherPayLoad = {
//     input: path + encodeUriFromParams<RequestData>(params),
//     init: {
//       method: "GET",
//     },
//   };
//   // fetcher 通过全局配置提供
//   // <Data = any, Error = any, SWRKey extends Key = null>(key: SWRKey, fetcher: Fetcher<Data, SWRKey> | null, config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined): SWRResponse<Data, Error>;
//   return useSWR<ResponseData, Error, FetcherPayLoad>(key, config);
// };

// export const usePost = <ResponseData, RequestData>(
//   path: string,
//   data: RequestData,
//   config?: SWRConfiguration
// ) => {
//   const key: FetcherPayLoad = {
//     input: path,
//     init: {
//       method: "POST",
//       body: JSON.stringify(data),
//     },
//   };
//   return useSWR<ResponseData, Error, FetcherPayLoad>(key, config);
// };

// export const useDelete = <RequestData>(
//   path: string,
//   data?: RequestData,
//   config?: SWRConfiguration
// ) => {
//   const key: FetcherPayLoad = {
//     input: path,
//     init: {
//       method: "DELETE",
//       body: JSON.stringify(data),
//     },
//   };
//   return useSWR<any, Error, FetcherPayLoad>(key, config);
// };
