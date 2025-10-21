// lib/allowlist.ts
export const ALLOWLIST: string[] = [
  "22110340",
  "2212346",
  "2212347",
  // ... thêm ở đây
];

// (tuỳ chọn) helper:
export const isAllowed = (mssv?: string | null) =>
  !!mssv && ALLOWLIST.includes(String(mssv).trim());
