import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  App,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form as AntForm,
  Grid,
  Input,
  Menu,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import RjsfForm from "@rjsf/antd";
import type CoreForm from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import type { RJSFSchema, RJSFValidationError } from "@rjsf/utils";
import { getDocument, updateDocument } from "../api";
import { documentUiSchema } from "../components/rjsf/documentUiSchema";
import { documentFields } from "../components/rjsf/documentFields";
import {
  documentFormContext,
  documentTemplates,
  documentWidgets,
} from "../components/rjsf/documentTemplates";
import {
  DOCUMENT_SECTIONS,
  SECTION_MAP,
  sectionIconName,
} from "../components/rjsf/documentSections";
import { MaterialIcon } from "../components/rjsf/CvWidgets";
import {
  errorLocation,
  groupErrorsBySection,
} from "../components/rjsf/validationErrors";

const { useBreakpoint } = Grid;

export default function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const documentId = Number(id);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [schema, setSchema] = useState<RJSFSchema>({});
  const [schemaText, setSchemaText] = useState("{}");
  const [formData, setFormData] = useState<unknown>({});
  const [activeSection, setActiveSection] = useState<string>(
    DOCUMENT_SECTIONS[0].key,
  );
  // Validation runs on save; after the first failed save the form validates
  // live so errors disappear as soon as they are fixed.
  const formRef = useRef<CoreForm>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<RJSFValidationError[]>([]);
  const errorsBySection = useMemo(() => groupErrorsBySection(errors), [errors]);
  const nameMissing = !name.trim();

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

  const formContext = useMemo(
    () => ({ ...documentFormContext, activeSection }),
    [activeSection],
  );

  function applySchemaText(text: string) {
    setSchemaText(text);
    try {
      setSchema(JSON.parse(text) as RJSFSchema);
    } catch {
      /* keep the previous valid schema while the user is typing */
    }
  }

  function handleValidationErrors(nextErrors: RJSFValidationError[]) {
    setErrors(nextErrors);
  }

  /** Validates name + form data against the document's JSON Schema. */
  function validateBeforeSave(currentSchema: RJSFSchema): boolean {
    setShowErrors(true);
    // validateForm() marks the invalid fields inline; the error list is
    // computed here with the same validator so it is available right away.
    formRef.current?.validateForm();
    const { errors: validationErrors } = validator.validateFormData(
      formData,
      currentSchema,
    );
    handleValidationErrors(validationErrors);
    const formValid = validationErrors.length === 0;

    if (!formValid) {
      const failingSections = new Set(
        Object.keys(groupErrorsBySection(validationErrors)),
      );
      // Jump to the first section with errors unless the current one has some.
      if (!failingSections.has(activeSection)) {
        const firstFailing = DOCUMENT_SECTIONS.find((s) => failingSections.has(s.key));
        if (firstFailing) setActiveSection(firstFailing.key);
      }
      const count = validationErrors.length;
      message.error(
        `Fix ${count} validation error${count === 1 ? "" : "s"} before saving.`,
      );
      return false;
    }

    if (nameMissing) {
      message.error("Document name is required.");
      return false;
    }

    return true;
  }

  async function handleSave() {
    let parsedSchema: unknown;
    try {
      parsedSchema = JSON.parse(schemaText);
    } catch {
      message.error("JSON Schema is not valid JSON");
      return;
    }

    if (!validateBeforeSave(parsedSchema as RJSFSchema)) return;

    setSaving(true);
    try {
      await updateDocument(documentId, {
        name,
        language,
        json_schema: parsedSchema,
        json_data: formData,
      });
      setShowErrors(false);
      handleValidationErrors([]);
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

  const activeIndex = DOCUMENT_SECTIONS.findIndex((s) => s.key === activeSection);
  const activeMeta = SECTION_MAP[activeSection] ?? DOCUMENT_SECTIONS[0];
  const prevSection = DOCUMENT_SECTIONS[activeIndex - 1];
  const nextSection = DOCUMENT_SECTIONS[activeIndex + 1];
  const isDesktop = screens.lg;
  const activeErrors = showErrors ? (errorsBySection[activeSection] ?? []) : [];
  // Errors outside the known sections (e.g. a section the editor has no tab for).
  const otherErrors = showErrors
    ? errors.filter((error) => {
        const section = Object.keys(errorsBySection).find((key) =>
          errorsBySection[key].includes(error),
        );
        return !section || !SECTION_MAP[section];
      })
    : [];

  function sectionErrorCount(key: string) {
    return showErrors ? (errorsBySection[key]?.length ?? 0) : 0;
  }

  function goToSection(key: string) {
    setActiveSection(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sectionNav = (
    <Menu
      mode="inline"
      selectedKeys={[activeSection]}
      style={{ borderInlineEnd: "none", background: "transparent" }}
      onClick={({ key }) => setActiveSection(key)}
      items={DOCUMENT_SECTIONS.map((section) => {
        const errorCount = sectionErrorCount(section.key);
        return {
          key: section.key,
          // Follows the section's icon field live, as it is edited in the form.
          icon: <MaterialIcon name={sectionIconName(section.key, formData)} size={16} />,
          label: errorCount ? (
            <Space size={6}>
              {section.label}
              <Badge count={errorCount} size="small" />
            </Space>
          ) : (
            section.label
          ),
        };
      })}
    />
  );

  const formPanel = (
    <Card styles={{ body: { paddingTop: 20 } }}>
      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        <Space align="center" size={12}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#e6f4ff",
              color: "#1677ff",
              fontSize: 20,
            }}
          >
            <MaterialIcon name={sectionIconName(activeSection, formData)} size={22} />
          </span>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {activeMeta.label}
          </Typography.Title>
          <Typography.Text type="secondary">
            Section {activeIndex + 1} of {DOCUMENT_SECTIONS.length}
          </Typography.Text>
        </Space>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          {activeMeta.description}
        </Typography.Paragraph>
      </Space>

      <Divider style={{ margin: "16px 0" }} />

      {activeErrors.length > 0 && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message={`${activeErrors.length} validation error${activeErrors.length === 1 ? "" : "s"} in this section`}
          description={
            <ul style={{ margin: 0, paddingInlineStart: 18 }}>
              {activeErrors.map((error, index) => (
                <li key={`${error.property}-${index}`}>
                  {errorLocation(error) ? <strong>{errorLocation(error)}: </strong> : null}
                  {error.message}
                </li>
              ))}
            </ul>
          }
        />
      )}

      <div className="cv-form">
        <RjsfForm
          ref={formRef}
          schema={schema}
          uiSchema={documentUiSchema}
          formData={formData}
          validator={validator}
          fields={documentFields}
          widgets={documentWidgets}
          templates={documentTemplates}
          formContext={formContext}
          onChange={(e) => {
            setFormData(e.formData);
            if (showErrors) handleValidationErrors(e.errors ?? []);
          }}
          onError={handleValidationErrors}
          liveValidate={showErrors ? "onChange" : undefined}
          showErrorList={false}
        />
      </div>

      <Divider style={{ margin: "20px 0 12px" }} />
      <Row justify="space-between" align="middle">
        <Button
          icon={<LeftOutlined />}
          disabled={!prevSection}
          onClick={() => prevSection && goToSection(prevSection.key)}
        >
          {prevSection ? prevSection.label : "Previous"}
        </Button>
        <Button
          type="primary"
          ghost
          disabled={!nextSection}
          onClick={() => nextSection && goToSection(nextSection.key)}
        >
          {nextSection ? nextSection.label : "Last section"}
          <RightOutlined />
        </Button>
      </Row>
    </Card>
  );

  const dataTab = isDesktop ? (
    // `wrap={false}` keeps the nav and the form side by side: without it a wide
    // control inside the form (a long tag list, an expanded entry) grows the
    // column's natural width and Ant Design wraps it onto the next line.
    <Row gutter={24} align="top" wrap={false}>
      <Col flex="0 0 280px">
        <div style={{ position: "sticky", top: 96 }}>
          <Card
            size="small"
            title="Sections"
            styles={{ body: { padding: 4 } }}
          >
            {sectionNav}
          </Card>
        </div>
      </Col>
      <Col flex="1 1 auto" style={{ minWidth: 0 }}>
        {formPanel}
      </Col>
    </Row>
  ) : (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Select
        value={activeSection}
        style={{ width: "100%" }}
        onChange={(key) => goToSection(key)}
        options={DOCUMENT_SECTIONS.map((section) => {
          const errorCount = sectionErrorCount(section.key);
          return {
            value: section.key,
            label: errorCount ? `${section.label} (${errorCount} errors)` : section.label,
          };
        })}
      />
      {formPanel}
    </Space>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#e3e3e3",
          padding: "12px 0",
          margin: "-8px 0 -4px",
          boxShadow: "0 8px 8px -8px rgba(0,0,0,0.12)",
        }}
      >
        <Row justify="space-between" align="middle" wrap={false} gutter={12}>
          <Col style={{ minWidth: 0 }}>
            <Space size={12} align="center">
              <Tooltip title="Back to all documents">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/documents")}
                />
              </Tooltip>
              <div style={{ minWidth: 0 }}>
                <Typography.Title
                  level={4}
                  style={{ margin: 0 }}
                  ellipsis={{ tooltip: name }}
                >
                  {name || `Document #${documentId}`}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Edits go live on your CV page after you save.
                </Typography.Text>
              </div>
            </Space>
          </Col>
          <Col flex="none">
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
            >
              Save changes
            </Button>
          </Col>
        </Row>
      </div>

      <Card size="small">
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <AntForm.Item
              label="Document name"
              required
              style={{ marginBottom: 0 }}
              validateStatus={showErrors && nameMissing ? "error" : undefined}
              help={showErrors && nameMissing ? "Document name is required" : undefined}
            >
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={8}>
            <AntForm.Item label="Language" style={{ marginBottom: 0 }}>
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

      {otherErrors.length > 0 && (
        <Alert
          type="error"
          showIcon
          message="Validation errors outside the editable sections"
          description={
            <ul style={{ margin: 0, paddingInlineStart: 18 }}>
              {otherErrors.map((error, index) => (
                <li key={`${error.property}-${index}`}>
                  <strong>{error.property || "(root)"}: </strong>
                  {error.message}
                </li>
              ))}
            </ul>
          }
        />
      )}

      <Tabs
        defaultActiveKey="data"
        items={[
          {
            key: "data",
            label: "Edit content",
            children: dataTab,
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
    </div>
  );
}
