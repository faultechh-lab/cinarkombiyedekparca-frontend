import { useEffect, useRef, useState } from "react";
import { loginPath, requestSession } from "./auth-client.mjs";

const groups = {
  products: { path: "/api/products/", title: "Ürünler", singular: "Ürün" },
  categories: { path: "/api/categories/", title: "Kategoriler", singular: "Kategori" },
};
const fieldLabels = {
  name: "Ad", sku: "Ürün kodu", category: "Kategori",
  description: "Açıklama", image: "Görsel",
};

async function catalogRequest(path, options) {
  const response = await fetch(path, { credentials: "same-origin", cache: "no-store", ...options });
  if (response.status === 204) return;
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;
  if (response.ok && isJson) return payload;
  if (response.status === 400 && payload) {
    const errors = Object.entries(payload).flatMap(([field, messages]) =>
      (Array.isArray(messages) ? messages : [messages]).map(message =>
        fieldLabels[field] ? `${fieldLabels[field]}: ${message}` : String(message)));
    throw new Error(errors.join(" "));
  }
  if (response.status === 403) {
    const current = await requestSession();
    if (!current.user) window.location.replace(loginPath);
    throw new Error("İşlem için oturum doğrulanamadı.");
  }
  if (response.status === 404) throw new Error("Kayıt artık mevcut değil. Listeyi yenileyin.");
  throw new Error("Katalog sunucusuna ulaşılamadı. Lütfen tekrar deneyin.");
}

async function changeCatalog(path, method, payload, image) {
  const session = await requestSession();
  if (!session.user) {
    window.location.replace(loginPath);
    throw new Error("Oturumunuz sona erdi.");
  }
  const headers = { "X-CSRFToken": session.csrf_token };
  let body;
  if (image) {
    body = new FormData();
    for (const [key, value] of Object.entries(payload)) body.set(key, value);
    body.set("image", image);
  } else if (payload) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(payload);
  }
  await catalogRequest(path, { method, headers, body });
}

function CatalogDialog({ action, group, categories, busy, error, onClose, onSave }) {
  const dialog = useRef(null);
  const record = action.record;
  const removing = action.kind === "delete";
  const isProduct = group === groups.products;
  const title = removing ? `${group.singular} Sil` : record ? `${group.singular} Düzenle` : `Yeni ${group.singular}`;

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  return (
    <dialog className="catalog-dialog" ref={dialog} aria-labelledby="catalog-dialog-title" onCancel={event => {
      event.preventDefault();
      if (!busy) onClose();
    }}>
      <form className="catalog-form" onSubmit={event => {
        event.preventDefault();
        onSave(new FormData(event.currentTarget));
      }}>
        <h2 id="catalog-dialog-title">{title}</h2>
        {removing ? <div className="catalog-delete-copy">
          <p><strong>{record.name}</strong> silinsin mi?</p>
          {!isProduct && <p>Bu kategoriye bağlı tüm ürünler de silinir. Listede görünen ürün sayısı: {record.product_count}.</p>}
        </div> : <>
          <label>{group.singular} adı
            <input name="name" required maxLength={isProduct ? 200 : 100} defaultValue={record?.name ?? ""} autoFocus />
          </label>
          {isProduct && <>
            <label>Ürün kodu (SKU)
              <input name="sku" required maxLength={100} defaultValue={record?.sku ?? ""} />
            </label>
            <label>Kategori
              <select name="category" required defaultValue={record?.category ?? ""}>
                <option value="">Kategori seçin</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
          </>}
          <label>Açıklama
            <textarea name="description" rows="3" defaultValue={record?.description ?? ""} />
          </label>
          {record?.image && <div className="catalog-current-image">
            <img src={record.image} alt="" width="64" height="64" />
            <label><input type="checkbox" name="removeImage" /> Mevcut görseli kaldır</label>
          </div>}
          <label>{record?.image ? "Yeni görsel" : "Görsel"}
            <input name="image" type="file" accept="image/*" />
          </label>
        </>}
        {error && <p className="catalog-error" role="alert">{error}</p>}
        <div className="catalog-dialog-actions">
          <button className="button button-outline" type="button" onClick={onClose} disabled={busy} autoFocus={removing}>Vazgeç</button>
          <button className={`button ${removing ? "catalog-danger" : "button-primary"}`} type="submit" disabled={busy}>
            {busy ? "İşleniyor…" : removing ? "Sil" : "Kaydet"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function CatalogImagePreview({ record, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  return <dialog className="catalog-dialog catalog-image-dialog" ref={dialog} aria-labelledby="catalog-image-title"
    onClose={onClose} onClick={event => {
      if (event.target === event.currentTarget) dialog.current.close();
    }}>
    <div className="catalog-image-panel">
      <div className="catalog-image-heading">
        <h2 id="catalog-image-title">{record.name}</h2>
        <button className="button button-outline" type="button" onClick={() => dialog.current.close()} autoFocus>Kapat</button>
      </div>
      <img src={record.image} alt={record.name} />
    </div>
  </dialog>;
}

function CatalogTable({ records, isProduct, onAction, onPreview }) {
  return <div className="catalog-table-scroll"><table className="catalog-table">
    <thead><tr>
      <th scope="col">{isProduct ? "Ürün" : "Kategori"}</th>
      {isProduct && <th scope="col">Kategori</th>}
      {!isProduct && <th scope="col">Ürün sayısı</th>}
      <th scope="col">İşlemler</th>
    </tr></thead>
    <tbody>{records.map(record => <tr key={record.id}>
      <td><div className="catalog-record">
        {record.image && <button className="catalog-thumbnail" type="button" onClick={() => onPreview(record)}
          aria-label={`${record.name} görselini büyüt`}>
          <img src={record.image} alt="" width="48" height="48" loading="lazy" />
        </button>}
        <div><strong>{record.name}</strong>
          {isProduct ? <span className="catalog-meta">{record.sku}</span>
            : record.description && <span className="catalog-meta catalog-description">{record.description}</span>}
        </div>
      </div></td>
      {isProduct ? <td>{record.category_name}</td> : <td>{record.product_count}</td>}
      <td><div className="catalog-row-actions">
        <button type="button" onClick={() => onAction("edit", record)} aria-label={`${record.name} düzenle`}>Düzenle</button>
        <button type="button" onClick={() => onAction("delete", record)} aria-label={`${record.name} sil`}>Sil</button>
      </div></td>
    </tr>)}</tbody>
  </table></div>;
}

export function CatalogAdmin({ user, signingOut, onSignOut, logoutError }) {
  const [groupKey, setGroupKey] = useState("products");
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [action, setAction] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const group = groups[groupKey];
  const isProduct = groupKey === "products";

  async function load(signal) {
    setLoading(true);
    setLoadError("");
    try {
      const [categories, products] = await Promise.all([
        catalogRequest(groups.categories.path, { signal }),
        catalogRequest(groups.products.path, { signal }),
      ]);
      if (!signal?.aborted) setCatalog({ categories, products });
    } catch {
      if (!signal?.aborted) setLoadError("Katalog yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  function selectGroup(key) {
    setGroupKey(key);
    setSearch("");
    setCategoryFilter("");
    setNotice("");
  }

  function openAction(kind, record = null) {
    setActionError("");
    setNotice("");
    setAction({ kind, record });
  }

  async function save(fields) {
    if (busy) return;
    setBusy(true);
    setActionError("");
    const removing = action.kind === "delete";
    const record = action.record;
    const path = record ? `${group.path}${record.id}/` : group.path;
    const method = removing ? "DELETE" : record ? "PATCH" : "POST";
    try {
      let payload;
      let image;
      if (!removing) {
        payload = { name: fields.get("name").trim(), description: fields.get("description").trim() };
        if (isProduct) {
          payload.sku = fields.get("sku").trim();
          payload.category = Number(fields.get("category"));
        }
        const upload = fields.get("image");
        if (upload?.size) image = upload;
        else if (fields.get("removeImage")) payload.image = null;
      }
      await changeCatalog(path, method, payload, image);
      setAction(null);
      setNotice(removing ? `${group.singular} silindi.` : record ? `${group.singular} güncellendi.` : `${group.singular} eklendi.`);
      await load();
    } catch (failure) {
      setActionError(failure instanceof TypeError ? "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." : failure.message);
    } finally {
      setBusy(false);
    }
  }

  const categories = catalog?.categories ?? [];
  const term = search.trim().toLocaleLowerCase("tr");
  const records = (catalog?.[groupKey] ?? []).filter(record => (
    (!isProduct || !categoryFilter || String(record.category) === categoryFilter)
    && [record.name, record.sku, record.category_name, record.description]
      .some(value => value?.toLocaleLowerCase("tr").includes(term))
  ));

  return <div className="catalog-admin">
    <header className="catalog-admin-header">
      <div className="container catalog-header-inner">
        <div><h1>Katalog yönetimi</h1><p>{user.email}</p></div>
        <div className="actions">
          <a className="button catalog-back" href="/">Siteye Dön</a>
          <button className="button catalog-back" onClick={onSignOut} disabled={signingOut} type="button">
            {signingOut ? "Kapatılıyor…" : "Çıkış Yap"}
          </button>
        </div>
      </div>
    </header>
    <div className="container catalog-layout">
      <nav className="catalog-navigation" aria-label="Katalog yönetimi">
        {Object.entries(groups).map(([key, item]) =>
          <button key={key} type="button" aria-pressed={key === groupKey} onClick={() => selectGroup(key)}>{item.title}</button>)}
      </nav>
      <section className="catalog-content" aria-labelledby="catalog-section-title">
        <div className="catalog-toolbar">
          <h2 id="catalog-section-title">{group.title}</h2>
          <button className="button button-primary" type="button" disabled={!catalog || loading || (isProduct && !categories.length)} onClick={() => openAction("create")}>
            {group.singular} Ekle
          </button>
        </div>
        {logoutError && <p className="catalog-error" role="alert">{logoutError}</p>}
        {notice && <p className="catalog-notice" role="status">{notice}</p>}
        {loadError && <div className="catalog-state"><p className="catalog-error" role="alert">{loadError}</p>
          <button className="button button-outline" type="button" onClick={() => load()}>Listeyi Yenile</button></div>}
        {catalog && <>
          <div className="catalog-filters">
            <label>{isProduct ? "Ürün ara" : "Kategori ara"}
              <input type="search" value={search} onChange={event => setSearch(event.target.value)} />
            </label>
            {isProduct && <label>Kategoriye göre filtrele
              <select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
                <option value="">Tüm kategoriler</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>}
          </div>
          {records.length ? <CatalogTable records={records} isProduct={isProduct} onAction={openAction} onPreview={setImagePreview} /> : <div className="catalog-state">
            {isProduct && !categories.length
              ? <><p>Ürün eklemek için önce bir kategori oluşturun.</p><button className="button button-outline" type="button" onClick={() => {
                selectGroup("categories");
                openAction("create");
              }}>Kategori Ekle</button></>
              : <p>{search || categoryFilter ? "Aramanıza uyan kayıt bulunamadı." : isProduct ? "Henüz ürün eklenmedi." : "Henüz kategori eklenmedi."}</p>}
          </div>}
        </>}
        {loading && <p className="catalog-state" role="status">Katalog yükleniyor…</p>}
      </section>
    </div>
    {action && <CatalogDialog action={action} group={group} categories={categories} busy={busy} error={actionError} onClose={() => setAction(null)} onSave={save} />}
    {imagePreview && <CatalogImagePreview record={imagePreview} onClose={() => setImagePreview(null)} />}
  </div>;
}
