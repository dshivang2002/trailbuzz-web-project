import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, X, Phone, Mail, ChevronDown } from "lucide-react";
import { packageBySlugQuery } from "@/lib/public-data";
import { formatINR } from "@/lib/format";
import { useEnquiry } from "@/components/EnquiryContext";
import { BRAND, waLink } from "@/lib/constants";

export const Route = createFileRoute("/packages/$slug")({ component: PackageDetail });

const FALLBACK = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80";

function PackageDetail() {
  const { slug } = useParams({ from: "/packages/$slug" });
  const { data: pkg, isLoading } = useQuery(packageBySlugQuery(slug));
  const { open } = useEnquiry();
  const [travelers, setTravelers] = useState(2);
  const [date, setDate] = useState("");
  const [openDay, setOpenDay] = useState<number | null>(0);

  if (isLoading) return <div className="pt-32 text-center text-muted-foreground">Loading…</div>;
  if (!pkg)
    return (
      <div className="pt-32 text-center">
        <p className="text-muted-foreground">Package not found.</p>
        <Link to="/packages" className="btn-primary mt-4">Browse Packages</Link>
      </div>
    );

  const images = (pkg.images && pkg.images.length ? pkg.images : [pkg.cover_image || FALLBACK]).slice(0, 5);
  const itinerary = (pkg.itinerary as { day: number; title: string; description: string }[] | null) ?? [];
  const base = pkg.price_per_person ?? 0;
  const subtotal = base * travelers;
  const serviceFee = Math.round(subtotal * 0.03);
  const gst = Math.round((subtotal + serviceFee) * 0.05);
  const total = subtotal + serviceFee + gst;

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> ›{" "}
          <Link to="/packages" className="hover:text-primary">Packages</Link> ›{" "}
          <span className="text-foreground">{pkg.title}</span>
        </nav>

        {/* Gallery */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <img src={images[0]} alt={pkg.title} className="h-[360px] w-full rounded-3xl object-cover md:h-[440px]" />
          <div className="grid grid-cols-2 gap-3">
            {images.slice(1, 5).map((img, i) => (
              <img key={i} src={img} alt="" className="h-[176px] w-full rounded-2xl object-cover md:h-[212px]" />
            ))}
            {images.length < 2 && <div className="rounded-2xl bg-muted" />}
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              {pkg.badge && <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-charcoal">{pkg.badge}</span>}
              {pkg.category && <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{pkg.category}</span>}
              {pkg.duration_days != null && (
                <span className="rounded-full bg-muted px-3 py-1 text-xs">{pkg.duration_days}D / {pkg.duration_nights ?? pkg.duration_days - 1}N</span>
              )}
              {pkg.difficulty && <span className="rounded-full bg-muted px-3 py-1 text-xs">{pkg.difficulty}</span>}
            </div>
            <h1 className="mt-3 font-serif text-3xl md:text-4xl">{pkg.title}</h1>

            <p className="mt-5 leading-relaxed text-muted-foreground">{pkg.description || pkg.short_description}</p>

            {itinerary.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl">Day-by-Day <span className="heading-accent">Journey</span></h2>
                <div className="mt-4 space-y-3">
                  {itinerary.map((d, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border">
                      <button
                        onClick={() => setOpenDay(openDay === i ? null : i)}
                        className="flex w-full items-center justify-between gap-3 bg-card px-5 py-4 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{d.day ?? i + 1}</span>
                          <span className="font-semibold">{d.title}</span>
                        </span>
                        <ChevronDown size={18} className={`transition-transform ${openDay === i ? "rotate-180" : ""}`} />
                      </button>
                      {openDay === i && <div className="bg-sand/40 px-5 py-4 text-sm text-muted-foreground">{d.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <div className="rounded-2xl bg-card p-5 shadow-sm">
                  <h3 className="font-serif text-lg">Inclusions</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {pkg.inclusions.map((it, i) => (
                      <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-teal" />{it}</li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <div className="rounded-2xl bg-card p-5 shadow-sm">
                  <h3 className="font-serif text-lg">Exclusions</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {pkg.exclusions.map((it, i) => (
                      <li key={i} className="flex gap-2"><X size={16} className="mt-0.5 shrink-0 text-destructive" />{it}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right — sticky booking */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Starting from</span>
                  <div className="text-2xl font-bold text-primary">{formatINR(base)}<span className="text-sm font-normal text-muted-foreground">/person</span></div>
                </div>
                <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">Best Price</span>
              </div>

              <label className="mt-5 block text-sm font-medium">Travel Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />

              <label className="mt-4 block text-sm font-medium">Travelers</label>
              <div className="mt-1 flex items-center justify-between rounded-xl border border-input px-3 py-2">
                <button onClick={() => setTravelers((t) => Math.max(1, t - 1))} className="h-7 w-7 rounded-full bg-muted">−</button>
                <span className="font-semibold">{travelers} {travelers === 1 ? "Person" : "Persons"}</span>
                <button onClick={() => setTravelers((t) => t + 1)} className="h-7 w-7 rounded-full bg-muted">+</button>
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <Row label={`Package × ${travelers}`} value={formatINR(subtotal)} />
                <Row label="Service Fee" value={formatINR(serviceFee)} />
                <Row label="GST (5%)" value={formatINR(gst)} />
                <div className="flex justify-between border-t border-border pt-2 font-bold">
                  <span>Total</span><span className="text-primary">{formatINR(total)}</span>
                </div>
              </div>

              <button onClick={() => open({ packageId: pkg.id, packageName: pkg.title, source: "package_page" })} className="btn-primary mt-5 w-full">Enquire Now</button>
              <a href={waLink(`Hi TrailBuzz! I'm interested in ${pkg.title}. Please share more details.`)} target="_blank" rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-semibold text-white">Chat on WhatsApp</a>
              <p className="mt-3 text-center text-xs text-muted-foreground">No charges yet • Confirmation within 24hrs</p>

              <div className="mt-5 rounded-2xl bg-sand/50 p-4 text-sm">
                <p className="font-semibold">Need Help?</p>
                <a href={waLink()} className="mt-2 flex items-center gap-2 text-muted-foreground hover:text-primary"><Phone size={14} /> {BRAND.whatsappDisplay}</a>
                <a href={`mailto:${BRAND.email}`} className="mt-1 flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail size={14} /> {BRAND.email}</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span>{value}</span></div>;
}
