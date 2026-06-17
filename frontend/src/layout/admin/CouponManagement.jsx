import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import RequireAdmin from './RequireAdmin';
import { createCoupon, deleteCoupon, getCoupon, updateActiveCoupon } from '../../api/CouponApi';
import { Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const emptyForm = { discountPercent: 0, expiryDate: '' };

/* ─── Shared style tokens (same as BookTable) ─── */
const S = {
    wrap: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'hidden', border: '1px solid #F1F5F9' },
    table: { width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px' },
    thead: { background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' },
    th: { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '11px', letterSpacing: '0.7px', textTransform: 'uppercase', color: '#94A3B8', whiteSpace: 'nowrap' },
    td: { padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#374151', verticalAlign: 'middle' },
    actionBtn: (v) => ({
        padding: '5px 12px', borderRadius: '8px',
        border: `1.5px solid ${v === 'edit' ? '#2C7B8F' : v === 'warn' ? '#D97706' : '#EF4444'}`,
        background: 'transparent',
        color: v === 'edit' ? '#2C7B8F' : v === 'warn' ? '#D97706' : '#EF4444',
        fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600, lineHeight: 1, transition: 'all 0.18s ease',
    }),
    input: {
        padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: '8px',
        fontFamily: "'DM Sans', sans-serif", fontSize: '14px', outline: 'none',
        width: '100%', boxSizing: 'border-box', color: '#1E293B',
    },
    label: { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: '#374151' },
    pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px 16px', borderTop: '1px solid #F1F5F9', background: '#FAFAFA' },
    pageBtn: (d) => ({ padding: '5px 14px', borderRadius: '8px', border: '1.5px solid #E2E8F0', background: d ? '#F8FAFC' : '#fff', color: d ? '#CBD5E1' : '#475569', fontSize: '12px', fontWeight: 600, cursor: d ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.18s' }),
};

/* ─── Add form Modal ─── */
const AddCouponModal = ({ form, setForm, quantity, setQuantity, onSubmit, onCancel }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
        <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '440px', width: '92%', boxShadow: '0 16px 48px rgba(0,0,0,0.18)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg,#2C7B8F,#1A5E70)', color: '#fff' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '17px', fontWeight: 400 }}>Tạo mã giảm giá</div>
            </div>
            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={S.label}>Số lượng mã <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="number" min={1} style={S.input} value={quantity}
                        onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
                </div>
                <div>
                    <label style={S.label}>Phần trăm giảm giá (%) <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="number" min={1} max={100} style={S.input} value={form.discountPercent}
                        onChange={e => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                    <label style={S.label}>Ngày hết hạn <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="date" style={S.input} value={form.expiryDate}
                        onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
                </div>
            </div>
            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#FAFAFA' }}>
                <button onClick={onCancel} style={{ ...S.actionBtn('edit'), border: '1.5px solid #CBD5E1', color: '#64748B' }}>Hủy</button>
                <button onClick={onSubmit} style={{ ...S.actionBtn('edit'), background: 'linear-gradient(135deg,#2C7B8F,#1A5E70)', color: '#fff', border: 'none', padding: '8px 20px' }}>
                    ✓ Tạo mã
                </button>
            </div>
        </div>
    </div>
);

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [quantity, setQuantity] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hoverRow, setHoverRow] = useState(null);
    const pageSize = 10;

    const fetchCoupons = (page = 1) => {
        setLoading(true);
        getCoupon(page - 1, pageSize)
            .then(res => { setCoupons(res.coupons); setTotalPages(res.totalPages); setCurrentPage(page); setLoading(false); })
            .catch(() => { toast.error("Lỗi khi tải danh sách mã giảm giá"); setLoading(false); });
    };

    useEffect(() => { fetchCoupons(); }, []);

    const onAdd = () => { setForm(emptyForm); setQuantity(1); setShowForm(true); };
    const onCancel = () => { setShowForm(false); setForm(emptyForm); };

    const onSubmit = async () => {
        if (form.discountPercent <= 0 || form.discountPercent > 100) { toast.error("Phần trăm giảm giá phải từ 1–100"); return; }
        if (!form.expiryDate) { toast.error("Ngày hết hạn không được để trống"); return; }
        await createCoupon(quantity, form.discountPercent, new Date(form.expiryDate));
        setShowForm(false); setForm(emptyForm); fetchCoupons(1);
    };

    const onDelete = async (id) => {
        await deleteCoupon(id);
        fetchCoupons(currentPage);
    };

    const isExpired = (date) => new Date(date) < new Date();

    if (loading) {
        return (
            <div style={{ padding: '4px' }}>
                {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={48} style={{ marginBottom: '8px', borderRadius: '8px' }} />)}
            </div>
        );
    }

    return (
        <div style={{ padding: '4px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '22px', color: '#1E293B', margin: 0 }}>
                    Quản lý mã giảm giá
                </h3>
                <button onClick={onAdd}
                    style={{ ...S.actionBtn('edit'), background: 'linear-gradient(135deg,#2C7B8F,#1A5E70)', color: '#fff', border: 'none', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AddIcon sx={{ fontSize: 16 }} /> Tạo mã giảm giá
                </button>
            </div>

            <div style={S.wrap}>
                <table style={S.table}>
                    <thead style={S.thead}>
                        <tr>
                            <th style={S.th}>Mã coupon</th>
                            <th style={S.th}>Giảm giá</th>
                            <th style={S.th}>Hết hạn</th>
                            <th style={S.th}>Sử dụng</th>
                            <th style={S.th}>Kích hoạt</th>
                            <th style={{ ...S.th, width: '120px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>Không có mã giảm giá nào</td></tr>
                        ) : coupons.map(c => {
                            const expired = isExpired(c.expiryDate);
                            return (
                                <tr key={c.idCoupon}
                                    onMouseEnter={() => setHoverRow(c.idCoupon)}
                                    onMouseLeave={() => setHoverRow(null)}
                                    style={{ background: hoverRow === c.idCoupon ? '#F8FAFC' : '#fff', transition: 'background 0.15s' }}
                                >
                                    <td style={{ ...S.td }}>
                                        <code style={{ background: '#EEF8FA', color: '#2C7B8F', padding: '3px 8px', borderRadius: '5px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}>
                                            {c.code}
                                        </code>
                                    </td>
                                    <td style={{ ...S.td, fontWeight: 700, color: '#2C7B8F', fontSize: '14px' }}>{c.discountPercent}%</td>
                                    <td style={{ ...S.td, fontSize: '13px', color: expired ? '#EF4444' : '#64748B' }}>
                                        {new Date(c.expiryDate).toLocaleDateString('vi-VN')}
                                        {expired && <span style={{ marginLeft: '6px', fontSize: '11px', background: '#FEF2F2', color: '#EF4444', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>Hết hạn</span>}
                                    </td>
                                    <td style={S.td}>
                                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: c.isUsed ? '#FEF2F2' : '#ECFDF5', color: c.isUsed ? '#991B1B' : '#166534' }}>
                                            {c.isUsed ? 'Đã dùng' : 'Chưa dùng'}
                                        </span>
                                    </td>
                                    <td style={S.td}>
                                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: c.isActive ? '#ECFDF5' : '#F1F5F9', color: c.isActive ? '#166534' : '#64748B' }}>
                                            {c.isActive ? 'Đang hoạt động' : 'Vô hiệu'}
                                        </span>
                                    </td>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                                            <button
                                                onClick={() => updateActiveCoupon(c.idCoupon, !c.isActive).then(() => fetchCoupons(currentPage))}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#D97706'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D97706'; }}
                                                title={c.isActive ? 'Tắt kích hoạt' : 'Kích hoạt'}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '8px',
                                                    border: '1.5px solid #D97706', background: 'transparent',
                                                    color: '#D97706', cursor: 'pointer',
                                                    transition: 'all 0.18s ease', lineHeight: 1,
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                                                    {c.isActive ? (
                                                        <ToggleOffIcon sx={{ fontSize: 16 }} />
                                                    ) : (
                                                        <ToggleOnIcon sx={{ fontSize: 16 }} />
                                                    )}
                                                    {c.isActive ? 'Tắt' : 'Bật'}
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => onDelete(c.idCoupon)}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '8px',
                                                    border: '1.5px solid #EF4444', background: 'transparent',
                                                    color: '#EF4444', cursor: 'pointer',
                                                    transition: 'all 0.18s ease', lineHeight: 1,
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                    Xóa
                                                </div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div style={S.pagination}>
                        <button style={S.pageBtn(currentPage <= 1)} disabled={currentPage <= 1} onClick={() => fetchCoupons(currentPage - 1)}>← Trước</button>
                        <span style={{ fontSize: '13px', color: '#64748B', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button style={S.pageBtn(currentPage >= totalPages)} disabled={currentPage >= totalPages} onClick={() => fetchCoupons(currentPage + 1)}>Sau →</button>
                    </div>
                )}
            </div>

            {showForm && <AddCouponModal form={form} setForm={setForm} quantity={quantity} setQuantity={setQuantity} onSubmit={onSubmit} onCancel={onCancel} />}
        </div>
    );
};

const CouponManagementPage = RequireAdmin(CouponManagement);
export default CouponManagementPage;
