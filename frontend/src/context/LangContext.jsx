import React, { createContext, useState } from "react";
import { dict } from "../i18n";

export const LangContext = createContext();

export function LangProvider({ children }) {
  const initial = localStorage.getItem("lang") || "uz";
  const [lang, setLang] = useState(initial);

  const t = (key) => dict[lang][key] ?? key;

  const change = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, t, setLang: change }}>
      {children}
    </LangContext.Provider>
  );
}
