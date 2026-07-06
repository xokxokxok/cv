import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  App,
  Button,
  Card,
  Col,
  Form as AntForm,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import RjsfForm from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import type { RJSFSchema } from "@rjsf/utils";
import { getDocument, updateDocument } from "../api";
import SectionedObjectFieldTemplate from "../components/rjsf/SectionedObjectFieldTemplate";
import { documentUiSchema } from "../components/rjsf/documentUiSchema";
import { documentFields } from "../components/rjsf/documentFields";

export default function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const documentId = Number(id);
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [schema, setSchema] = useState<RJSFSchema>({});
  const [schemaText, setSchemaText] = useState("{}");
  const [formData, setFormData] = useState<unknown>({});

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const doc = await getDocument(documentId);
        if (!active) return;
        setName(doc.name);
        setLanguage(doc.language);
        setSchema(doc.json_schema as RJSFSchema);
        setSchemaText(JSON.stringify(doc.json_schema, null, 2));
        setFormData(doc.json_data);
      } catch (error) {
        message.error((error as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  function applySchemaText(text: string) {
    setSchemaText(text);
    try {
      setSchema(JSON.parse(text) as RJSFSchema);
    } catch {
      /* keep the previous valid schema while the user is typing */
    }
  }

  async function handleSave() {
    let parsedSchema: unknown;
    try {
      parsedSchema = JSON.parse(schemaText);
    } catch {
      message.error("JSON Schema is not valid JSON");
      return;
    }

    setSaving(true);
    try {
      await updateDocument(documentId, {
        name,
        language,
        json_schema: parsedSchema,
        json_data: formData,
      });
      message.success("Document saved");
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Edit document #{documentId}
        </Typography.Title>
        <Space>
          <Button onClick={() => navigate("/documents")}>Back</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Save
          </Button>
        </Space>
      </Space>

      <Card>
        <Row gutter={16}>
          <Col span={16}>
            <AntForm.Item label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </AntForm.Item>
          </Col>
          <Col span={8}>
            <AntForm.Item label="Language">
              <Select
                value={language}
                onChange={setLanguage}
                options={[
                  { value: "en", label: "English (en)" },
                  { value: "pt", label: "Portuguese (pt)" },
                  { value: "es", label: "Spanish (es)" },
                ]}
              />
            </AntForm.Item>
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="data"
        items={[
          {
            key: "data",
            label: "Data (form)",
            children: (
              <RjsfForm
                schema={schema}
                uiSchema={documentUiSchema}
                formData={formData}
                validator={validator}
                fields={documentFields}
                templates={{ ObjectFieldTemplate: SectionedObjectFieldTemplate }}
                onChange={(e) => setFormData(e.formData)}
                liveValidate={false}
              />
            ),
          },
          {
            key: "schema",
            label: "Schema (JSON)",
            children: (
              <Card>
                <Input.TextArea
                  value={schemaText}
                  onChange={(e) => applySchemaText(e.target.value)}
                  rows={20}
                  style={{ fontFamily: "monospace" }}
                />
              </Card>
            ),
          },
          {
            key: "raw",
            label: "Data (raw JSON)",
            children: (
              <Card>
                <Input.TextArea
                  value={JSON.stringify(formData, null, 2)}
                  rows={20}
                  readOnly
                  style={{ fontFamily: "monospace" }}
                />
              </Card>
            ),
          },
        ]}
      />
    </Space>
  );
}
