import { useCallback, useEffect, useState } from "react";
import { getAllBook } from "../../../api/BookApi";
import { getAllImageByBook } from "../../../api/ImageApi";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { endpointBE } from "../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/* ─── Inline styles to keep file self-contained ─── */
const S = {
    wrap: {
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
        overflow: 'hidden',
        border: '1px solid #F1F5F9',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13.5px',
    },
    thead: {
        background: '#F8FAFC',
        borderBottom: '1.5px solid #E2E8F0',
    },
    th: {
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '0.7px',
        textTransform: 'uppercase',
        color: '#94A3B8',
        whiteSpace: 'nowrap',
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #F1F5F9',
        color: '#374151',
        verticalAlign: 'middle',
    },
    coverImg: {
        width: '48px',
        height: '66px',
        objectFit: 'cover',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'block',
    },
    bookTitle: {
        fontWeight: 600,
        color: '#1E293B',
        fontSize: '13.5px',
        maxWidth: '260px',
        lineHeight: '1.4',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    priceBadge: {
        fontWeight: 700,
        color: '#2C7B8F',
        fontSize: '13px',
    },
    qtyBadge: (qty) => ({
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '99px',
        fontSize: '12px',
        fontWeight: 600,
        background: qty > 10 ? '#ECFDF5' : qty > 0 ? '#FEF9C3' : '#FEF2F2',
        color: qty > 10 ? '#166534' : qty > 0 ? '#854D0E' : '#991B1B',
    }),
    actionBtn: (variant) => ({
        padding: '5px 12px',
        borderRadius: '8px',
        border: `1.5px solid ${variant === 'edit' ? '#2C7B8F' : '#EF4444'}`,
        background: 'transparent',
        color: variant === 'edit' ? '#2C7B8F' : '#EF4444',
        fontSize: '13px',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        lineHeight: 1,
        transition: 'all 0.18s ease',
    }),
    pagination: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '14px 16px',
        borderTop: '1px solid #F1F5F9',
        background: '#FAFAFA',
    },
    pageBtn: (disabled) => ({
        padding: '5px 14px',
        borderRadius: '8px',
        border: '1.5px solid #E2E8F0',
        background: disabled ? '#F8FAFC' : '#fff',
        color: disabled ? '#CBD5E1' : '#475569',
        fontSize: '12px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '0.4px',
        transition: 'all 0.18s',
    }),
    confirmOverlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
    },
    confirmBox: {
        background: '#fff',
        borderRadius: '14px',
        padding: '28px 32px',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
        fontFamily: "'DM Sans', sans-serif",
    },
};

/* ─── Delete confirm modal ─── */
const DeleteConfirm = ({ book, onConfirm, onCancel, loading }) => (
    <div style={S.confirmOverlay}>
        <div style={S.confirmBox}>
            <div style={{ fontSize: '20px', marginBottom: '6px', color: '#EF4444', fontWeight: 700 }}>Xóa sách</div>
            <p style={{ color: '#475569', marginBottom: '20px', fontSize: '14px', lineHeight: 1.6 }}>
                Bạn có chắc muốn xóa <strong style={{ color: '#1E293B' }}>"{book?.name}"</strong>?<br />
                <span style={{ color: '#EF4444', fontSize: '13px' }}>Hành động này không thể hoàn tác.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onCancel} disabled={loading} style={{ ...S.actionBtn('edit'), border: '1.5px solid #CBD5E1', color: '#64748B' }}>
                    Hủy
                </button>
                <button onClick={onConfirm} disabled={loading}
                    style={{ ...S.actionBtn('del'), background: '#EF4444', color: '#fff', border: 'none', minWidth: '80px' }}>
                    {loading ? '...' : '⊗ Xóa'}
                </button>
            </div>
        </div>
    </div>
);

/* ─── Main component ─── */
export const BookTable = (props) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hoverRow, setHoverRow] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const pageSize = 10;

    const fetchWithImages = async (books) => {
        const results = await Promise.all(
            books.map(async (book) => {
                const imgs = await getAllImageByBook(book.idBook);
                return {
                    ...book,
                    id: book.idBook,
                    thumbnail: imgs[0]?.urlImage || imgs[0]?.dataImage || '/images/books/hinh_nen_sach.jpg',
                };
            })
        );
        return results;
    };

    const loadAllBooks = async () => {
        try {
            const res = await getAllBook(1000, 0);
            const books = await fetchWithImages(res.bookList);
            setAllBooks(books);
            return books;
        } catch {
            toast.error('Không thể tải danh sách sách!');
            return [];
        }
    };

    const loadBooks = async (page = 0) => {
        setLoading(true);
        try {
            const res = await getAllBook(pageSize, page);
            const books = await fetchWithImages(res.bookList);
            setData(books);
            setFilteredData(books);
            setCurrentPage(page);
            setTotalPages(res.totalPages);
        } catch {
            toast.error('Không thể tải danh sách sách!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllBooks().then(() => loadBooks(0));
    }, [props.keyCountReload]);

    useEffect(() => {
        if (!props.searchKeyword?.trim()) {
            setFilteredData(data);
        } else {
            const kw = props.searchKeyword.toLowerCase().trim();
            setFilteredData(allBooks.filter(b =>
                b.nameBook?.toLowerCase().includes(kw) || b.author?.toLowerCase().includes(kw)
            ));
        }
    }, [props.searchKeyword, data, allBooks]);

    const handleEdit = (book) => {
        props.setBookData?.(book);
        props.handleOpenForm?.();
    };

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) { toast.error('Vui lòng đăng nhập!'); return; }
            const res = await fetch(`${endpointBE}/books/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (res.status === 200) {
                toast.success('Xóa sách thành công!');
                props.onDeleteSuccess?.();
            } else if (res.status === 400) {
                const txt = await res.text().catch(() => '');
                toast.error(txt || 'Không thể xóa sách này vì đã có đơn hàng liên quan.');
            } else {
                toast.error(`Lỗi ${res.status}`);
            }
        } catch {
            toast.error('Lỗi kết nối đến server');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget, props]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <CircularProgress size={28} style={{ color: '#2C7B8F' }} />
            </div>
        );
    }

    if (filteredData.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '56px', color: '#94A3B8', fontFamily: "'DM Sans', sans-serif" }}>
                {props.searchKeyword ? `Không tìm thấy sách nào với "${props.searchKeyword}"` : 'Chưa có sách nào trong hệ thống.'}
            </div>
        );
    }

    return (
        <>
            <div style={S.wrap}>
                <table style={S.table}>
                    <thead style={S.thead}>
                        <tr>
                            <th style={S.th}>ID</th>
                            <th style={S.th}>Bìa</th>
                            <th style={S.th}>Tên sách</th>
                            <th style={S.th}>Tác giả</th>
                            <th style={S.th}>SL</th>
                            <th style={S.th}>Giá bán</th>
                            <th style={S.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((book) => (
                            <tr
                                key={book.id}
                                onMouseEnter={() => setHoverRow(book.id)}
                                onMouseLeave={() => setHoverRow(null)}
                                style={{
                                    background: hoverRow === book.id ? '#F8FAFC' : '#fff',
                                    transition: 'background 0.15s',
                                }}
                            >
                                <td style={{ ...S.td, color: '#94A3B8', fontSize: '12px', fontWeight: 600, width: '52px' }}>
                                    #{book.id}
                                </td>
                                <td style={{ ...S.td, width: '68px' }}>
                                    <img src={book.thumbnail} alt={book.nameBook} style={S.coverImg} />
                                </td>
                                <td style={S.td}>
                                    <div style={S.bookTitle}>{book.nameBook}</div>
                                </td>
                                <td style={{ ...S.td, color: '#64748B', fontSize: '13px' }}>
                                    {book.author || '—'}
                                </td>
                                <td style={S.td}>
                                    <span style={S.qtyBadge(book.quantity ?? 99)}>
                                        {book.quantity ?? '—'}
                                    </span>
                                </td>
                                <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                                    <span style={S.priceBadge}>
                                        {Number.parseInt(book.sellPrice || 0).toLocaleString('vi-VN')}đ
                                    </span>
                                    {book.discountPercent > 0 && (
                                        <span style={{
                                            marginLeft: '6px', fontSize: '11px',
                                            color: '#fff', background: '#EF4444',
                                            borderRadius: '4px', padding: '1px 5px', fontWeight: 600,
                                        }}>
                                            -{book.discountPercent}%
                                        </span>
                                    )}
                                </td>
                                <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button
                                            style={S.actionBtn('edit')}
                                            onClick={() => handleEdit(book)}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#2C7B8F'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2C7B8F'; }}
                                            title="Chỉnh sửa"
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <EditIcon sx={{ fontSize: 13 }} /> Sửa
                                            </div>
                                        </button>
                                        <button
                                            style={S.actionBtn('del')}
                                            onClick={() => setDeleteTarget({ id: book.idBook, name: book.nameBook })}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
                                            title="Xóa sách"
                                        >
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

                {/* Pagination */}
                {!props.searchKeyword?.trim() && (
                    <div style={S.pagination}>
                        <button
                            style={S.pageBtn(currentPage === 0)}
                            disabled={currentPage === 0}
                            onClick={() => loadBooks(currentPage - 1)}
                        >← Trước</button>
                        <span style={{ fontSize: '13px', color: '#64748B', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                            Trang {currentPage + 1} / {Math.max(1, totalPages)}
                        </span>
                        <button
                            style={S.pageBtn(currentPage >= totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => loadBooks(currentPage + 1)}
                        >Sau →</button>
                    </div>
                )}
                {props.searchKeyword?.trim() && (
                    <div style={S.pagination}>
                        <span style={{ fontSize: '13px', color: '#64748B', fontFamily: "'DM Sans', sans-serif" }}>
                            {filteredData.length} kết quả
                        </span>
                    </div>
                )}
            </div>

            {/* Delete confirm */}
            {deleteTarget && (
                <DeleteConfirm
                    book={deleteTarget}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}
        </>
    );
};
