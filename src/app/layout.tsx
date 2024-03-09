import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { SWRConfigProvider } from "./client/provider";
const LayoutCilentComponent = dynamic(
  () => import("@/components/LayoutClient"),
  { ssr: false }
); // TODO: 解决Text content does not match server-rendered HTML的问题，但是无法使用SSR的优势了
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRISM 开源情报分析系统",
  description: "oPen souRce Intelligence SysteM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <SWRConfigProvider>
            <LayoutCilentComponent>{children}</LayoutCilentComponent>
          </SWRConfigProvider>
        </AntdRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
