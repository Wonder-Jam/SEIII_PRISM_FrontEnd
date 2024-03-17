import {NewListItem, useGetNewsDetail} from "@/services/news/api";
import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from "@ant-design/pro-components";
import { Modal } from "antd";
import React from "react";

export type FormValueType = {
    id: number;
    title: string;
    date: string;
    source: string;
    url?: string;
    category?: string;
    keywords?: string;
    content?: string;
};

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<NewListItem>;
};
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const { data } = useGetNewsDetail(props.values.id);
  return (
    <StepsForm
      stepsProps={{
        size: "small",
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            // styles.body={{
            // }}
            styles={{
              body: {
                padding: "32px 40px 48px",
              },
            }}
            destroyOnClose
            title={"新闻修改"}
            open={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
            id: props.values.id || 0,
          title: props.values.title || "",
            url: props.values.url || "",
          source: props.values.source || "",
            date: props.values.date || "",
            keywords: props.values.keywords || "",
            category: props.values.category || "",
        }}
        title={"基本信息"}
      >
          <ProFormText
              name="id"
              label={"新闻id"}
              width="md"
              rules={[
                  {
                      required: true,
                      message: "请输入新闻名称！",
                  },
              ]}
              disabled
          />
        <ProFormText
          name="title"
          label={"新闻名称"}
          width="md"
          rules={[
            {
              required: true,
              message: "请输入新闻名称！",
            },
          ]}
        />
          <ProFormText
              name="url"
              label={"url"}
              width="md"
              rules={[
                  {
                      required: true,
                      message: "请输入url！",
                  },
              ]}
          />
          <ProFormDateTimePicker
              name="date"
              width="md"
              label={"开始时间"}
              rules={[
                  {
                      required: true,
                      message: "请选择开始时间！",
                  },
              ]}
          />
          <ProFormText
              name="source"
              label={"来源"}
              width="md"
              rules={[
                  {
                      required: false,
                      message: "请输入新闻来源！",
                  },
              ]}
          />
          <ProFormText
              name="keywords"
              width="md"
              label={"关键词描述"}
              placeholder={"推荐使用空格分词"}
              rules={[
                  {
                      required: false,
                      message: "选填",
                      min: 0,
                  },
              ]}
          />
          <ProFormText
              name="category"
              label={"类别"}
              width="md"
              rules={[
                  {
                      required: false,
                      message: "选填",
                      min: 0,
                  },
              ]}
          />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
            content: data
        }}
        title={"新闻正文"}
      >
          <ProFormTextArea
              name="content"
              label={"正文"}
              width="md"
              rules={[
                  {
                      required: false,
                      message: "请输入正文！",
                  },
              ]}
          />
      </StepsForm.StepForm>
    </StepsForm>
  );
};
export default UpdateForm;
