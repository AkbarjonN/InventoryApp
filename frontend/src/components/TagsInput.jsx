import React, { useEffect, useState } from "react";
import { tags as tagApi } from "../services/api";

export default function TagsInput({ value = [], onChange, label = "Tags" }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!query) return setSuggestions([]);
      try {
        const res = await tagApi.search(query);
        if (active) setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    };
    load();
    return () => { active = false; };
  }, [query]);

  const add = (tag) => {
    if (!value.includes(tag)) onChange([...value, tag]);
    setQuery("");
    setSuggestions([]);
  };

  const remove = (tag) => onChange(value.filter(t => t !== tag));

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="d-flex flex-wrap mb-2">
        {value.map((t) => (
          <span key={t} className="badge-tag">
            {t}{" "}
            <button className="btn btn-sm btn-link p-0" onClick={() => remove(t)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="form-control"
        placeholder="Type tag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="list-group">
          {suggestions.map((s) => (
            <button key={s} type="button" className="list-group-item list-group-item-action" onClick={() => add(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
