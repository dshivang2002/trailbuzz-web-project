import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";
import type { Blog } from "@/lib/public-data";
import { formatDate } from "@/lib/format";

const FALLBACK =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

const CATEGORY_COLORS: Record<string, string> = {
  "Travel Tips": "bg-teal text-white",
  "Destination Guide": "bg-primary text-white",
  "Trek Report": "bg-accent text-charcoal",
  "Food & Culture": "bg-charcoal text-white",
};

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      to="/blogs/$slug"
      params={{ slug: blog.slug }}
      className="card-hover group flex flex-col overflow-hidden rounded-3xl bg-card"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={blog.cover_image || FALLBACK}
          alt={blog.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {blog.category && (
          <span
            className={`mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              CATEGORY_COLORS[blog.category] || "bg-muted text-foreground"
            }`}
          >
            {blog.category}
          </span>
        )}
        <h3 className="font-serif text-lg leading-snug">{blog.title}</h3>
        {blog.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
        )}
        <div className="mt-4 flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>{formatDate(blog.published_at)}</span>
          {blog.read_time_minutes != null && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> {blog.read_time_minutes} min
            </span>
          )}
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Read More <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
