import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  App,
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { deleteDocument, listDocuments, type DocumentRecord } from "../api";

export default function DocumentsList() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setDocuments(await listDocuments());
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteDocument(id);
      message.success("Document deleted");
      load();
    } catch (error) {
      message.error((error as Error).message);
    }
  }

  const columns: ColumnsType<DocumentRecord> = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string, record) => (
        <Link to={`/documents/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      width: 140,
      render: (language: string) => <Tag color="blue">{language}</Tag>,
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
      width: 200,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/documents/${record.id}`)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this document?"
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
        <Typography.Title level={3} style={{ margin: 0 }}>
          Documents
        </Typography.Title>
        <Button type="primary" onClick={() => navigate("/documents/new")}>
          New document
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={documents}
        pagination={false}
      />
    </Space>
  );
}
