import { useMemo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllFeedback, markFeedbackAsRead, deleteFeedback } from "../../../api/FeedbackApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

/* ─── Shared style tokens ─── */
const S = {
    wrap: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'hidden', border: '1px solid #F1F5F9' },
    table: { width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px' },
    thead: { background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' },
    th: { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '11px', letterSpacing: '0.7px', textTransform: 'uppercase', color: '#94A3B8', whiteSpace: 'nowrap' },
    td: { padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#374151', verticalAlign: 'middle' },
    actionBtn: (v) => ({
        padding: '5px 12px', borderRadius: '8px',
        border: `1.5px solid ${v === 'teal' ? '#2C7B8F' : v === 'green' ? '#16A34A' : '#EF4444'}`,
        background: 'transparent',
        color: v === 'teal' ? '#2C7B8F' : v === 'green' ? '#16A34A' : '#EF4444',
        fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600, lineHeight: 1, transition: 'all 0.18s ease',
    }),
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
};

/* ─── Detail Modal ─── */
const DetailModal = ({ feedback, onClose, onMarkRead, onDelete }) => {
    if (!feedback) return null;
    return (
        <div style={S.overlay}>
            <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '560px', width: '92%', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 16px 48px rgba(0,0,0,0.18)', fontFamily: "'DM Sans', sans-serif" }}>
                {/* Header */}
                <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg,#2C7B8F,#1A5E70)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '17px', fontWeight: 400 }}>Chi tiết Feedback</div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: 0 }}>✕</button>
                </div>
                {/* Body */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: '4px' }}>Tiêu đề</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 400, color: '#1E293B' }}>{feedback.title}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: '4px' }}>Người dùng</div>
                            <div style={{ fontWeight: 500, color: '#374151' }}>{feedback.username || '—'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: '4px' }}>Ngày tạo</div>
                            <div style={{ fontWeight: 500, color: '#374151' }}>
                                {feedback.dateCreated ? new Date(feedback.dateCreated).toLocaleString('vi-VN') : '—'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: '8px' }}>Nhận xét</div>
                        <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: '80px' }}>
                            {feedback.comment}
                        </div>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: feedback.readed ? '#ECFDF5' : '#FEF9C3', border: `1px solid ${feedback.readed ? '#BBF7D0' : '#FDE68A'}` }}>
                        <span style={{ fontWeight: 600, color: feedback.readed ? '#166534' : '#854D0E', fontSize: '13px' }}>
                            {feedback.readed ? '✓ Đã duyệt' : '◈ Chưa duyệt'}
                        </span>
                    </div>
                </div>
                {/* Footer */}
                <div style={{ padding: '14px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px', justifyContent: 'flex-end', background: '#FAFAFA' }}>
                    {!feedback.readed && (
                        <button onClick={() => { onMarkRead(feedback.idFeedback); onClose(); }}
                            style={{ ...S.actionBtn('green'), background: '#16A34A', color: '#fff', border: 'none', padding: '8px 16px' }}>
                            ✓ Đánh dấu đã đọc
                        </button>
                    )}
                    <button onClick={() => { onDelete(feedback.idFeedback); onClose(); }}
                        style={{ ...S.actionBtn('red'), background: '#EF4444', color: '#fff', border: 'none', padding: '8px 16px' }}>
                        ⊗ Xóa
                    </button>
                    <button onClick={onClose}
                        style={{ ...S.actionBtn('teal'), border: '1.5px solid #CBD5E1', color: '#64748B' }}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Main component ─── */
export const FeedbackTable = ({ searchKeyword = "", reloadKey = 0 }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [hoverRow, setHoverRow] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const feedbacks = await getAllFeedback();
                const sorted = [...feedbacks].sort((a, b) => a.readed === b.readed ? 0 : a.readed ? 1 : -1);
                setData(sorted.map(fb => ({ ...fb, id: fb.idFeedback })));
            } catch (err) {
                toast.error("Lỗi khi tải danh sách feedback: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [isDataChanged, reloadKey]);

    const handleMarkRead = async (id) => {
        const fb = data.find(f => f.idFeedback === id);
        if (fb?.readed) { toast.warning("Feedback này đã duyệt rồi"); return; }
        try {
            await markFeedbackAsRead(id);
            toast.success("Đã đánh dấu đã đọc");
            setIsDataChanged(p => !p);
        } catch { toast.error("Lỗi khi duyệt"); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteFeedback(id);
            toast.success("Xóa thành công");
            setIsDataChanged(p => !p);
        } catch { toast.error("Lỗi khi xóa"); }
    };

    const filtered = useMemo(() => {
        if (!searchKeyword.trim()) return data;
        const k = searchKeyword.toLowerCase();
        return data.filter(f =>
            (f.title || '').toLowerCase().includes(k) ||
            (f.username || '').toLowerCase().includes(k) ||
            (f.comment || '').toLowerCase().includes(k)
        );
    }, [data, searchKeyword]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8', fontFamily: "'DM Sans', sans-serif" }}>
                Đang tải...
            </div>
        );
    }

    return (
        <>
            <div style={S.wrap}>
                <table style={S.table}>
                    <thead style={S.thead}>
                        <tr>
                            <th style={{ ...S.th, width: '48px' }}>ID</th>
                            <th style={S.th}>Tiêu đề</th>
                            <th style={S.th}>Người dùng</th>
                            <th style={S.th}>Nhận xét</th>
                            <th style={{ ...S.th, width: '110px' }}>Ngày tạo</th>
                            <th style={{ ...S.th, width: '110px' }}>Trạng thái</th>
                            <th style={{ ...S.th, width: '160px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ ...S.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>Không có feedback nào</td></tr>
                        )}
                        {filtered.map(fb => (
                            <tr key={fb.idFeedback}
                                onClick={(e) => {
                                    // Prevent row click if clicking action buttons
                                    if (e.target.tagName.toLowerCase() !== 'button') {
                                        setSelectedFeedback(fb);
                                    }
                                }}
                                onMouseEnter={() => setHoverRow(fb.idFeedback)}
                                onMouseLeave={() => setHoverRow(null)}
                                style={{
                                    background: hoverRow === fb.idFeedback ? '#F8FAFC' : (fb.readed ? '#fff' : '#FAFCFF'),
                                    transition: 'background 0.15s',
                                    opacity: fb.readed ? 0.8 : 1,
                                    cursor: 'pointer'
                                }}
                            >
                                <td style={{ ...S.td, color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>#{fb.idFeedback}</td>
                                <td style={{ ...S.td, maxWidth: '180px' }}>
                                    <div style={{ fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {!fb.readed && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2C7B8F', marginRight: '7px', verticalAlign: 'middle' }} />}
                                        {fb.title}
                                    </div>
                                </td>
                                <td style={{ ...S.td, color: '#64748B', fontSize: '13px' }}>{fb.username || '—'}</td>
                                <td style={{ ...S.td, maxWidth: '220px' }}>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748B', fontSize: '13px' }}>
                                        {fb.comment}
                                    </div>
                                </td>
                                <td style={{ ...S.td, color: '#64748B', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                    {fb.dateCreated ? new Date(fb.dateCreated).toLocaleDateString('vi-VN') : '—'}
                                </td>
                                <td style={S.td}>
                                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: fb.readed ? '#ECFDF5' : '#FEF9C3', color: fb.readed ? '#166534' : '#854D0E' }}>
                                        {fb.readed ? 'Đã đọc' : 'Chưa đọc'}
                                    </span>
                                </td>
                                <td style={S.td}>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'nowrap' }}>
                                        <button style={S.actionBtn('teal')} onClick={() => setSelectedFeedback(fb)}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#2C7B8F'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2C7B8F'; }}
                                            title="Xem chi tiết">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <VisibilityIcon sx={{ fontSize: 13 }} /> Xem
                                            </div>
                                        </button>
                                        {!fb.readed && (
                                            <button style={S.actionBtn('green')} onClick={() => handleMarkRead(fb.idFeedback)}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#16A34A'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#16A34A'; }}
                                                title="Đánh dấu đã đọc">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <CheckIcon sx={{ fontSize: 13 }} /> Duyệt
                                                </div>
                                            </button>
                                        )}
                                        <button style={S.actionBtn('red')} onClick={() => handleDelete(fb.idFeedback)}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
                                            title="Xóa">
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

            <DetailModal
                feedback={selectedFeedback}
                onClose={() => setSelectedFeedback(null)}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
            />
        </>
    );
};
