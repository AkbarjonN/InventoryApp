
import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { LangContext } from "../context/LangContext.jsx";

export default function Navbar() {
  const { user, logout, globalQuery, setGlobalQuery } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { lang, setLang, t } = useContext(LangContext);
  const navigate = useNavigate();
  const loc = useLocation();

  const onSearch = (e) => {
    setGlobalQuery(e.target.value);
    if (loc.pathname !== "/") navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">{t("app")}</Link>
        <div className="d-flex align-items-center gap-2 ms-auto">
          <input
            placeholder={t("search")}
            className="form-control"
            style={{ width: 260 }}
            value={globalQuery}
            onChange={onSearch}
          />
          <select className="form-select" style={{ width: 120 }} value={lang} onChange={e => setLang(e.target.value)}>
            <option value="uz">Uzbek</option>
            <option value="en">English</option>
          </select>
          <select className="form-select" style={{ width: 120 }} value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">{t("light")}</option>
            <option value="dark">{t("dark")}</option>
          </select>
          {user ? (
            <>
              <span className="badge bg-secondary">{user.email} ({user.role})</span>
              <button className="btn btn-outline-danger" onClick={logout}>{t("logout")}</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary" to="/login">{t("login")}</Link>
              <Link className="btn btn-primary" to="/register">{t("register")}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
