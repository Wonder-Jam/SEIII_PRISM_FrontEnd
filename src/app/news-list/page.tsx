"use client";

import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from "@ant-design/pro-components";
import { Button, Drawer, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { useGetNewsList, removeNew, updateNew } from "@/services/news/api";
import UpdateForm, { FormValueType } from "@/components/UpdateTable/UpdateForm";

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading("Configuring");
  try {
    // TODO: 新闻字段修改
    await updateNew({
      title: fields.title,
    });
    hide();
    message.success("Configuration is successful");
    return true;
  } catch (error) {
    hide();
    message.error("Configuration failed, please try again!");
    return false;
  }
};

const handleRemove = async (selectedRows: API.NewListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeNew({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success("Deleted successfully and will refresh soon");
    return true;
  } catch (error) {
    hide();
    message.error("Delete failed, please try again");
    return false;
  }
};

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.NewListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.NewListItem[]>([]);
  const columns: ProColumns<API.NewListItem>[] = [
    {
      title: "新闻标题",
      dataIndex: "title",
      tip: "支持模糊搜索",
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: "来源",
      dataIndex: "source",
      valueType: "textarea",
    },
    {
      title: "关键词",
      search: false,
      dataIndex: "keywords",
      valueType: "textarea",
    },
    {
      title: "发布时间",
      search: false,
      sorter: true,
      dataIndex: "date",
      valueType: "dateTime",
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue("status");
        if (`${status}` === "0") {
          return false;
        }
        if (`${status}` === "3") {
          return <Input {...rest} placeholder={"请输入异常原因！"} />;
        }
        return defaultRender(item);
      },
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          更改
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          收藏
        </a>,
      ],
    },
  ];

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <PageContainer>
        <ProTable<API.NewListItem>
          headerTitle={"查询新闻"}
          actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          request={async (
              params,
              sort,
              filter,
          ) => {
            // const response = await useGetNewsList(
            //   params, {"sort": sort, "filter": filter}
            // );
            // TODO: 错误处理
            console.log("params: ")
            console.log(params);
            console.log("sort: ")
            console.log(sort)
            console.log("filter: ")
            console.log(filter)

            let testo = {
              data: [{
                key: 1,
                title: "test1",
                keywords: "test 1",
                source: "xinhuawang",
                date: "20240311",
              },{
                key: 2,
                title: "test2",
                keywords: "-",
                source: "xinhuawang",
                date: "20240311",
              }
              ],
              success: true,
              total: 1,
            };
            return new Promise(resolve => resolve(testo));
          }}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
        {/* 选中行的操作 */}
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                已选择{" "}
                <a
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {selectedRowsState.length}
                </a>{" "}
                项 &nbsp;&nbsp;
                <span>
                  总搜集新闻数量{" "}
                  {selectedRowsState.length}{" "}
                  条
                </span>
              </div>
            }
          >
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              批量删除
            </Button>
            <Button type="primary">批量收藏</Button>
          </FooterToolbar>
        )}

        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            if (!showDetail) {
              setCurrentRow(undefined);
            }
          }}
          updateModalVisible={updateModalVisible}
          values={currentRow || {}}
        />
        {/* Drawer 详细展示新闻 */}
        <Drawer
          width={600}
          visible={showDetail}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
          closable={false}
        >
          {currentRow?.title && (
            <ProDescriptions<API.NewListItem>
              column={2}
              title={currentRow?.title}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.title,
              }}
              columns={columns as ProDescriptionsItemProps<API.NewListItem>[]}
            />
          )}
        </Drawer>
      </PageContainer>
    </div>
  );
};

export default TableList;
