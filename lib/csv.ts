export function toCSV(headers: string[], rows: (string | number | null | undefined)[][]) {
  const esc = (v: any) => {
    const s = (v ?? "").toString();
    return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map(r => r.map(esc).join(","))].join("\n");
}
