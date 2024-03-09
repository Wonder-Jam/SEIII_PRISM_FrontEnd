"use client";
import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { ProLayoutProps } from "@ant-design/pro-layout";
import { Dropdown } from "antd";
import { SearchInput } from "../SearchInput";

export const _layoutSettingProps: ProLayoutProps = {
  breadcrumbRender: (router) => undefined,
  token: {
    header: {
      colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
    },
  },
  menu: {
    collapsedShowGroupTitle: true,
  },
  avatarProps: {
    src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    size: "small",
    title: "七妮妮",
    render: (props, dom) => {
      return (
        <Dropdown
          {...props}
          menu={{
            items: [
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "退出登录",
              },
            ],
          }}
        >
          {dom}
        </Dropdown>
      );
    },
  },
  actionsRender: (props) => {
    if (props.isMobile) return [];
    if (typeof window === "undefined") return [];
    return [
      props.layout !== "side" && document.body.clientWidth > 1400 ? (
        <SearchInput />
      ) : undefined,
      <InfoCircleFilled key="InfoCircleFilled" />,
      <QuestionCircleFilled key="QuestionCircleFilled" />,
      <GithubFilled key="GithubFilled" />,
    ];
  },
  headerTitleRender: (logo, title, _) => {
    const defaultDom = (
      <a>
        {logo}
        {title}
      </a>
    );
    if (typeof window === "undefined") return defaultDom;
    if (document.body.clientWidth < 1400) {
      return defaultDom;
    }
    if (_.isMobile) return defaultDom;
    return <>{defaultDom}</>;
  },
  menuFooterRender: (props) => {
    if (props?.collapsed) return undefined;
    return (
      <div
        style={{
          textAlign: "center",
          paddingBlockStart: 12,
        }}
      >
        <div>© 2024 Made with love</div>
        <div>by PRISM Group</div>
      </div>
    );
  },
  onMenuHeaderClick: (e) => console.log(e),
  fixSiderbar: true,
  layout: "mix",
  splitMenus: false,
};
