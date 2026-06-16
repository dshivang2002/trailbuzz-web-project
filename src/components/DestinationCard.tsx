import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/lib/public-data";

const FALLBACK =
  "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80";

export function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      to="/destinations/$slug"
      params={{ slug: dest.slug }}
      className="card-hover group relative block h-[340px] overflow-hidden rounded-3xl"
    >
      <img
        src={dest.cover_image || FALLBACK}
        alt={dest.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
      {dest.state && (
        <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {dest.state}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="font-serif text-2xl">{dest.name}</h3>
        {dest.short_description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/80">
            {dest.short_description}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
          Explore <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
