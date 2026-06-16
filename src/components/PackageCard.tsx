import { Link } from "@tanstack/react-router";
import { Calendar, Users, MapPin } from "lucide-react";
import type { Package } from "@/lib/public-data";
import { formatINR } from "@/lib/format";
import { useEnquiry } from "./EnquiryContext";

const FALLBACK =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80";

export function PackageCard({ pkg }: { pkg: Package }) {
  const { open } = useEnquiry();
  const badge = pkg.badge || (pkg.is_best_seller ? "Best Seller" : null);
  const isBestSeller = pkg.is_best_seller || badge === "Best Seller";

  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-3xl bg-card">
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={pkg.cover_image || FALLBACK}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              isBestSeller ? "bg-accent" : "bg-teal"
            }`}
          >
            {badge}
          </span>
        )}
        {pkg.category && (
          <span className="absolute right-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {pkg.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg leading-snug text-foreground">{pkg.title}</h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {pkg.duration_days != null && (
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {pkg.duration_days}D/{pkg.duration_nights ?? Math.max(0, pkg.duration_days - 1)}N
            </span>
          )}
          {pkg.max_group_size != null && (
            <span className="flex items-center gap-1">
              <Users size={14} /> Up to {pkg.max_group_size}
            </span>
          )}
          {pkg.difficulty && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {pkg.difficulty}
            </span>
          )}
        </div>

        <div className="mt-4">
          <span className="text-xs text-muted-foreground">Starting from</span>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-primary">
              {formatINR(pkg.price_per_person)}
            </span>
            <span className="mb-0.5 text-xs text-muted-foreground">/person</span>
            {pkg.original_price != null && pkg.original_price > (pkg.price_per_person ?? 0) && (
              <span className="mb-0.5 text-xs text-muted-foreground line-through">
                {formatINR(pkg.original_price)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-2 pt-2">
          <Link
            to="/packages/$slug"
            params={{ slug: pkg.slug }}
            className="flex-1 rounded-full border-2 border-teal py-2 text-center text-sm font-semibold text-teal transition-colors hover:bg-teal hover:text-white"
          >
            View Details
          </Link>
          <button
            onClick={() =>
              open({ packageId: pkg.id, packageName: pkg.title, source: "package_card" })
            }
            className="btn-primary flex-1 text-sm"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
}
