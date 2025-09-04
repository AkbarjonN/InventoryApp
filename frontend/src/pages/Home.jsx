import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { inventories as invApi } from "../services/api";
import { AuthContext } from "../context/AuthContext.jsx";
import { LangContext } from "../context/LangContext.jsx";
import { toast } from "react-toastify";
import Toolbar from "../components/Toolbar.jsx";

export default function Home() {
  const { user, globalQuery } = useContext(AuthContext);
  const { t } = useContext(LangContext);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    tags: [],
    publicWrite: false,
  });

  const canWrite = user && (user.role === "admin" || user.role === "creator");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await invApi.list(globalQuery || undefined);
      setList(res.data);
    } catch {
      toast.error("Failed to load inventories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [globalQuery]);

  const filtered = useMemo(() => list, [list]);

  const toggle = (id) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const toggleAll = (checked) => {
    if (checked) setSelected(filtered.map((x) => x.id));
    else setSelected([]);
  };

  const openAdd = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      tags: [],
      publicWrite: false,
    });
    setModal(true);
  };
  const openEdit = () => {
    if (selected.length !== 1) return;
    const inv = list.find((x) => x.id === selected[0]);
    setForm({
      id: inv.id,
      name: inv.name || "",
      description: inv.description || "",
      tags: inv.tags || [],
      publicWrite: !!inv.publicWrite,
      version: inv.version,
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name required");
    try {
      if (form.id) {
        const { id, ...payload } = form;
        const res = await invApi.update(id, payload);
        setList((prev) => prev.map((x) => (x.id === id ? res.data : x)));
        toast.success("Inventory updated");
      } else {
        const res = await invApi.create(form);
        setList((prev) => [...prev, res.data]);
        toast.success("Inventory created");
      }
      setModal(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      await Promise.all(selected.map((id) => invApi.delete(id)));
      setList((prev) => prev.filter((x) => !selected.includes(x.id)));
      setSelected([]);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4>{t("inventories")}</h4>
        <Toolbar
          left={
            <>
              {canWrite && (
                <>
                  <button className="btn btn-success" onClick={openAdd}>
                    {t("addInventory")}
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={selected.length !== 1}
                    onClick={openEdit}
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={selected.length === 0}
                    onClick={removeSelected}
                  >
                    {t("delete")}
                  </button>
                </>
              )}
            </>
          }
          right={<></>}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => toggleAll(e.target.checked)}
                  checked={
                    selected.length > 0 && selected.length === filtered.length
                  }
                />{" "}
                {t("selectAll")}
              </th>
              <th>ID</th>
              <th>{t("title")}</th>
              <th>{t("description")}</th>
              <th>Tags</th>
              <th>Public</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-danger text-center">
                  {t("noInventories")}
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(inv.id)}
                      onChange={() => toggle(inv.id)}
                    />
                  </td>
                  <td>{inv.id}</td>
                  <td>{inv.name}</td>
                  <td>{inv.description}</td>
                  <td>
                    {(inv.tags || []).map((tg) => (
                      <span key={tg} className="badge-tag">
                        {tg}
                      </span>
                    ))}
                  </td>
                  <td>{inv.publicWrite ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to={`/inventories/${inv.id}`}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {form.id ? t("edit") : t("addInventory")}
                </h5>
                <button className="btn-close" onClick={() => setModal(false)} />
              </div>
              <div className="modal-body">
                <label className="form-label">{t("title")}</label>
                <input
                  className="form-control mb-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <label className="form-label">{t("description")}</label>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={!!form.publicWrite}
                    onChange={(e) =>
                      setForm({ ...form, publicWrite: e.target.checked })
                    }
                    id="pub"
                  />
                  <label className="form-check-label" htmlFor="pub">
                    {t("publicWrite")}
                  </label>
                </div>
                <label className="form-label">
                  {t("tags")} (comma separated)
                </label>
                <input
                  className="form-control"
                  value={(form.tags || []).join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModal(false)}
                >
                  {t("cancel")}
                </button>
                <button className="btn btn-primary" onClick={save}>
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
