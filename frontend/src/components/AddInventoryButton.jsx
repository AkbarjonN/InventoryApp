
import React from "react";

export default function AddInventoryButton() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !["admin", "creator"].includes(user.role)) return null;

  return (
    <button className="btn btn-primary">
      + Add Inventory
    </button>
  );
}
