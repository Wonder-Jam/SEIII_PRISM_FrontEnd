'use client'

import { FooterToolbar, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import {getNews, removeNew, updateNew} from "@/services/api";
import UpdateForm, {FormValueType} from "@/components/UpdateTable/UpdateForm";

const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Configuring');
    try {
        // TODO: 新闻字段修改
        await updateNew({
            title: fields.title,
            desc: fields.desc,
            key: fields.key,
        });
        hide();
        message.success('Configuration is successful');
        return true;
    } catch (error) {
        hide();
        message.error('Configuration failed, please try again!');
        return false;
    }
};

const handleRemove = async (selectedRows: API.NewListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
        await removeNew({
            key: selectedRows.map((row) => row.key),
        });
        hide();
        message.success('Deleted successfully and will refresh soon');
        return true;
    } catch (error) {
        hide();
        message.error('Delete failed, please try again');
        return false;
    }
};

const TableList: React.FC = () => {

    /**
     * @en-US The pop-up window of the distribution update window
     * @zh-CN 分布更新窗口的弹窗
     * */
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.NewListItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.NewListItem[]>([]);

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */

    const columns: ProColumns<API.NewListItem>[] = [
        {
            title: '新闻标题',
            dataIndex: 'name',
            tip: '支持模糊搜索',
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
            title: '来源',
            dataIndex: 'desc',
            valueType: 'textarea',
        },
        {
            title: '关键词',
            dataIndex: 'desc',
            valueType: 'textarea',
        },
        {
            title: '点击数',
            dataIndex: 'callNo',
            search: false,
            sorter: true,
            hideInForm: true,
            renderText: (val: string) => `${val}${'万'}`,
        },
        {
            title: '发布时间',
            sorter: true,
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
            renderFormItem: (item, { defaultRender, ...rest }, form) => {
                const status = form.getFieldValue('status');
                if (`${status}` === '0') {
                    return false;
                }
                if (`${status}` === '3') {
                    return <Input {...rest} placeholder={'请输入异常原因！'} />;
                }
                return defaultRender(item);
            },
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
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
        <div style={{backgroundColor: '#efefef'}}>
        <PageContainer>
            <ProTable<API.NewListItem, API.PageParams>
                headerTitle={'查询新闻'}
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                request={getNews}
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
                            已选择{' '}
                            <a
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedRowsState.length}
                            </a>{' '}
                            项 &nbsp;&nbsp;
                            <span>总搜集新闻数量 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 条</span>
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
