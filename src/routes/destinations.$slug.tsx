import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CloudSun, Navigation, Check } from "lucide-react";
import { destinationBySlugQuery, packagesByDestinationQuery } from "@/lib/public-data";
import { PackageCard } from "@/components/PackageCard";

export const Route = createFileRoute("/destinations/$slug")({ component: DestinationDetail });

const FALLBACK = "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80";

function DestinationDetail() {
  const { slug } = useParams({ from: "/destinations/$slug" });
  const { data: dest, isLoading } = useQuery(destinationBySlugQuery(slug));
  const { data: pkgs } = useQuery({ ...packagesByDestinationQuery(dest?.id ?? ""), enabled: !!dest?.id });

  if (isLoading) return <div className="pt-32 text-center text-muted-foreground">Loading…</div>;
  if (!dest)
    return (
      <div className="pt-32 text-center">
        <p className="text-muted-foreground">Destination not found.</p>
        <Link to="/destinations" className="btn-primary mt-4">All Destinations</Link>
      </div>
    );

  const images = (dest.images && dest.images.length ? dest.images : []).slice(0, 6);

  return (
    <div className="pt-20">
      <section className="relative flex h-[50vh] min-h-[340px] items-end overflow-hidden">
        <img src={dest.cover_image || FALLBACK} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(45,45,45,0.8), rgba(45,45,45,0.4))" }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 text-white">
          {dest.state && <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">{dest.state}</span>}
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{dest.name}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl">About <span className="heading-accent">{dest.name}</span></h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{dest.description || dest.short_description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {dest.best_time_to_visit && <Info icon={Calendar} label="Best Time" value={dest.best_time_to_visit} />}
              {dest.weather && <Info icon={CloudSun} label="Weather" value={dest.weather} />}
              {dest.how_to_reach && <Info icon={Navigation} label="How to Reach" value={dest.how_to_reach} />}
            </div>

            {images.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                {images.map((img, i) => <img key={i} src={img} alt="" className="h-40 w-full rounded-2xl object-cover" />)}
              </div>
            )}
          </div>

          {dest.highlights && dest.highlights.length > 0 && (
            <aside>
              <div className="rounded-3xl bg-sand/50 p-6">
                <h3 className="font-serif text-lg">Highlights</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {dest.highlights.map((h, i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" />{h}</li>)}
                </ul>
              </div>
            </aside>
          )}
        </div>

        {pkgs && pkgs.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 font-serif text-2xl">Packages for <span className="heading-accent">{dest.name}</span></h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pkgs.map((p) => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <Icon size={18} className="text-primary" />
      <div className="mt-2 text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
