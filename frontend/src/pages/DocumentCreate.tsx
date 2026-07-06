import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { createDocument } from "../api";

const STARTER_SCHEMA = `{
  "type": "object",
  "required": ["title"],
  "properties": {
    "title": { "type": "string", "title": "Title" },
    "summary": { "type": "string", "title": "Summary" }
  }
}`;

const STARTER_DATA = `{
  "title": "",
  "summary": ""
}`;

interface FormValues {
  name: string;
  language: string;
  json_schema: string;
  json_data: string;
}

export default function DocumentCreate() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<FormValues>();

  async function onFinish(values: FormValues) {
    let json_schema: unknown;
    let json_data: unknown;
    try {
      json_schema = JSON.parse(values.json_schema);
    } catch {
      message.error("JSON Schema is not valid JSON");
      return;
    }
    try {
      json_data = values.json_data ? JSON.parse(values.json_data) : {};
    } catch {
      message.error("JSON Data is not valid JSON");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createDocument({
        name: values.name,
        language: values.language,
        json_schema,
        json_data,
      });
      message.success("Document created");
      navigate(`/documents/${created.id}`);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <Typography.Title level={3}>New document</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          language: "en",
          json_schema: STARTER_SCHEMA,
          json_data: STARTER_DATA,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="e.g. Curriculum Vitae" />
        </Form.Item>

        <Form.Item
          label="Language"
          name="language"
          rules={[{ required: true, message: "Language is required" }]}
        >
          <Select
            options={[
              { value: "en", label: "English (en)" },
              { value: "pt", label: "Portuguese (pt)" },
              { value: "es", label: "Spanish (es)" },
            ]}
          />
        </Form.Item>

        <Form.Item label="JSON Schema" name="json_schema">
          <Input.TextArea rows={10} style={{ fontFamily: "monospace" }} />
        </Form.Item>

        <Form.Item label="Initial JSON Data" name="json_data">
          <Input.TextArea rows={8} style={{ fontFamily: "monospace" }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create
            </Button>
            <Button onClick={() => navigate("/documents")}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
