import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud, type Field } from "@/components/AdminCrud";
import { BLOG_CATEGORIES } from "@/lib/constants";

export const Route = createFileRoute("/admin/blogs")({
  head: () => ({ meta: [{ title: "Blogs — TrailBuzz Admin" }] }),
  component: BlogsAdmin,
});

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "category", label: "Category", type: "select", options: BLOG_CATEGORIES },
  { name: "author", label: "Author", type: "text" },
  { name: "read_time_minutes", label: "Read Time (min)", type: "number" },
  { name: "cover_image", label: "Cover Image URL", type: "text", full: true },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content", type: "textarea" },
  { name: "tags", label: "Tags (comma separated)", type: "tags" },
  { name: "is_featured", label: "Featured", type: "boolean" },
  { name: "status", label: "Status", type: "select", options: ["published", "draft"] },
];

function BlogsAdmin() {
  return (
    <AdminCrud
      table="blogs"
      title="Blogs"
      fields={fields}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "author", label: "Author" },
        { key: "status", label: "Status" },
        { key: "is_featured", label: "Featured", render: (r) => (r.is_featured ? "★" : "—") },
      ]}
    />
  );
}
