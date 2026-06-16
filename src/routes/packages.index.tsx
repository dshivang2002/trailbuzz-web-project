import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { packagesQuery } from "@/lib/public-data";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { PACKAGE_CATEGORIES, DIFFICULTIES } from "@/lib/constants";

export const Route = createFileRoute("/packages/")({
  head: () => ({
    meta: [
      { title: "Travel & Trek Packages — TrailBuzz" },
      { name: "description", content: "Browse curated North India travel and trekking packages by category, duration and difficulty." },
    ],
  }),
  component: Packages,
});

function Packages() {
  const { data, isLoading } = useQuery(packagesQuery);
  const [cat, setCat] = useState("All");
  const [diff, setDiff] = useState("All");
  const [dur, setDur] = useState("All");
  const [sort, setSort] = useState("popular");

  const list = useMemo(() => {
    let r = [...(data ?? [])];
    if (cat !== "All") r = r.filter((p) => p.category === cat);
    if (diff !== "All") r = r.filter((p) => p.difficulty === diff);
    if (dur !== "All") {
      r = r.filter((p) => {
        const d = p.duration_days ?? 0;
        if (dur === "1-3") return d <= 3;
        if (dur === "4-7") return d >= 4 && d <= 7;
        return d >= 8;
      });
    }
    if (sort === "low") r.sort((a, b) => (a.price_per_person ?? 0) - (b.price_per_person ?? 0));
    if (sort === "high") r.sort((a, b) => (b.price_per_person ?? 0) - (a.price_per_person ?? 0));
    if (sort === "popular") r.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return r;
  }, [data, cat, diff, dur, sort]);

  return (
    <div>
      <PageHero
        title={<>Curated <span className="text-accent italic">Journeys</span></>}
        subtitle="Hand-crafted experiences across North India — pick your pace and theme."
        image="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1920&q=80"
      />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Select label="Category" value={cat} onChange={setCat} options={["All", ...PACKAGE_CATEGORIES]} />
          <Select label="Difficulty" value={diff} onChange={setDiff} options={["All", ...DIFFICULTIES]} />
          <Select label="Duration" value={dur} onChange={setDur} options={["All", "1-3", "4-7", "8+"]} />
          <Select label="Sort" value={sort} onChange={setSort} options={["popular", "low", "high"]}
            display={(v) => ({ popular: "Most Popular", low: "Price: Low-High", high: "Price: High-Low" }[v] ?? v)} />
          <span className="ml-auto text-sm text-muted-foreground">{list.length} packages</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[360px] animate-pulse rounded-3xl bg-muted" />
            ))}
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 40}>
              <PackageCard pkg={p} />
            </Reveal>
          ))}
          {!isLoading && list.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed py-16 text-center text-muted-foreground">
              No packages match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  display,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  display?: (v: string) => string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-input bg-background px-3 py-1.5 outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o} value={o}>{display ? display(o) : o}</option>
        ))}
      </select>
    </label>
  );
}
