import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Share2 } from "lucide-react";
import { blogBySlugQuery, blogsQuery } from "@/lib/public-data";
import { BlogCard } from "@/components/BlogCard";
import { formatDate } from "@/lib/format";
import { waLink } from "@/lib/constants";

export const Route = createFileRoute("/blogs/$slug")({ component: BlogDetail });

function BlogDetail() {
  const { slug } = useParams({ from: "/blogs/$slug" });
  const { data: blog, isLoading } = useQuery(blogBySlugQuery(slug));
  const { data: all } = useQuery(blogsQuery);

  if (isLoading) return <div className="pt-32 text-center text-muted-foreground">Loading…</div>;
  if (!blog)
    return (
      <div className="pt-32 text-center">
        <p className="text-muted-foreground">Story not found.</p>
        <Link to="/blogs" className="btn-primary mt-4">All Stories</Link>
      </div>
    );

  const related = (all ?? []).filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <article className="pt-20">
      <div className="relative h-[260px] overflow-hidden md:h-[400px]">
        <img src={blog.cover_image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"} alt={blog.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto -mt-12 max-w-3xl px-6 md:-mt-24">
        <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {blog.category && <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{blog.category}</span>}
            {blog.read_time_minutes != null && <span className="flex items-center gap-1"><Clock size={14} /> {blog.read_time_minutes} min</span>}
            <span>{formatDate(blog.published_at)}</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl md:text-4xl">{blog.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">By {blog.author}</p>
          <div className="prose prose-stone mt-6 max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.excerpt ?? ""}</p>` }} />
          <a href={waLink(`Check out this TrailBuzz story: ${blog.title}`)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white">
            <Share2 size={16} /> Share on WhatsApp
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mb-6 font-serif text-2xl">Related <span className="heading-accent">Stories</span></h2>
          <div className="grid gap-6 md:grid-cols-3">{related.map((b) => <BlogCard key={b.id} blog={b} />)}</div>
        </div>
      )}
    </article>
  );
}
