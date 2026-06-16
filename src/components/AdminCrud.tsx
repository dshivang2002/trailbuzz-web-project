import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { AdminShell, AdminHeader } from "@/components/AdminShell";
import { useRequireAdmin, getAdminToken } from "@/lib/admin-client";
import { adminList, adminSave, adminDelete } from "@/lib/admin.functions";
import { slugify } from "@/lib/format";

export type FieldType = "text" | "textarea" | "number" | "select" | "boolean" | "tags" | "json";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  optionPairs?: { value: string; label: string }[];
  full?: boolean;
  placeholder?: string;
}

type Table = "packages" | "destinations" | "blogs";

export function AdminCrud({
  table,
  title,
  fields,
  columns,
}: {
  table: Table;
  title: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
}) {
  const ready = useRequireAdmin();
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const del = useServerFn(adminDelete);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: () => list({ data: { token: getAdminToken() ?? "", table } }),
    enabled: ready,
  });

  const saveMut = useMutation({
    mutationFn: (v: { id?: string | null; values: Record<string, unknown> }) =>
      save({ data: { token: getAdminToken() ?? "", table, id: v.id, values: v.values } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      setOpen(false);
      setEditing(null);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { token: getAdminToken() ?? "", table, id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
  });

  if (!ready) return null;
  const rows = (data?.rows ?? []) as any[];

  function startNew() {
    setEditing({});
    setOpen(true);
  }
  function startEdit(row: any) {
    setEditing(row);
    setOpen(true);
  }

  return (
    <AdminShell>
      <AdminHeader
        title={title}
        subtitle={`${rows.length} items`}
        action={
          <button
            onClick={startNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus size={16} /> Add New
          </button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="p-3 font-medium">{c.label}</th>
              ))}
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className="p-3">{c.render ? c.render(row) : String(row[c.key] ?? "—")}</td>
                ))}
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startEdit(row)} className="rounded-lg p-2 hover:bg-muted" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this item?")) delMut.mutate(row.id); }}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground">No items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && editing && (
        <EditDrawer
          fields={fields}
          row={editing}
          saving={saveMut.isPending}
          error={saveMut.error instanceof Error ? saveMut.error.message : ""}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={(values) => saveMut.mutate({ id: editing.id ?? null, values })}
        />
      )}
    </AdminShell>
  );
}

function EditDrawer({
  fields,
  row,
  onClose,
  onSave,
  saving,
  error,
}: {
  fields: Field[];
  row: any;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void;
  saving: boolean;
  error: string;
}) {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const f of fields) {
      const v = row[f.name];
      if (f.type === "tags") init[f.name] = Array.isArray(v) ? v.join(", ") : "";
      else if (f.type === "json") init[f.name] = v ? JSON.stringify(v, null, 2) : "";
      else if (f.type === "boolean") init[f.name] = !!v;
      else init[f.name] = v ?? "";
    }
    return init;
  });
  const [jsonErr, setJsonErr] = useState("");

  function set(name: string, value: any) {
    setForm((p) => {
      const next = { ...p, [name]: value };
      if (name === "title" || name === "name") {
        const hasSlug = fields.some((f) => f.name === "slug");
        if (hasSlug && (!row.id || !p.slug)) next.slug = slugify(value);
      }
      return next;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setJsonErr("");
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = form[f.name];
      if (f.type === "tags") {
        values[f.name] = String(raw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.type === "number") {
        values[f.name] = raw === "" || raw == null ? null : Number(raw);
      } else if (f.type === "boolean") {
        values[f.name] = !!raw;
      } else if (f.type === "json") {
        if (!raw) { values[f.name] = null; continue; }
        try { values[f.name] = JSON.parse(raw); }
        catch { setJsonErr(`Invalid JSON in ${f.label}`); return; }
      } else {
        values[f.name] = raw === "" ? null : raw;
      }
    }
    onSave(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="flex h-full w-full max-w-2xl flex-col bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">{row.id ? "Edit" : "Add New"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-muted">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {(error || jsonErr) && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error || jsonErr}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.full || f.type === "textarea" || f.type === "json" ? "col-span-2" : "col-span-1"}>
                <label className="mb-1 block text-sm font-medium">{f.label}</label>
                {f.type === "textarea" || f.type === "json" ? (
                  <textarea
                    value={form[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    rows={f.type === "json" ? 8 : 3}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-primary"
                  >
                    <option value="">—</option>
                    {f.optionPairs
                      ? f.optionPairs.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
                      : f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "boolean" ? (
                  <label className="flex items-center gap-2 pt-1">
                    <input type="checkbox" checked={!!form[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
                    <span className="text-sm text-muted-foreground">Yes</span>
                  </label>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={form[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />} Save
          </button>
        </div>
      </form>
    </div>
  );
}
