export type Row = Record<string, string | number | boolean | null | undefined>;

const escapeCSV = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  // Quote if contains comma, quote, or newline
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCSV(rows: Row[], headers?: string[]): string {
  if (!rows.length) return "";
  const cols = headers ?? Object.keys(rows[0]);
  const head = cols.join(",");
  const body = rows
    .map((r) => cols.map((c) => escapeCSV(r[c])).join(","))
    .join("\n");
  return [head, body].join("\n");
}

export function downloadText(
  filename: string,
  contents: string,
  mime = "text/csv;charset=utf-8"
) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}
