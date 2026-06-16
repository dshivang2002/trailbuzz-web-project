import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminCrud, type Field } from "@/components/AdminCrud";
import { destinationsQuery } from "@/lib/public-data";
import { PACKAGE_CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/packages")({
  head: () => ({ meta: [{ title: "Packages — TrailBuzz Admin" }] }),
  component: PackagesAdmin,
});

function PackagesAdmin() {
  const { data: destinations } = useQuery(destinationsQuery);
  const destPairs = (destinations ?? []).map((d) => ({ value: d.id, label: d.name }));

  const fields: Field[] = [
    { name: "title", label: "Title", type: "text" },
    { name: "slug", label: "Slug", type: "text" },
    { name: "destination_id", label: "Destination", type: "select", optionPairs: destPairs },
    { name: "category", label: "Category", type: "select", options: PACKAGE_CATEGORIES },
    { name: "difficulty", label: "Difficulty", type: "select", options: DIFFICULTIES },
    { name: "duration_days", label: "Days", type: "number" },
    { name: "duration_nights", label: "Nights", type: "number" },
    { name: "price_per_person", label: "Price / person (₹)", type: "number" },
    { name: "original_price", label: "Original Price (₹)", type: "number" },
    { name: "max_group_size", label: "Max Group Size", type: "number" },
    { name: "badge", label: "Badge", type: "text" },
    { name: "cover_image", label: "Cover Image URL", type: "text", full: true },
    { name: "short_description", label: "Short Description", type: "textarea" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "inclusions", label: "Inclusions (comma separated)", type: "tags" },
    { name: "exclusions", label: "Exclusions (comma separated)", type: "tags" },
    { name: "images", label: "Image URLs (comma separated)", type: "tags" },
    { name: "itinerary", label: "Itinerary (JSON array)", type: "json", placeholder: '[{"day":1,"title":"...","details":"..."}]' },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_best_seller", label: "Best Seller", type: "boolean" },
    { name: "status", label: "Status", type: "select", options: ["active", "inactive"] },
  ];

  return (
    <AdminCrud
      table="packages"
      title="Packages"
      fields={fields}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "price_per_person", label: "Price", render: (r) => formatINR(r.price_per_person) },
        { key: "status", label: "Status" },
        { key: "is_featured", label: "Featured", render: (r) => (r.is_featured ? "★" : "—") },
      ]}
    />
  );
}
