import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
 
const env = loadEnv("development", process.cwd(), "");
 
export default defineConfig({
  tanstackStart: {
    server: {  allowedHosts: ["trailbuzz-web-project.onrender.com"] },
  },
  nitro: { preset: "vercel" },
  vite: {
    define: {
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "process.env.SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(env.SUPABASE_SERVICE_ROLE_KEY),
      "process.env.ADMIN_USERNAME": JSON.stringify(env.ADMIN_USERNAME),
      "process.env.ADMIN_PASSWORD": JSON.stringify(env.ADMIN_PASSWORD),
      "process.env.ADMIN_JWT_SECRET": JSON.stringify(env.ADMIN_JWT_SECRET),
    },
  },
});
 