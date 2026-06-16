export const BRAND = {
  name: "TrailBuzz",
  tagline: "Vignettes of India",
  whatsappNumber: "919198476606",
  whatsappDisplay: "+91 9198476606",
  email: "dshivang1004@gmail.com",
  location: "Delhi NCR / Panipat, Haryana",
} as const;

export function waLink(text?: string) {
  const msg =
    text ?? "Hi TrailBuzz! I'm interested in a travel package.";
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export const PACKAGE_CATEGORIES = [
  "Adventure",
  "Heritage",
  "Wildlife",
  "Wellness",
  "Pilgrimage",
] as const;

export const DIFFICULTIES = ["Easy", "Moderate", "Challenging"] as const;

export const BLOG_CATEGORIES = [
  "Travel Tips",
  "Destination Guide",
  "Trek Report",
  "Food & Culture",
] as const;

export const REGIONS = [
  "North India",
  "Uttarakhand",
  "Himachal",
  "Rajasthan",
  "Kashmir",
  "UP/Bihar",
] as const;

export const ENQUIRY_STATUSES = ["new", "contacted", "converted", "closed"] as const;
