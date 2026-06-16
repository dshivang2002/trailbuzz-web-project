import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { destinationsQuery } from "@/lib/public-data";
import { DestinationCard } from "@/components/DestinationCard";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { REGIONS } from "@/lib/constants";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Destinations — TrailBuzz" },
      { name: "description", content: "Discover India's soul — explore destinations across North India with TrailBuzz." },
    ],
  }),
  component: Destinations,
});

function Destinations() {
  const { data, isLoading } = useQuery(destinationsQuery);
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");

  const list = useMemo(() => {
    let r = data ?? [];
    if (q) r = r.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
    if (region !== "All") r = r.filter((d) => d.region === region || d.state === region);
    return r;
  }, [data, q, region]);

  return (
    <div>
      <PageHero
        title={<>Discover India's <span className="text-accent italic">Soul</span></>}
        subtitle="From Himalayan valleys to desert forts — find your next destination."
        image="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80"
      />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2 shadow-sm md:max-w-md">
          <Search size={18} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search destinations…" className="w-full bg-transparent text-sm outline-none" />
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...REGIONS].map((r) => (
            <button key={r} onClick={() => setRegion(r)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${region === r ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-secondary"}`}>{r}</button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[340px] animate-pulse rounded-3xl bg-muted" />)}
          {list.map((d, i) => <Reveal key={d.id} delay={i * 40}><DestinationCard dest={d} /></Reveal>)}
          {!isLoading && list.length === 0 && <div className="col-span-full rounded-3xl border border-dashed py-16 text-center text-muted-foreground">No destinations found.</div>}
        </div>
      </div>
    </div>
  );
}
