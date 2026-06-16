import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitEnquiry } from "@/lib/public-data";
import { BRAND, waLink } from "@/lib/constants";

interface EnquiryPrefill {
  packageId?: string | null;
  packageName?: string | null;
  source?: string;
}

interface EnquiryCtx {
  open: (prefill?: EnquiryPrefill) => void;
}

const Ctx = createContext<EnquiryCtx>({ open: () => {} });

export function useEnquiry() {
  return useContext(Ctx);
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<EnquiryPrefill>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const open = useCallback((p?: EnquiryPrefill) => {
    setPrefill(p ?? {});
    setDone(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      await submitEnquiry({
        name,
        email,
        phone: String(fd.get("phone") || ""),
        travel_date: String(fd.get("travel_date") || "") || null,
        num_travelers: Number(fd.get("num_travelers")) || null,
        message: String(fd.get("message") || ""),
        package_id: prefill.packageId ?? null,
        package_name: prefill.packageName ?? null,
        source: prefill.source ?? "enquiry_modal",
      });
      setDone(true);
    } catch (err) {
      toast.error("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl sm:p-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {done ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                  🎉
                </div>
                <h3 className="text-2xl">We'll reach out within 24 hours!</h3>
                <p className="mt-2 text-muted-foreground">
                  Thanks for your interest. Want a faster response?
                </p>
                <a
                  href={waLink(
                    prefill.packageName
                      ? `Hi TrailBuzz! I'm interested in ${prefill.packageName}. Please share more details.`
                      : undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-5"
                >
                  WhatsApp us now →
                </a>
              </div>
            ) : (
              <>
                <h3 className="text-2xl">
                  Plan your <span className="heading-accent">journey</span>
                </h3>
                {prefill.packageName && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enquiring about: <strong>{prefill.packageName}</strong>
                  </p>
                )}
                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field name="name" label="Full Name *" required />
                    <Field name="email" label="Email *" type="email" required />
                    <Field name="phone" label="Phone" />
                    <Field name="travel_date" label="Travel Date" type="date" />
                  </div>
                  <Field name="num_travelers" label="No. of Travelers" type="number" />
                  <div>
                    <label className="mb-1 block text-sm font-medium">Message</label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Tell us about your dream trip..."
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                    {submitting ? "Sending..." : "Submit Enquiry"}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Or WhatsApp us directly at {BRAND.whatsappDisplay}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
