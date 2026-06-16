import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  ShieldCheck,
  Map,
  HeartHandshake,
} from "lucide-react";
import {
  featuredDestinationsQuery,
  featuredPackagesQuery,
  blogsQuery,
} from "@/lib/public-data";
import { PackageCard } from "@/components/PackageCard";
import { DestinationCard } from "@/components/DestinationCard";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import { useEnquiry } from "@/components/EnquiryContext";
import { waLink } from "@/lib/constants";

export const Route = createFileRoute("/")({ component: Home });

const HERO =
  "https://res.cloudinary.com/def2pozjw/image/upload/f_auto,q_auto/hero_cgbhle";

function Home() {
  const { open } = useEnquiry();
  const destinations = useQuery(featuredDestinationsQuery);
  const packages = useQuery(featuredPackagesQuery);
  const blogs = useQuery(blogsQuery);

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center">
        <img src={HERO} alt="India travel" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(45,45,45,0.85) 0%, rgba(45,45,45,0.5) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            ✦ Discover India's Soul
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Your Journey Through{" "}
            <span className="text-accent italic">India's</span> Hidden Vignettes
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            From the snow-capped peaks of Himachal to the ancient ghats of
            Varanasi — TrailBuzz curates transformative North India experiences.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/packages" className="btn-primary">
              Explore Packages <ArrowRight size={18} />
            </Link>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-charcoal"
            >
              View Destinations
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur md:grid-cols-4">
            {[
              ["500+", "Happy Travelers"],
              ["50+", "Curated Packages"],
              ["20+", "Destinations"],
              ["4.9★", "Avg Rating"],
            ].map(([v, l]) => (
              <div key={l} className="px-5 py-5 text-center text-white">
                <div className="font-serif text-2xl font-bold">{v}</div>
                <div className="text-xs text-white/75">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => open({ source: "hero" })}
          className="glass absolute bottom-10 right-6 hidden h-28 w-28 flex-col items-center justify-center rounded-full text-center text-sm font-semibold text-white transition-transform hover:scale-105 lg:flex"
        >
          Get Started
          <ArrowUpRight size={20} className="mt-1" />
        </button>
      </section>

      {/* FEATURED DESTINATIONS */}
      <Section>
        <SectionHead
          eyebrow="WANDER WIDELY"
          title={<>Explore India's <span className="heading-accent">Wonders</span></>}
          action={<Link to="/destinations" className="btn-outline-teal text-sm">All Destinations</Link>}
        />
        <div className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
          {(destinations.data ?? []).map((d, i) => (
            <Reveal key={d.id} delay={i * 60} className="w-72 shrink-0 md:w-auto">
              <DestinationCard dest={d} />
            </Reveal>
          ))}
          {destinations.isLoading && <SkeletonRow tall />}
          {!destinations.isLoading && (destinations.data ?? []).length === 0 && (
            <Empty text="Featured destinations coming soon." />
          )}
        </div>
      </Section>

      {/* POPULAR PACKAGES */}
      <Section muted>
        <SectionHead
          eyebrow="HANDPICKED FOR YOU"
          title={<>Our Signature <span className="heading-accent">Journeys</span></>}
          action={<Link to="/packages" className="btn-outline-teal text-sm">View All</Link>}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(packages.data ?? []).map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <PackageCard pkg={p} />
            </Reveal>
          ))}
          {packages.isLoading && <SkeletonRow />}
          {!packages.isLoading && (packages.data ?? []).length === 0 && (
            <Empty text="Signature packages coming soon." />
          )}
        </div>
      </Section>

      {/* WHY TRAILBUZZ */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm1MbKfx8h67CxGjBFAGo7hfntvoEtr6WlFO0OD3ujNBV1ldbRj29FpqBRdQ2_JLGys_4rX1rN4BDHbj5mRlWnPKqixl5KncjN0HWcwfNJ1EFBv4-hf2GO1A3y0Ie4U6k6ICLQXrleWPZUk-d06SiSPgtlnO143nGILjNcCsgCAplWBp5ubifcWlkoPC2mCnEvR5xZffiSXDFffrKSHDUSbHq5YsA4Uw3FGWZWzqL299T8n4y4WtG_y9_7A4ywS83Ok-o5z-72HiLk"
              alt="Curated trails"
              loading="lazy"
              className="h-[550px] w-full rounded-3xl overflow-hidden"
            />
            <div className="absolute -bottom-6 -right-2 sm:right-6 rounded-2xl px-5 py-4 shadow-xl w-48"
  style={{
    background: 'rgba(255, 248, 235, 0.45)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
  }}>
  
  {/* Header */}
  <div className="flex items-center gap-1.5 mb-2">
    <span style={{color: '#C6973F'}} className="text-xxxs">⚡</span>
    <span className="text-amber-800 text-[16px] font-semibold tracking-wide">24/7 Support</span>
  </div>

  {/* Quote */}
  <div className="font-serif text-sm font-semibold text-stone-800 leading-snug mb-1">
    "Every detail was handled with grace.
  </div>
  <div className="text-[13px] text-stone-00 leading-snug">
    Truly the only way to see Bharat."
  </div>

</div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-sm font-semibold tracking-widest text-teal">WHY CHOOSE US</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Travel that feels <span className="heading-accent">personal</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              We don't do cookie-cutter tours. Every TrailBuzz journey is
              hand-crafted by local experts who know the hidden corners,
              the best seasons, and the stories behind every trail.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["500+", "Travelers"],
                ["50+", "Packages"],
                ["20+", "Destinations"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-sand p-4 text-center">
                  <div className="font-serif text-2xl font-bold text-primary">{v}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              {[
                [ShieldCheck, "Trusted local guides & safe itineraries"],
                [Map, "Off-beat routes beyond the tourist trail"],
                [HeartHandshake, "24/7 support before & during your trip"],
              ].map(([Icon, t], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm">{t as string}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* BLOG PREVIEW */}
      <Section muted>
        <SectionHead
          eyebrow="FROM OUR JOURNAL"
          title={<>Stories from the <span className="heading-accent">Trail</span></>}
          action={<Link to="/blogs" className="btn-outline-teal text-sm">Read Blog</Link>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {(blogs.data ?? []).slice(0, 3).map((b, i) => (
            <Reveal key={b.id} delay={i * 60}>
              <BlogCard blog={b} />
            </Reveal>
          ))}
          {blogs.isLoading && <SkeletonRow />}
          {!blogs.isLoading && (blogs.data ?? []).length === 0 && (
            <Empty text="Travel stories coming soon." />
          )}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <section className="bg-charcoal py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-serif text-3xl md:text-4xl">
            What Our <span className="heading-accent">Travelers</span> Say
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["Aarav & Meera", "Kashmir Paradise", "The most seamless trip we've ever taken. Every detail was handled — we just had to soak in the views."],
              ["Priya Nair", "Rishikesh Retreat", "TrailBuzz found us a riverside stay no website lists. Truly off the beaten path."],
              ["Rohit Sharma", "Manali Adventure", "Our guide felt like a friend. The trek was challenging and unforgettable."],
            ].map(([name, trip, quote]) => (
              <Reveal key={name} className="rounded-3xl bg-white/5 p-6">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/85">"{quote}"</p>
                <div className="mt-4">
                  <div className="font-semibold">{name}</div>
                  <div className="text-xs text-white/60">{trip}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
     <div className="px-4 py-6 md:px-8 md:py-10">
  <section className="relative py-24 px-6 overflow-hidden rounded-[2.5rem]">

    {/* Dark background with subtle pattern */}
    <div className="absolute inset-0 bg-[#2a2a2a] rounded-[2.5rem]">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpV9noBiunRaT2E-k4oIGdv4BndphrGwWDACT0OlVxSxt9mYbZ6XIzFN3dad6nLde63NbmmMh0UVj9yuKse0cZojjENg3sSQE0oBL3h645zQscD_OmO2vEwdFM-_rDiu2OFytfMgkUdDpE1g4q7VFK93_fepiI4dnrfj4ViBaEqVkm81tHP2OnpBhsv1ZaWnUQBThKg0CQBHq3wyvouFtc4Wor5MdiQB_wewpKJdq9G_Eh75fsN2Z1X6ymIDCIZXFKJKFK3KkCNvJq"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-3xl mx-auto text-center">

      {/* Heading */}
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
        Ready for a journey beyond imagination?
      </h2>

      {/* Subtext */}
      <p className="text-gray-300 text-base md:text-lg mb-12">
        Consult with our luxury specialists to craft your bespoke Indian odyssey.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

        {/* Enquire Now */}
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-64 py-4 rounded-lg font-semibold text-white text-base tracking-wide text-center transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: '#B8710A' }}
        >
          Enquire Now
        </a>

        {/* Download Brochure */}
        <Link
          to="/contact"
          className="w-64 py-4 rounded-lg font-semibold text-white text-base tracking-wide text-center border border-gray-500 bg-transparent hover:bg-white/10 transition-all active:scale-95"
        >
          Download Brochure
        </Link>

      </div>
    </div>

  </section>
</div>
    </div>
  );
}

function Section({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <section className={muted ? "bg-sand/40 py-16 md:py-20" : "py-16 md:py-20"}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold tracking-widest text-teal">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SkeletonRow({ tall }: { tall?: boolean }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-3xl bg-muted ${tall ? "h-[340px]" : "h-[360px]"}`}
        />
      ))}
    </>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="col-span-full rounded-3xl border border-dashed border-border py-12 text-center text-muted-foreground">
      {text}
    </div>
  );
}
