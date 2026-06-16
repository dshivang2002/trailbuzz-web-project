import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Download } from "lucide-react";
import { AdminShell, AdminHeader } from "@/components/AdminShell";
import { useRequireAdmin, getAdminToken } from "@/lib/admin-client";
import { adminList, adminUpdateEnquiryStatus } from "@/lib/admin.functions";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({ meta: [{ title: "Enquiries — TrailBuzz Admin" }] }),
  component: Enquiries,
});

const statusColor: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  contacted: "bg-amber-500/15 text-amber-600",
  converted: "bg-emerald-500/15 text-emerald-600",
  closed: "bg-muted text-muted-foreground",
};

function Enquiries() {
  const ready = useRequireAdmin();
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const updateStatus = useServerFn(adminUpdateEnquiryStatus);
  const [filter, setFilter] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: () => list({ data: { token: getAdminToken() ?? "", table: "enquiries" } }),
    enabled: ready,
  });

  const mutation = useMutation({
    mutationFn: (v: { id: string; status: string }) =>
      updateStatus({ data: { token: getAdminToken() ?? "", id: v.id, status: v.status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] }),
  });

  if (!ready) return null;

  const rows = (data?.rows ?? []) as any[];
  const filtered = filter === "All" ? rows : rows.filter((r) => r.status === filter);

  function exportCsv() {
    const headers = ["Name", "Email", "Phone", "Package", "Travel Date", "Travelers", "Source", "Status", "Message", "Created"];
    const lines = filtered.map((r) =>
      [r.name, r.email, r.phone, r.package_name, r.travel_date, r.num_travelers, r.source, r.status, r.message, r.created_at]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trailbuzz-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell>
      <AdminHeader
        title="Enquiries"
        subtitle={`${rows.length} total`}
        action={
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download size={16} /> Export CSV
          </button>
        }
      />

      <div className="mb-4 flex gap-2">
        {["All", ...ENQUIRY_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm capitalize ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Contact</th>
              <th className="p-3 font-medium">Package</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-b last:border-0 align-top">
                <td className="p-3">
                  <div className="font-medium">{r.name}</div>
                  {r.message && <div className="mt-1 max-w-xs text-xs text-muted-foreground">{r.message}</div>}
                </td>
                <td className="p-3">
                  <div>{r.email}</div>
                  <div className="text-xs text-muted-foreground">{r.phone}</div>
                </td>
                <td className="p-3">{r.package_name || "—"}</td>
                <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">{formatDate(r.created_at)}</td>
                <td className="p-3">
                  <select
                    value={r.status}
                    onChange={(e) => mutation.mutate({ id: r.id, status: e.target.value })}
                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize outline-none ${statusColor[r.status] ?? ""}`}
                  >
                    {ENQUIRY_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No enquiries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
