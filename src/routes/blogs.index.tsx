import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogsQuery } from "@/lib/public-data";
import { BlogCard } from "@/components/BlogCard";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Travel Blog — Stories from the Trail | TrailBuzz" },
      { name: "description", content: "Travel tips, destination guides and trek reports from across North India." },
    ],
  }),
  component: Blogs,
});

function Blogs() {
  const { data, isLoading } = useQuery(blogsQuery);
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    let r = data ?? [];
    if (cat !== "All") r = r.filter((b) => b.category === cat);
    return r;
  }, [data, cat]);

  const featured = filtered.find((b) => b.is_featured) ?? filtered[0];
  const rest = filtered.filter((b) => b.id !== featured?.id);

  return (
    <div>
      <PageHero
        title={<>Stories from the <span className="text-accent italic">Trail</span></>}
        subtitle="Guides, tips and tales to fuel your next North India adventure."
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
      />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...BLOG_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? "bg-primary text-white" : "bg-muted hover:bg-secondary"}`}>{c}</button>
          ))}
        </div>

        {isLoading && <div className="h-64 animate-pulse rounded-3xl bg-muted" />}

        {featured && (
          <Link to="/blogs/$slug" params={{ slug: featured.slug }} className="card-hover mb-10 grid overflow-hidden rounded-3xl bg-card md:grid-cols-2">
            <img src={featured.cover_image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80"} alt={featured.title} className="h-64 w-full object-cover md:h-full" />
            <div className="flex flex-col justify-center p-8">
              {featured.category && <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-charcoal">{featured.category}</span>}
              <h2 className="mt-3 font-serif text-2xl md:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <span className="mt-4 text-sm text-muted-foreground">{featured.author} • {formatDate(featured.published_at)}</span>
            </div>
          </Link>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {rest.map((b, i) => <Reveal key={b.id} delay={i * 40}><BlogCard blog={b} /></Reveal>)}
        </div>
        {!isLoading && filtered.length === 0 && <div className="rounded-3xl border border-dashed py-16 text-center text-muted-foreground">No stories yet.</div>}
      </div>
    </div>
  );
}
