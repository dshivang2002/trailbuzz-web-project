import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Map, HeartHandshake, Compass } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { useEnquiry } from "@/components/EnquiryContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TrailBuzz — Vignettes of India" },
      { name: "description", content: "TrailBuzz is a premium North India travel and trekking platform crafting transformative journeys." },
    ],
  }),
  component: About,
});

function About() {
  const { open } = useEnquiry();
  return (
    <div>
      <PageHero title={<>Our <span className="text-accent italic">Story</span></>} subtitle="Crafting transformative North India journeys, one trail at a time."
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80" />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal><img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=900&q=80" alt="TrailBuzz" className="h-[420px] w-full rounded-3xl object-cover" /></Reveal>
          <Reveal delay={120}>
            <p className="text-sm font-semibold tracking-widest text-teal">WHO WE ARE</p>
            <h2 className="mt-3 font-serif text-3xl">Travel as a <span className="heading-accent">vignette</span></h2>
            <p className="mt-4 text-muted-foreground">TrailBuzz was born from a simple belief — that the best of India lives in its quiet, hidden moments. For over five years we've curated journeys across Himachal, Uttarakhand, Kashmir, Rajasthan and beyond, blending comfort with authenticity.</p>
            <p className="mt-3 text-muted-foreground">From snow-capped peaks to ancient ghats, every itinerary is designed by local experts who travel these trails themselves.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-serif text-3xl">Why <span className="heading-accent">TrailBuzz</span></h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[[ShieldCheck, "Safe & Trusted", "Vetted guides and safety-first itineraries."], [Map, "Off-beat Routes", "Experiences beyond the tourist trail."], [HeartHandshake, "24/7 Support", "We're with you before and during your trip."], [Compass, "Local Expertise", "Crafted by people who know the land."]].map(([Icon, t, d], i) => (
              <Reveal key={i} delay={i * 60} className="rounded-3xl bg-card p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon size={22} /></span>
                <h3 className="mt-4 font-serif text-lg">{t as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {[["500+", "Happy Travelers"], ["50+", "Packages"], ["5+", "Years"], ["20+", "Destinations"]].map(([v, l]) => (
            <div key={l} className="rounded-3xl bg-card p-6 text-center shadow-sm">
              <div className="font-serif text-3xl font-bold text-primary">{v}</div>
              <div className="text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="font-serif text-3xl">Ready to <span className="heading-accent">Explore?</span></h2>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => open({ source: "about" })} className="btn-primary">Enquire Now</button>
          <Link to="/packages" className="btn-outline-teal">View Packages</Link>
        </div>
      </section>
    </div>
  );
}
