import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud, type Field } from "@/components/AdminCrud";
import { REGIONS } from "@/lib/constants";

export const Route = createFileRoute("/admin/destinations")({
  head: () => ({ meta: [{ title: "Destinations — TrailBuzz Admin" }] }),
  component: DestinationsAdmin,
});

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "region", label: "Region", type: "select", options: REGIONS },
  { name: "best_time_to_visit", label: "Best Time to Visit", type: "text" },
  { name: "weather", label: "Weather", type: "text" },
  { name: "cover_image", label: "Cover Image URL", type: "text", full: true },
  { name: "short_description", label: "Short Description", type: "textarea" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "how_to_reach", label: "How to Reach", type: "textarea" },
  { name: "highlights", label: "Highlights (comma separated)", type: "tags" },
  { name: "images", label: "Image URLs (comma separated)", type: "tags" },
  { name: "is_featured", label: "Featured", type: "boolean" },
  { name: "status", label: "Status", type: "select", options: ["active", "inactive"] },
];

function DestinationsAdmin() {
  return (
    <AdminCrud
      table="destinations"
      title="Destinations"
      fields={fields}
      columns={[
        { key: "name", label: "Name" },
        { key: "state", label: "State" },
        { key: "region", label: "Region" },
        { key: "status", label: "Status" },
        { key: "is_featured", label: "Featured", render: (r) => (r.is_featured ? "★" : "—") },
      ]}
    />
  );
}
