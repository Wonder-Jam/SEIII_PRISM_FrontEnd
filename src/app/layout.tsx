import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutCilentComponent from "../components/LayoutClient";

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
          <LayoutCilentComponent>{children}</LayoutCilentComponent>
        </AntdRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
