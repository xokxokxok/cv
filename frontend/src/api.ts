export interface DocumentRecord {
  id: number;
  name: string;
  language: string;
  json_schema: Record<string, unknown>;
  json_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DocumentPayload {
  name: string;
  language: string;
  json_schema: unknown;
  json_data: unknown;
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.errors) message = body.errors.join(", ");
      else if (body?.error) message = body.error;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function listDocuments(): Promise<DocumentRecord[]> {
  return request<DocumentRecord[]>("/documents");
}

export function getDocument(id: number): Promise<DocumentRecord> {
  return request<DocumentRecord>(`/documents/${id}`);
}

export function createDocument(
  payload: DocumentPayload,
): Promise<DocumentRecord> {
  return request<DocumentRecord>("/documents", {
    method: "POST",
    body: JSON.stringify({ document: payload }),
  });
}

export function updateDocument(
  id: number,
  payload: DocumentPayload,
): Promise<DocumentRecord> {
  return request<DocumentRecord>(`/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ document: payload }),
  });
}

export function deleteDocument(id: number): Promise<void> {
  return request<void>(`/documents/${id}`, { method: "DELETE" });
}
