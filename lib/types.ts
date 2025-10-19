// /lib/types.ts
export type DocumentLite = {
  id: string;
  title: string;
  category: string;
  status: "voting" | "pending" | "completed";
  deadline?: string | null; // ISO
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type VoteChoice = "AGREE" | "DISAGREE" | "ABSTAIN";

export type VoteSummary = {
  documentId: string;
  agree: number;
  disagree: number;
  abstain: number;
  total: number;
  agreeRate: number; // 0..1
};

export type VoteDocSummary = {
  id: string;
  title: string;
  total: number;
  agree: number;
  disagree: number;
  abstain: number;
};

export type FeedbackItem = {
  id: string;
  documentId: string;
  fullname: string;
  studentId: string;
  email: string;
  unit: string;
  content: string;
  fileUrl?: string | null;
  tag?: string | null;
  createdAt: string;
  document?: DocumentLite;
};

export type FeedbackList = {
  items: FeedbackItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type Stats = {
  delegates: number;
  documents: number;
  feedback: number;
  votes: number;
};
