import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      nav("/", { replace: true });
    } else {
      nav("/login?err=oauth", { replace: true });
    }
  }, [nav]);

  return <div>Signing you in…</div>;
}
