import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  createQuestion,
  deleteQuestion,
  getDocument,
  listQuestions,
  updateQuestion,
  type QuestionRecord,
} from "../api";

interface FormValues {
  question: string;
  answer: string;
}

export default function QuestionsList() {
  const { documentId: documentIdParam } = useParams<{ documentId: string }>();
  const documentId = Number(documentIdParam);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<QuestionRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setQuestions(await listQuestions(documentId));
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    getDocument(documentId)
      .then((doc) => setDocumentName(doc.name))
      .catch(() => setDocumentName(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(record: QuestionRecord) {
    setEditing(record);
    setModalOpen(true);
  }

  async function handleSubmit(values: FormValues) {
    const payload = {
      question: values.question,
      answer: values.answer ? values.answer : null,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateQuestion(editing.id, payload);
        message.success("Question updated");
      } else {
        await createQuestion(documentId, payload);
        message.success("Question created");
      }
      setModalOpen(false);
      load();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteQuestion(id);
      message.success("Question deleted");
      load();
    } catch (error) {
      message.error((error as Error).message);
    }
  }

  const columns: ColumnsType<QuestionRecord> = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Question",
      dataIndex: "question",
      render: (question: string) => (
        <Typography.Text>{question}</Typography.Text>
      ),
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (answer: string | null) =>
        answer ? (
          <Typography.Text>{answer}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">No answer yet</Typography.Text>
        ),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      width: 220,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this question?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/documents")}
          >
            Documents
          </Button>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Questions{documentName ? ` — ${documentName}` : ""}
          </Typography.Title>
        </Space>
        <Button type="primary" onClick={openCreate}>
          New question
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={questions}
        pagination={false}
      />

      <Modal
        title={editing ? "Edit question" : "New question"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? "Save" : "Create"}
        confirmLoading={saving}
        destroyOnHidden
      >
        {/* The modal content is unmounted while hidden, so the form is
            remounted with fresh initialValues on every open. */}
        <Form
          key={editing?.id ?? "new"}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            question: editing?.question ?? "",
            answer: editing?.answer ?? "",
          }}
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Question is required" }]}
          >
            <Input.TextArea rows={3} placeholder="What do you want to know?" />
          </Form.Item>
          <Form.Item label="Answer" name="answer">
            <Input.TextArea rows={5} placeholder="Optional — can be filled in later" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
