import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, MessageCircle, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { packagesQuery, submitEnquiry } from "@/lib/public-data";
import { BRAND, waLink } from "@/lib/constants";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact TrailBuzz — Plan Your Journey" },
      { name: "description", content: "Get in touch with TrailBuzz to plan your North India travel or trekking experience." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: packages } = useQuery(packagesQuery);
  const [submitting, setSubmitting] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !email) { toast.error("Name and email are required."); return; }
    setSubmitting(true);
    try {
      const pkgId = String(fd.get("package_id") || "");
      const pkg = packages?.find((p) => p.id === pkgId);
      await submitEnquiry({
        name, email,
        phone: String(fd.get("phone") || ""),
        travel_date: String(fd.get("travel_date") || "") || null,
        num_travelers: Number(fd.get("num_travelers")) || null,
        message: String(fd.get("message") || ""),
        package_id: pkgId || null,
        package_name: pkg?.title ?? null,
        source: "contact_page",
      });
      toast.success("Thank you! We'll reach out within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="font-serif text-4xl">Let's Plan Your <span className="heading-accent">Journey</span></h1>
        <p className="mt-3 text-muted-foreground">Tell us your dream trip and our experts will craft it for you.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <InfoCard icon={Mail} title="Email" value={BRAND.email} href={`mailto:${BRAND.email}`} />
            <InfoCard icon={MessageCircle} title="WhatsApp" value={BRAND.whatsappDisplay} href={waLink()} />
            <InfoCard icon={MapPin} title="Location" value={BRAND.location} />
            <InfoCard icon={Clock} title="Office Hours" value="Mon–Sat, 9:00 AM – 7:00 PM IST" />
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-4 font-semibold text-white">
              <MessageCircle size={20} /> Quick Connect on WhatsApp
            </a>
          </div>

          <form onSubmit={handle} className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="name" label="Full Name *" required />
              <Field name="email" label="Email *" type="email" required />
              <Field name="phone" label="Phone *" />
              <div>
                <label className="mb-1 block text-sm font-medium">Interested Package</label>
                <select name="package_id" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                  <option value="">General Enquiry</option>
                  {(packages ?? []).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <Field name="travel_date" label="Travel Date" type="date" />
              <Field name="num_travelers" label="No. of Travelers" type="number" />
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea name="message" rows={4} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full bg-[#8f4e00]">
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {submitting ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, href }: { icon: any; title: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon size={20} /></span>
      <div>
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block">{inner}</a> : inner;
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input name={name} type={type} required={required} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
    </div>
  );
}
