import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

export type Package = Tables<"packages">;
export type Destination = Tables<"destinations">;
export type Blog = Tables<"blogs">;

export const destinationsQuery = queryOptions({
  queryKey: ["destinations"],
  queryFn: async (): Promise<Destination[]> => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const featuredDestinationsQuery = queryOptions({
  queryKey: ["destinations", "featured"],
  queryFn: async (): Promise<Destination[]> => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("status", "active")
      .eq("is_featured", true)
      .limit(6);
    if (error) throw error;
    return data ?? [];
  },
});

export function destinationBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["destination", slug],
    queryFn: async (): Promise<Destination | null> => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export const packagesQuery = queryOptions({
  queryKey: ["packages"],
  queryFn: async (): Promise<Package[]> => {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const featuredPackagesQuery = queryOptions({
  queryKey: ["packages", "featured"],
  queryFn: async (): Promise<Package[]> => {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("status", "active")
      .eq("is_featured", true)
      .limit(4);
    if (error) throw error;
    return data ?? [];
  },
});

export function packageBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["package", slug],
    queryFn: async (): Promise<Package | null> => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function packagesByDestinationQuery(destinationId: string) {
  return queryOptions({
    queryKey: ["packages", "destination", destinationId],
    queryFn: async (): Promise<Package[]> => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("status", "active")
        .eq("destination_id", destinationId);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export const blogsQuery = queryOptions({
  queryKey: ["blogs"],
  queryFn: async (): Promise<Blog[]> => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function blogBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["blog", slug],
    queryFn: async (): Promise<Blog | null> => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/* ---------------- Enquiry submission (public insert) ---------------- */

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  package_id?: string | null;
  package_name?: string | null;
  travel_date?: string | null;
  num_travelers?: number | null;
  message?: string | null;
  source?: string;
}

export async function submitEnquiry(input: EnquiryInput) {
  const { error } = await supabase.from("enquiries").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    package_id: input.package_id || null,
    package_name: input.package_name || null,
    travel_date: input.travel_date || null,
    num_travelers: input.num_travelers || null,
    message: input.message || null,
    source: input.source || "website",
  });
  if (error) throw error;
}

/* ---------------- Analytics (fire-and-forget) ---------------- */

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("tb_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("tb_session", id);
  }
  return id;
}

export function trackPageVisit(page: string) {
  if (typeof window === "undefined") return;
  void supabase
    .from("page_visits")
    .insert({
      page,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
    })
    .then(() => {});
}
