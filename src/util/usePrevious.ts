import { useEffect, useRef } from "react";

export const usePrevious = (data: any) => {
  const prev = useRef(data);
  useEffect(() => {
    prev.current = data;
  }, [data]);
  return prev.current;
};
