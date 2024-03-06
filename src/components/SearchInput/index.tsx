import {
    PlusCircleFilled,
    SearchOutlined
} from "@ant-design/icons";
import { Input, theme } from "antd";
export const SearchInput = () => {
    const { token } = theme.useToken();
    return (
      <div
        key="SearchOutlined"
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          marginInlineEnd: 24,
        }}
      >
        <Input
          style={{
            borderRadius: 4,
            marginInlineEnd: 12,
            backgroundColor: token.colorBgTextHover,
          }}
          prefix={<SearchOutlined />}
          placeholder="搜索方案"
          variant="borderless"
        />
        <PlusCircleFilled
          style={{
            color: token.colorPrimary,
            fontSize: 24,
          }}
        />
      </div>
    );
  };