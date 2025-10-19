import { z } from "zod";

export const voteCreateSchema = z.object({
  documentId: z.string().min(1),
  choice: z.enum(["AGREE", "DISAGREE", "ABSTAIN"]),
  mssv: z.string().trim().optional(),
  unit: z.string().trim().optional(),
});

export const feedbackCreateSchema = z.object({
  documentId: z.string().min(1),
  fullname: z.string().min(2).max(100),
  studentId: z.string().min(3).max(20),
  email: z.string().email(),
  unit: z.string().min(2).max(100),
  content: z.string().min(30).max(2500),
  // file upload sẽ lấy từ FormData -> server xử lý, ở đây chỉ nhận URL (nếu đã up)
  fileUrl: z.string().url().optional(),
});

export const docCreateSchema = z.object({
  title: z.string().min(3),
  category: z.string().default("Khác"),
  status: z.enum(["voting","pending","completed"]).default("voting"),
  deadline: z.string().datetime().optional(),
  description: z.string().optional()
});
