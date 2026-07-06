import { Layout, Menu, Typography } from "antd";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import DocumentsList from "./pages/DocumentsList";
import DocumentCreate from "./pages/DocumentCreate";
import DocumentEditor from "./pages/DocumentEditor";

const { Header, Content } = Layout;

export default function App() {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/documents/new")
    ? "new"
    : "list";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          CV Documents
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{ flex: 1, minWidth: 0 }}
          items={[
            { key: "list", label: <Link to="/documents">All documents</Link> },
            { key: "new", label: <Link to="/documents/new">New document</Link> },
          ]}
        />
      </Header>
      <Content style={{ padding: "24px 48px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/new" element={<DocumentCreate />} />
          <Route path="/documents/:id" element={<DocumentEditor />} />
        </Routes>
      </Content>
    </Layout>
  );
}
