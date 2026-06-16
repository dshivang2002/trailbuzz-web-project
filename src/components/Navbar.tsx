import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEnquiry } from "./EnquiryContext";
import { BRAND } from "@/lib/constants";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/destinations", label: "Destinations" },
  { to: "/blogs", label: "Blogs" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useEnquiry();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || pathname !== "/"
          ? "bg-card/95 shadow-md backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="TrailBuzz logo" width={40} height={40} className="h-10 w-10" />
          <div className="leading-tight">
            <span
              className={`block font-serif text-xl font-bold ${
                scrolled || pathname !== "/" ? "text-primary" : "text-white"
              }`}
            >
              {BRAND.name}
            </span>
            <span
              className={`block text-[10px] tracking-widest ${
                scrolled || pathname !== "/" ? "text-muted-foreground" : "text-white/80"
              }`}
            >
              {BRAND.tagline.toUpperCase()}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => {
            const active =
              n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative text-sm font-medium transition-colors ${
                  scrolled || pathname !== "/"
                    ? active
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                    : active
                      ? "text-white"
                      : "text-white/85 hover:text-white"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => open({ source: "navbar" })}
            className="btn-primary hidden text-sm sm:inline-flex"
          >
            Enquire Now
          </button>
          <button
            className={`p-2 lg:hidden ${
              scrolled || pathname !== "/" ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => open({ source: "navbar" })}
              className="btn-primary mt-2"
            >
              Enquire Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
