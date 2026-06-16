import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Facebook, Lock } from "lucide-react";
import { BRAND, waLink } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TrailBuzz" width={40} height={40} className="h-10 w-10" />
            <span className="font-serif text-xl font-bold text-primary">{BRAND.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            {BRAND.tagline}. Curating transformative North India travel and
            trekking experiences for the discerning explorer.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-primary"><Instagram size={18} /></a>
            <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-primary"><Facebook size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-lg text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/packages" className="hover:text-primary">Packages</Link></li>
            <li><Link to="/destinations" className="hover:text-primary">Destinations</Link></li>
            <li><Link to="/blogs" className="hover:text-primary">Blogs</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li>
              <Link to="/admin/login" className="inline-flex items-center gap-1 hover:text-primary">
                <Lock size={13} /> Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-lg text-white">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>Adventure & Trekking</li>
            <li>Heritage Tours</li>
            <li>Wellness Retreats</li>
            <li>Pilgrimage Journeys</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-lg text-white">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-primary">{BRAND.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {BRAND.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              {BRAND.location}
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 border-t border-white/10 py-5 text-center text-xs text-white/50 sm:flex-row sm:justify-center sm:gap-4">
        <span>© {new Date().getFullYear()} {BRAND.name} — {BRAND.tagline}. All rights reserved.</span>
      </div>
    </footer>
  );
}
