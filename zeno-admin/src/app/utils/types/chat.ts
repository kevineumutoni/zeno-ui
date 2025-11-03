import { InputFile } from "./runs";

export type ArtifactType = "text" | "chart" | "table" | "progress" | "link" | "list" | "pdf_report";

export interface OutputArtifact {
  id?: string | number;
  artifact_type: ArtifactType;
  data: ChartData | TableData | string | TextData | PdfReportData;
  title?: string;
}

export type Run = {
  id: number;
  user_input: string;
  status: "pending" | "running" | "completed" | "failed";
  final_output?: string | null | undefined;
  output_artifacts?: OutputArtifact[];
  files?: File[];
  input_files?: InputFile[];
  started_at: string;
  completed_at?: string | null | undefined;
};

export type ChatMessageProps = {
  role: "user" | "agent";
  text?: string;
  artifactType?: ArtifactType;
  artifactData?: ChartData | TableData | string | TextData | PdfReportData;
  loading?: boolean;
  runId?: string | number;
  userId?: number;
};

export type TableData = {
  columns?: string[];
  rows?: (string | number)[][];
  x?: (string | number)[];
  y?: (string | number)[];
  title?: string;
  content?: string;
};

export type ChartData = {
  x: (string | number)[];
  y: number[];
  title?: string;
  chart_type?: "bar" | "line" | "pie" | string;
};

export type TextData = {
  content: string;
  summary?: string;
};

export interface PdfReportData {
  url: string;
  pages?: number;
  generated_at?: string;
}

export type ArtifactRendererProps = {
  artifactType: ArtifactType;
  artifactData: ChartData | TableData | string | TextData | PdfReportData;
  text?: string;
};

export interface RunFile {
  file: File;
  previewUrl: string;
}

export interface RunLike {
  id: number | string;
  user_input: string;
  status: string;
  final_output: string | null;
  input_files?: InputFile[]; 
  output_artifacts: OutputArtifact[];
  started_at: string;
  _optimistic?: boolean;
  files?: RunFile[];
  error?: string;
}

export interface FileWithPreview {
  file: File;
  previewUrl: string;
}

export interface ChatInputProps {
  conversationId?: string | null;
  user: { id: number; token: string };
  sendMessage: (params: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: { file: File; previewUrl: string }[];
  }) => Promise<RunLike>;
  onRunCreated?: (run: RunLike) => void;
}

export type ChatMessagesProps = {
  runs: RunLike[];
  onRetry?: (run: RunLike) => void;
  userId?: number;
  runLimitError?: boolean
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role: string;
  image?: string;
  id: number;
};

export type Conversation = {
  conversation_id: number;
  title: string;
  user?: User;
  runs: RunLike[];
  created_at: string;
};

export interface UserMessageProps {
  text: string;
  files?: RunFile[];
}