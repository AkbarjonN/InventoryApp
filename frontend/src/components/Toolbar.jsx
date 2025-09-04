import React from "react";

export default function Toolbar({ left, right }) {
  return (
    <div className="toolbar mb-2">
      <div className="d-flex gap-2">{left}</div>
      <div className="ms-auto d-flex gap-2">{right}</div>
    </div>
  );
}
