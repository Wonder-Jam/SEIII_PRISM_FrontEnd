"use client";

import UpdateForm, { FormValueType } from "@/components/UpdateTable/UpdateForm";
import { useFetcher } from "@/services/fetcher";
import {
  GetNewsList,
  NewListItem,
  Pagination,
  removeNew,
  updateNew
} from "@/services/news/api";
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from "@ant-design/pro-components";
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Drawer, Typography, message } from "antd";
import React, { useRef, useState } from "react";

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading("Configuring");
  try {
    // TODO: 新闻字段修改
    await updateNew({
      title: fields.title,
      source: fields.source,
      id: fields.id,
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

const handleRemove = async (selectedRows: NewListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeNew({
      key: selectedRows.map((row) => row.id),
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
  const [currentRow, setCurrentRow] = useState<NewListItem>();
  const [selectedRowsState, setSelectedRows] = useState<NewListItem[]>([]);
  const columns: ProColumns<NewListItem>[] = [
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
      title: "发布日期",
      sorter: true,
      dataIndex: "date",
      valueType: "date",
    },
    {
      title: "发布来源",
      dataIndex: "source",
      valueType: "textarea",
    },
    {
      title: "发布网址",
      dataIndex: "url",
      valueType: "textarea",
    },
    {
      title: "类别",
      dataIndex: "category",
      valueType: "textarea",
    },
    {
      title: "关键词",
      dataIndex: "keywords",
      valueType: "textarea",
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => [
        <a key="config" onClick={() => message.info("wait")}>
          更改
        </a>,
      ],
    },
  ];

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <PageContainer>
        <ProTable<NewListItem, Pagination>
          headerTitle={"查询新闻"}
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{
            labelWidth: 120,
          }}
          request={GetNewsList}
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
                <span>总搜集新闻数量 {selectedRowsState.length} 条</span>
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
        <DetailDrawer
          onClose={() => setShowDetail(false)}
          showDetail={showDetail}
          currentRow={currentRow}
          columns={columns}
        />
        {/* Drawer 详细展示新闻 */}
      </PageContainer>
    </div>
  );
};

interface DetailProps {
  showDetail: boolean;
  onClose: () => void;
  currentRow?: NewListItem;
  columns: ProColumns<NewListItem>[];
}
const DetailDrawer = (props: DetailProps) => {
  const { showDetail, onClose, currentRow, columns } = props;
  const { data } = useFetcher<string>({
    input: `/api/news/${currentRow?.id}`,
    init: {
      method: "GET",
    },
  });
  return (
    <Drawer width={600} open={showDetail} onClose={onClose} closable={false}>
      {currentRow?.title && (
        <ProDescriptions<NewListItem>
          column={2}
          title={currentRow?.title}
          dataSource={currentRow}
          params={{
            id: currentRow?.title,
          }}
          columns={columns as ProDescriptionsItemProps<NewListItem>[]}
        />
      )}
      <Typography.Text>{data}</Typography.Text>
    </Drawer>
  );
};
export default TableList;
