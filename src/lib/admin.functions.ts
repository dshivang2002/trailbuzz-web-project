import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  signAdminToken,
  verifyAdminToken,
  assertAdmin,
} from "./admin-auth.server";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function timingEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d: { username: string; password: string }) =>
    z.object({ username: z.string().min(1).max(120), password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const u = process.env.ADMIN_USERNAME || "";
    const p = process.env.ADMIN_PASSWORD || "";
    const ok =
      u.length > 0 &&
      p.length > 0 &&
      timingEqual(data.username, u) &&
      timingEqual(data.password, p);
    if (!ok) throw new Error("Invalid username or password");
    return { token: signAdminToken(data.username) };
  });

export const adminVerify = createServerFn({ method: "POST" })
  .validator((d: { token: string }) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => ({ valid: verifyAdminToken(data.token) }));

/* ---------------- Generic content listing ---------------- */

export const adminList = createServerFn({ method: "POST" })
  .validator((d: { token: string; table: string }) =>
    z
      .object({
        token: z.string(),
        table: z.enum(["packages", "destinations", "blogs", "enquiries"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const sb = await admin();
    const { data: rows, error } = await sb
      .from(data.table)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

/* ---------------- Save (create/update) ---------------- */

export const adminSave = createServerFn({ method: "POST" })
  .validator(
    (d: { token: string; table: string; id?: string | null; values: Record<string, unknown> }) =>
      z
        .object({
          token: z.string(),
          table: z.enum(["packages", "destinations", "blogs"]),
          id: z.string().nullable().optional(),
          values: z.record(z.string(), z.any()),
        })
        .parse(d),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const sb = await admin();
    const tbl = sb.from(data.table) as any;
    if (data.id) {
      const { error } = await tbl.update(data.values).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: inserted, error } = await tbl
      .insert(data.values)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted?.id };
  });

/* ---------------- Delete ---------------- */

export const adminDelete = createServerFn({ method: "POST" })
  .validator((d: { token: string; table: string; id: string }) =>
    z
      .object({
        token: z.string(),
        table: z.enum(["packages", "destinations", "blogs"]),
        id: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const sb = await admin();
    const { error } = await sb.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Enquiry status ---------------- */

export const adminUpdateEnquiryStatus = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; status: string }) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
        status: z.enum(["new", "contacted", "converted", "closed"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const sb = await admin();
    const { error } = await sb
      .from("enquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Analytics summary ---------------- */

export const adminAnalytics = createServerFn({ method: "POST" })
  .validator((d: { token: string }) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const sb = await admin();

    const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
    const since7 = new Date(Date.now() - 7 * 864e5).toISOString();
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const [pkg, dest, blog, enq, visits, enqRecent] = await Promise.all([
      sb.from("packages").select("id", { count: "exact", head: true }),
      sb.from("destinations").select("id", { count: "exact", head: true }),
      sb.from("blogs").select("id", { count: "exact", head: true }),
      sb.from("enquiries").select("id, source, status, created_at, name, package_name"),
      sb.from("page_visits").select("visited_at").gte("visited_at", since30),
      sb
        .from("enquiries")
        .select("id, name, package_name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const enquiries = enq.data ?? [];
    const visitRows = visits.data ?? [];

    const visitsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      visitsByDay[d] = 0;
    }
    for (const v of visitRows) {
      const d = (v.visited_at as string).slice(0, 10);
      if (d in visitsByDay) visitsByDay[d]++;
    }
    const visitsSeries = Object.entries(visitsByDay).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));

    const weekBuckets: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) weekBuckets[`W${6 - i}`] = 0;
    enquiries.forEach((e) => {
      const ageWeeks = Math.floor(
        (Date.now() - new Date(e.created_at as string).getTime()) / (7 * 864e5),
      );
      if (ageWeeks >= 0 && ageWeeks < 6) weekBuckets[`W${6 - ageWeeks}`]++;
    });
    const enquiriesByWeek = Object.entries(weekBuckets).map(([week, count]) => ({ week, count }));

    const sourceMap: Record<string, number> = {};
    enquiries.forEach((e) => {
      const s = (e.source as string) || "website";
      sourceMap[s] = (sourceMap[s] || 0) + 1;
    });
    const enquiriesBySource = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

    const newToday = enquiries.filter(
      (e) => new Date(e.created_at as string) >= startToday,
    ).length;
    const visits7 = visitRows.filter(
      (v) => new Date(v.visited_at as string).toISOString() >= since7,
    ).length;

    return {
      stats: {
        totalEnquiries: enquiries.length,
        newToday,
        totalPackages: pkg.count ?? 0,
        totalBlogs: blog.count ?? 0,
        totalDestinations: dest.count ?? 0,
        visits7,
      },
      visitsSeries,
      enquiriesByWeek,
      enquiriesBySource,
      recentEnquiries: enqRecent.data ?? [],
    };
  });