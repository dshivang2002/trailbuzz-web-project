import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Inbox, Package, FileText, MapPin, Eye, TrendingUp } from "lucide-react";
import { AdminShell, AdminHeader } from "@/components/AdminShell";
import { useRequireAdmin, getAdminToken } from "@/lib/admin-client";
import { adminAnalytics } from "@/lib/admin.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — TrailBuzz Admin" }] }),
  component: Dashboard,
});

const PIE_COLORS = ["hsl(24 95% 53%)", "hsl(173 80% 40%)", "hsl(43 96% 56%)", "hsl(215 28% 47%)"];

function Dashboard() {
  const ready = useRequireAdmin();
  const analytics = useServerFn(adminAnalytics);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => analytics({ data: { token: getAdminToken() ?? "" } }),
    enabled: ready,
  });

  if (!ready) return null;

  const s = data?.stats;
  const cards = [
    { label: "Total Enquiries", value: s?.totalEnquiries, icon: Inbox, hint: `${s?.newToday ?? 0} new today` },
    { label: "Packages", value: s?.totalPackages, icon: Package },
    { label: "Destinations", value: s?.totalDestinations, icon: MapPin },
    { label: "Blogs", value: s?.totalBlogs, icon: FileText },
    { label: "Visits (7d)", value: s?.visits7, icon: Eye },
  ];

  return (
    <AdminShell>
      <AdminHeader title="Dashboard" subtitle="Overview of your platform performance" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon size={18} className="text-primary" />
            </div>
            <div className="mt-2 text-3xl font-bold">{isLoading ? "—" : c.value ?? 0}</div>
            {c.hint && <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp size={18} className="text-primary" /> Page Visits (30 days)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data?.visitsSeries ?? []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(24 95% 53%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-4 font-semibold">Enquiries by Source</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data?.enquiriesBySource ?? []}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
              >
                {(data?.enquiriesBySource ?? []).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Enquiries by Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.enquiriesByWeek ?? []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(173 80% 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-4 font-semibold">Recent Enquiries</h3>
          <div className="space-y-3">
            {(data?.recentEnquiries ?? []).map((e) => (
              <div key={e.id} className="border-b pb-2 last:border-0">
                <div className="text-sm font-medium">{e.name}</div>
                <div className="text-xs text-muted-foreground">
                  {e.package_name || "General"} · {formatDate(e.created_at as string)}
                </div>
              </div>
            ))}
            {!isLoading && (data?.recentEnquiries ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No enquiries yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
