"use client";

import UpdateForm, { FormValueType } from "@/components/UpdateTable/UpdateForm";
import {
  FuzzySearchRequest,
  NewListItem,
  Pagination,
  ProTablePagination,
  fuzzySearchNewsList,
  getNewsList,
  removeNew,
  updateNew,
  useGetNewsDetail,
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
  usePrevious,
} from "@ant-design/pro-components";
import {
  Button,
  Drawer,
  Input,
  Select,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading("Configuring");
  try {
    await updateNew({
      id: fields.id,
      title: fields.title,
      date: fields.title,
      source: fields.title,
      url: fields.title,
      category: fields.title,
      keywords: fields.title,
      content: fields.content,
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

let mockNews = [generateFakeNew(),generateFakeNew(),generateFakeNew()];

function generateFakeNew() {
  const id = Math.floor(Math.random() * 10000); // 随机生成一个小于10000的整数
  const title = `Title ${id}`; // 标题可以简单地与ID关联
  const date = `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`; // 随机生成一个日期
  const source = `Source ${id}`; // 来源也可以与ID关联
  const url = Math.random() > 0.5 ? `http://example.com/${id}` : undefined; // 随机决定是否包含URL
  const category = Math.random() > 0.5 ? `Category ${id % 10}` : undefined; // 随机决定是否包含分类
  const keywords = `Keyword1, Keyword2, Keyword${id % 5}`; // 随机生成一些关键词

  return {
    id,
    title,
    date,
    source,
    url,
    category,
    keywords
  };
}

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<NewListItem>();
  const [dataSource, setDataSource] = useState<NewListItem[]>();
  const [pagination, setPagination] = useState<ProTablePagination>({
    current: 1,
    pageSize: 10,
    total: 10,
  });
  const [fuzzySearchProps, setFuzzySearchProps] = useState<FuzzySearchRequest>({
    sentence: "",
    top: 10,
  });
  const prevFuzzyProps = usePrevious(fuzzySearchProps);
  const [selectedRowsState, setSelectedRows] = useState<NewListItem[]>([]);
  const columns: ProColumns<NewListItem>[] = [
    {
      title: "新闻标题",
      dataIndex: "title",
      tip: "支持搜索功能",
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
        <a key="config" onClick={() =>{
          handleUpdateModalVisible(true);
          setCurrentRow(record);}
        }>
          更改
        </a>,
      ],
    },
  ];
  // useEffect(() => {
  //   // 由于模糊搜索+普通展示的接口不同，且前者不分页，后者做分页处理，因此需要进行条件区分，统一注入到dataSource
  //   const fetchData = async () => {
  //     if (
  //       fuzzySearchProps.sentence !== "" &&
  //       (fuzzySearchProps.sentence !== prevFuzzyProps?.sentence || // 防止页面切换时触发重新请求
  //         fuzzySearchProps.top !== prevFuzzyProps.top) // 防止top修改时不触发重新请求
  //     ) {
  //       const data = await fuzzySearchNewsList(fuzzySearchProps);
  //       setDataSource(data);
  //       setPagination({
  //         current: 1,
  //         pageSize: data.length,
  //         total: data.length, // 后端没有分页，所以可以通过length知道total
  //       });
  //     } else if (fuzzySearchProps.sentence === "") {
  //       console.log(pagination);
  //       const data = await getNewsList(pagination);
  //       setDataSource(data.data);
  //       setPagination((prev) => ({
  //         ...prev,
  //         total: data.total, // 后端分页了，所以需要后端传total过来
  //       }));
  //     }
  //   };
  //   fetchData();
  // }, [
  //   pagination.current,
  //   pagination.pageSize,
  //   fuzzySearchProps.sentence,
  //   fuzzySearchProps.top,
  // ]);

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <PageContainer>
        <ProTable<NewListItem, Pagination>
          headerTitle={"查询新闻"}
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={false}
          // dataSource={dataSource}
            dataSource={mockNews}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          pagination={{
            total: pagination.total,
            pageSize: pagination.pageSize,
            current: pagination.current,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                total: prev.total,
                current: page,
                pageSize,
              }));
            },
          }}
          toolbar={{
            search: (
              <>
                <Tooltip title="请至少输入2个字符">
                  <Input.Search
                    placeholder="请搜索"
                    onSearch={(value) => {
                      if (value === "") {
                        setPagination((prev) => ({ ...prev, current: 1 }));
                      }
                      setFuzzySearchProps((prev) => ({
                        ...prev,
                        sentence: value,
                      }));
                    }}
                  />
                </Tooltip>
              </>
            ),
            actions: [
              <>
                <Typography.Text>检索数量：</Typography.Text>
                <Select
                  defaultValue={10}
                  options={[
                    { value: 10, label: 10 },
                    { value: 20, label: 20 },
                    { value: 50, label: 50 },
                    { value: 100, label: 100 },
                  ]}
                  onChange={(value) =>
                    setFuzzySearchProps((prev) => ({ ...prev, top: value }))
                  }
                />
              </>,
            ],
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
            // console.log("表格： ")
            // console.log(value);
            const success = await handleUpdate(value);
            // const success = true;
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
  const { data } = useGetNewsDetail(currentRow?.id);
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
