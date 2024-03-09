"use client";
import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
} from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import { _defaultRouteProps } from "./_defaultRouteProps";
import { _layoutSettingProps } from "./_layoutSettingProps";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  if (typeof document === "undefined") {
    return <div />;
  }
  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById("test-pro-layout") || document.body;
          }}
        >
          <ProLayout
            {..._layoutSettingProps}
            {..._defaultRouteProps}
            menuItemRender={(item, dom) => {
              return (
                <div
                  onClick={() => {
                    router.push(item.path || "/welcome");
                  }}
                >
                  {dom}
                </div>
              );
            }}
            location={{
              pathname,
            }}
          >
            <PageContainer>
              <ProCard>{children}</ProCard>
            </PageContainer>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default Layout;
