import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  items as itemApi,
  inventories as invApi,
  posts as postApi,
} from "../services/api";
import { AuthContext } from "../context/AuthContext.jsx";
import { LangContext } from "../context/LangContext.jsx";
import Toolbar from "../components/Toolbar.jsx";
import { toast } from "react-toastify";
import { useSocket } from "../hooks/useSocket";
import useDebouncedEffect from "../hooks/useDebouncedEffect";
import TagsInput from "../components/TagsInput.jsx";

export default function Inventory() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useContext(LangContext);
  const socket = useSocket();
  const [tab, setTab] = useState("items");
  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [settings, setSettings] = useState({
    name: "",
    description: "",
    publicWrite: false,
    tags: [],
    version: 0,
  });
  const [settingsChanged, setSettingsChanged] = useState(false);
  const canOwner =
    user &&
    (user.role === "admin" || (inventory && inventory.userId === user.id));
  const canWrite =
    user &&
    (user.role === "admin" ||
      inventory?.publicWrite ||
      inventory?.writers?.some((u) => u.id === user.id) ||
      canOwner);
  const load = async () => {
    setLoading(true);
    try {
      const [invRes, listRes] = await Promise.all([
        invApi.get(id),
        itemApi.list(id),
      ]);
      setInventory(invRes.data);
      setItems(listRes.data);
      setSettings({
        name: invRes.data.name || "",
        description: invRes.data.description || "",
        publicWrite: !!invRes.data.publicWrite,
        tags: invRes.data.tags || [],
        version: invRes.data.version || 0,
      });
    } catch (err) {
      console.error("❌ Load error:", err);
      toast.error("Inventory not found");
      nav("/");
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await postApi.list(id);
      setPosts(res.data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
  }, [id]);
  useEffect(() => {
    if (tab === "discussion") loadPosts();
  }, [tab]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_inventory", id);
    socket.on("post_added", (p) => {
      if (p.inventoryId === Number(id)) setPosts((prev) => [...prev, p]);
    });
    socket.on("item_updated", (it) => {
      if (it.inventoryId === Number(id))
        setItems((prev) => prev.map((i) => (i.id === it.id ? it : i)));
    });
    socket.on("item_created", (it) => {
      if (it.inventoryId === Number(id)) setItems((prev) => [...prev, it]);
    });
    socket.on("item_deleted", (it) => {
      if (it.inventoryId === Number(id))
        setItems((prev) => prev.filter((x) => x.id !== it.id));
    });
    return () => {
      socket.off("post_added");
      socket.off("item_updated");
      socket.off("item_created");
      socket.off("item_deleted");
    };
  }, [socket, id]);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    quantity: 0,
    description: "",
  });

  const toggle = (itemId) => {
    setSel((s) =>
      s.includes(itemId) ? s.filter((x) => x !== itemId) : [...s, itemId]
    );
  };
  const toggleAll = (checked) => {
    if (checked) setSel(items.map((x) => x.id));
    else setSel([]);
  };

  const openAdd = () => {
    setForm({ id: null, name: "", quantity: 0, description: "" });
    setModal(true);
  };
  const openEdit = () => {
    if (sel.length !== 1) return;
    const it = items.find((x) => x.id === sel[0]);
    setForm(it);
    setModal(true);
  };
  const saveItem = async () => {
    if (!form.name.trim()) return toast.error("Item name required");
    try {
      if (form.id) {
        const res = await itemApi.update(id, form.id, form);
        setItems((prev) => prev.map((x) => (x.id === form.id ? res.data : x)));
        toast.success("Item updated");
      } else {
        const res = await itemApi.create(id, form);
        setItems((prev) => [...prev, res.data]);
        toast.success("Item created");
      }
      setModal(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };
  const deleteItems = async () => {
    if (sel.length === 0) return;
    if (!window.confirm("Delete selected items?")) return;
    try {
      await Promise.all(sel.map((x) => itemApi.delete(id, x)));
      setItems((prev) => prev.filter((x) => !sel.includes(x.id)));
      setSel([]);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };
  const sendPost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await postApi.create({ inventoryId: id, text: newPost });
      setPosts((p) => [...p, res.data]);
      setNewPost("");
    } catch {
      toast.error("Cannot post");
    }
  };
  useDebouncedEffect(
    () => {
      if (!settingsChanged) return;
      const run = async () => {
        try {
          const res = await invApi.update(id, settings);
          setSettings((s) => ({ ...s, version: res.data.version }));
          setSettingsChanged(false);
          toast.success("Auto-saved");
        } catch (e) {
          toast.error(e.response?.data?.message || "Auto-save failed");
        }
      };
      run();
    },
    [settings],
    1500
  );

  const setSett = (patch) => {
    setSettings((s) => ({ ...s, ...patch }));
    setSettingsChanged(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h4 className="mb-3">{inventory?.name}</h4>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "items" ? "active" : ""}`}
            onClick={() => setTab("items")}
          >
            {t("items")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "discussion" ? "active" : ""}`}
            onClick={() => setTab("discussion")}
          >
            {t("discussion")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "settings" ? "active" : ""}`}
            onClick={() => setTab("settings")}
            disabled={!canOwner}
          >
            {t("settings")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "access" ? "active" : ""}`}
            onClick={() => setTab("access")}
            disabled={!canOwner}
          >
            {t("access")}
          </button>
        </li>
      </ul>

      {tab === "items" && (
        <>
          <Toolbar
            left={
              <>
                {canWrite && (
                  <>
                    <button className="btn btn-success" onClick={openAdd}>
                      {t("addItem")}
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={sel.length !== 1}
                      onClick={openEdit}
                    >
                      {t("edit")}
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={sel.length === 0}
                      onClick={deleteItems}
                    >
                      {t("delete")}
                    </button>
                  </>
                )}
              </>
            }
            right={<></>}
          />
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => toggleAll(e.target.checked)}
                      checked={sel.length > 0 && sel.length === items.length}
                    />{" "}
                    {t("selectAll")}
                  </th>
                  <th>ID</th>
                  <th>{t("name")}</th>
                  <th>{t("quantity")}</th>
                  <th>{t("description")}</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-danger">
                      {t("noItems")}
                    </td>
                  </tr>
                ) : (
                  items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={sel.includes(it.id)}
                          onChange={() => toggle(it.id)}
                        />
                      </td>
                      <td>{it.id}</td>
                      <td>{it.name}</td>
                      <td>{it.quantity}</td>
                      <td>{it.description}</td>
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
                      {form.id ? t("edit") : t("addItem")}
                    </h5>
                    <button
                      className="btn-close"
                      onClick={() => setModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <label className="form-label">{t("name")}</label>
                    <input
                      className="form-control mb-2"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                    <label className="form-label">{t("quantity")}</label>
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({ ...form, quantity: Number(e.target.value) })
                      }
                    />
                    <label className="form-label">{t("description")}</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
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
                    <button className="btn btn-primary" onClick={saveItem}>
                      {t("save")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "discussion" && (
        <div>
          <div className="mb-3">
            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Write a comment (Markdown supported)..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={sendPost}
              disabled={!user}
            >
              Send
            </button>
          </div>
          <div className="list-group">
            {posts.map((p) => (
              <div className="list-group-item" key={p.id}>
                <div className="small text-muted">
                  {new Date(p.createdAt).toLocaleString()} •{" "}
                  {p.user?.username || p.user?.email}
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "settings" && canOwner && (
        <div className="row">
          <div className="col-md-8">
            <label className="form-label">{t("title")}</label>
            <input
              className="form-control mb-2"
              value={settings.name}
              onChange={(e) => setSett({ name: e.target.value })}
            />
            <label className="form-label">{t("description")}</label>
            <textarea
              className="form-control mb-2"
              rows={4}
              value={settings.description}
              onChange={(e) => setSett({ description: e.target.value })}
            />
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.publicWrite}
                onChange={(e) => setSett({ publicWrite: e.target.checked })}
                id="pubw"
              />
              <label className="form-check-label" htmlFor="pubw">
                {t("publicWrite")}
              </label>
            </div>
            <TagsInput
              value={settings.tags}
              onChange={(v) => setSett({ tags: v })}
              label={t("tags")}
            />
            <div className="mt-3">
              <span className="badge bg-info">
                Version: {settings.version ?? 0}
              </span>{" "}
              {settingsChanged && (
                <span className="text-warning ms-2">Saving…</span>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "access" && canOwner && (
        <div>
          <p>
            Access management (add/remove users by email, sorted by name/email,
            autocomplete) — backend endpointlariga mos ravishda ulab qo‘ying.
          </p>
        </div>
      )}
    </div>
  );
}
