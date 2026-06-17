import React, { useEffect, useMemo, useState } from 'react';
import { endpointBE } from "../utils/Constant";
import { getAllGenres } from "../../api/GenreApi";
import { getBookCountByGenreId } from "../../api/BookApi";
import RequireAdmin from "./RequireAdmin";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const getToken = () => localStorage.getItem("token");
const emptyForm = { nameGenre: "" };

/* ─── Shared style tokens ─── */
const S = {
    wrap: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'hidden', border: '1px solid #F1F5F9' },
    table: { width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px' },
    thead: { background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' },
    th: { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '11px', letterSpacing: '0.7px', textTransform: 'uppercase', color: '#94A3B8', whiteSpace: 'nowrap' },
    td: { padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#374151', verticalAlign: 'middle' },
    actionBtn: (v) => ({
        padding: '5px 12px', borderRadius: '8px',
        border: `1.5px solid ${v === 'edit' ? '#2C7B8F' : '#EF4444'}`,
        background: 'transparent', color: v === 'edit' ? '#2C7B8F' : '#EF4444',
        fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600, lineHeight: 1, transition: 'all 0.18s ease',
    }),
    input: {
        padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
        fontFamily: "'DM Sans', sans-serif", fontSize: '14px', outline: 'none',
        width: '100%', boxSizing: 'border-box', color: '#1E293B',
    },
    label: { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: '#374151' },
};

/* ─── Delete confirm modal ─── */
const DeleteConfirm = ({ name, onConfirm, onCancel, loading }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '28px 32px', maxWidth: '400px', width: '90%', boxShadow: '0 16px 48px rgba(0,0,0,0.18)', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444', marginBottom: '10px' }}>Xóa thể loại</div>
            <p style={{ color: '#475569', marginBottom: '20px', fontSize: '14px', lineHeight: 1.6 }}>
                Bạn có chắc muốn xóa <strong style={{ color: '#1E293B' }}>"{name}"</strong>?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onCancel} style={{ ...S.actionBtn('edit'), border: '1.5px solid #CBD5E1', color: '#64748B' }}>Hủy</button>
                <button onClick={onConfirm} disabled={loading} style={{ ...S.actionBtn('del'), background: '#EF4444', color: '#fff', border: 'none', minWidth: '70px' }}>
                    {loading ? '...' : '⊗ Xóa'}
                </button>
            </div>
        </div>
    </div>
);

/* ─── Inline form ─── */
const GenreForm = ({ form, setForm, onSubmit, onCancel }) => (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 400, color: '#1E293B', marginBottom: '16px' }}>
            {form.idGenre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
        </div>
        <form onSubmit={onSubmit}>
            <div style={{ maxWidth: '360px', marginBottom: '16px' }}>
                <label style={S.label}>Tên thể loại <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                    style={S.input}
                    value={form.nameGenre}
                    onChange={e => setForm({ ...form, nameGenre: e.target.value })}
                    placeholder="Nhập tên thể loại..."
                    required
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ ...S.actionBtn('edit'), background: '#2C7B8F', color: '#fff', border: 'none', padding: '8px 20px' }}>
                    ✓ {form.idGenre ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button type="button" onClick={onCancel} style={{ ...S.actionBtn('edit'), border: '1.5px solid #CBD5E1', color: '#64748B' }}>Hủy</button>
            </div>
        </form>
    </div>
);

const GenreManagement = () => {
    const [genres, setGenres] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [hoverRow, setHoverRow] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadGenres = async () => {
        setLoading(true);
        try { setGenres(await getAllGenres()); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadGenres(); }, []);

    const filtered = useMemo(() => {
        if (!keyword.trim()) return genres;
        const k = keyword.toLowerCase();
        return genres.filter(g => (g.nameGenre || '').toLowerCase().includes(k));
    }, [genres, keyword]);

    const onEdit = (g) => { setForm({ idGenre: g.idGenre, nameGenre: g.nameGenre }); setShowForm(true); };
    const onAdd = () => { setForm(emptyForm); setShowForm(true); };
    const onCancel = () => { setShowForm(false); setForm(emptyForm); };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const bookCount = await getBookCountByGenreId(deleteTarget.id);
            if (bookCount > 0) { toast.error(`Không thể xóa — đang có ${bookCount} sách sử dụng thể loại này!`); setDeleteTarget(null); return; }
            const res = await fetch(`${endpointBE}/genres/${deleteTarget.id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok || res.status === 204) { toast.success("Xóa thể loại thành công!"); await loadGenres(); }
            else { const t = await res.text(); toast.error(t || "Xóa thể loại thất bại!"); }
        } catch { toast.error("Đã xảy ra lỗi khi xóa!"); }
        finally { setDeleting(false); setDeleteTarget(null); }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.nameGenre.trim()) { toast.warning("Vui lòng nhập tên thể loại!"); return; }
        try {
            if (!form.idGenre) {
                const res = await fetch(`${endpointBE}/genres`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ nameGenre: form.nameGenre })
                });
                if (res.ok) { toast.success("Thêm thể loại thành công!"); setForm(emptyForm); setShowForm(false); await loadGenres(); }
                else { const d = await res.json().catch(() => ({})); toast.error(d.message || "Thêm thất bại!"); }
            } else {
                const res = await fetch(`${endpointBE}/genres/${form.idGenre}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ nameGenre: form.nameGenre })
                });
                if (res.ok || res.status === 204) { toast.success("Cập nhật thành công!"); setShowForm(false); await loadGenres(); }
                else { toast.error("Cập nhật thất bại!"); }
            }
        } catch { toast.error("Đã xảy ra lỗi!"); }
    };

    return (
        <div style={{ padding: '24px 12px', maxWidth: '960px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '22px', color: '#1E293B', margin: 0 }}>
                    Quản lý thể loại
                </h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <SearchIcon style={{ position: "absolute", left: "10px", color: "#94A3B8", fontSize: "18px" }} />
                        <input
                            style={{ ...S.input, width: '260px', paddingLeft: '34px' }}
                            placeholder="Tìm theo tên thể loại..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onAdd}
                        style={{ ...S.actionBtn('edit'), background: 'linear-gradient(135deg,#2C7B8F,#1A5E70)', color: '#fff', border: 'none', padding: '9px 18px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <AddIcon sx={{ fontSize: 16 }} /> Thêm thể loại
                    </button>
                </div>
            </div>

            {showForm && <GenreForm form={form} setForm={setForm} onSubmit={onSubmit} onCancel={onCancel} />}

            <div style={S.wrap}>
                <table style={S.table}>
                    <thead style={S.thead}>
                        <tr>
                            <th style={{ ...S.th, width: '10%' }}>ID</th>
                            <th style={{ ...S.th, width: '60%', textAlign: 'center' }}>Tên thể loại</th>
                            <th style={{ ...S.th, width: '30%' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                            {loading && (
                                <tr><td colSpan={3} style={{ ...S.td, textAlign: 'center', color: '#94A3B8', padding: '32px' }}>Đang tải...</td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={3} style={{ ...S.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>Không có dữ liệu</td></tr>
                            )}
                            {!loading && filtered.map(g => (
                                <tr key={g.idGenre}
                                    onMouseEnter={() => setHoverRow(g.idGenre)}
                                    onMouseLeave={() => setHoverRow(null)}
                                    style={{ background: hoverRow === g.idGenre ? '#F8FAFC' : '#fff', transition: 'background 0.15s' }}
                                >
                                    <td style={{ ...S.td, color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>#{g.idGenre}</td>
                                    <td style={{ ...S.td, fontWeight: 500, color: '#1E293B', textAlign: 'center' }}>{g.nameGenre}</td>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={S.actionBtn('edit')} onClick={() => onEdit(g)}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#2C7B8F'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2C7B8F'; }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <EditIcon sx={{ fontSize: 13 }} /> Sửa
                                                </div>
                                            </button>
                                            <button style={S.actionBtn('del')} onClick={() => setDeleteTarget({ id: g.idGenre, name: g.nameGenre })}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <DeleteIcon sx={{ fontSize: 13 }} /> Xóa
                                                </div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            {deleteTarget && (
                <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
            )}
        </div>
    );
};

const GenreManagementPage = RequireAdmin(GenreManagement);
export default GenreManagementPage;
