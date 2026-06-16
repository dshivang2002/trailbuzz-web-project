import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tb_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("tb_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("tb_admin_token");
}

export function useRequireAdmin() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getAdminToken()) {
      navigate({ to: "/admin/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);
  return ready;
}

export { useServerFn };
