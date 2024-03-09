"use client";
import { Fetcher } from "@/services/fetcher";
import { SWRConfig } from "swr";

export const SWRConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SWRConfig
      value={{
        fetcher: Fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};
