import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllImageByBook } from "../../../api/ImageApi";
import { addFavoriteBook, removeFavoriteBook, getFavoriteBooksByUser } from "../../../api/FavouriteBookApi";
import { getIdUserByToken, isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";
import { toast } from "react-toastify";
import { getCartAllByIdUser, updateQuantityCartItem, addCartItem } from "../../../api/CartApi";
import { Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const BookProps = ({ book, onRemove, isFavoritePage = false }) => {
    const navigation = useNavigate();
    const [imageList, setImageList] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        getAllImageByBook(book.idBook)
            .then(setImageList)
            .catch(console.log);
        if (isToken()) checkIfFavorite();
    }, [book.idBook]);

    const checkIfFavorite = async () => {
        try {
            const idUser = Number(getIdUserByToken());
            if (!idUser || isNaN(idUser)) return;
            const favoriteIds = await getFavoriteBooksByUser(idUser);
            setIsFavorite(favoriteIds.includes(book.idBook));
        } catch (error) { console.error(error); }
    };

    const handleAddProduct = async () => {
        const cartList = await getCartAllByIdUser();
        const existing = cartList.find(c => c.book?.idBook === book.idBook);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
            try { await updateQuantityCartItem(existing); } catch (e) { console.error(e); }
            return;
        }
        await addCartItem(book.idBook, 1);
    };

    const handleToggleFavorite = async () => {
        if (!isToken()) { navigation("/login"); return; }
        const idUser = Number(getIdUserByToken());
        if (!idUser) return;
        setLoading(true);
        if (isFavorite) {
            await removeFavoriteBook(idUser, book.idBook);
            setIsFavorite(false);
            if (isFavoritePage && onRemove) onRemove();
        } else {
            await addFavoriteBook(idUser, book.idBook);
            setIsFavorite(true);
        }
        setLoading(false);
    };

    const outOfStock = book.quantity === 0;

    return (
        <div className='col-md-6 col-lg-3 mt-3'>
            <div className='ms-book-card' style={{
                borderRadius: '12px',
                background: '#fff',
                border: '1px solid #F1F5F9',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1), box-shadow 0.28s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', flexDirection: 'column',
                height: '100%', position: 'relative',
                overflow: 'hidden',
                animation: 'slideUp 0.5s ease-out both',
            }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
                }}
            >
                {/* Badge */}
                {book.discountPercent !== 0 && (
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                        background: outOfStock ? '#DC2626' : '#2C7B8F',
                        color: '#fff', borderRadius: '20px', padding: '2px 9px',
                        fontSize: '11px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    }}>
                        {outOfStock ? 'Hết hàng' : `-${book.discountPercent}%`}
                    </div>
                )}

                {/* Cover Image */}
                <Link to={`/book/${book.idBook}`} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden', 
                    background: '#F8FAFC',
                    height: '250px',
                    padding: '16px'
                }}>
                    <img
                        src={imageList[0]?.urlImage ?? "/images/books/hinh_nen_sach.jpg"}
                        alt={book.nameBook}
                        onLoad={() => setImgLoaded(true)}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            display: 'block',
                            transition: 'transform 0.4s ease',
                            opacity: imgLoaded ? 1 : 0.8,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            borderRadius: '4px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </Link>

                {/* Body */}
                <div style={{ padding: '14px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Link to={`/book/${book.idBook}`} style={{ textDecoration: 'none' }}>
                        <Tooltip title={book.nameBook} arrow>
                            <h5 style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '14.5px', fontWeight: 400, color: '#111827',
                                margin: 0, display: '-webkit-box',
                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                overflow: 'hidden', lineHeight: 1.45,
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#2C7B8F'}
                                onMouseLeave={e => e.currentTarget.style.color = '#111827'}
                            >
                                {book.nameBook}
                            </h5>
                        </Tooltip>
                    </Link>

                    {book.author && (
                        <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
                            {book.author}
                        </p>
                    )}

                    {/* Price */}
                    <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '17px', fontWeight: 700, color: '#2C7B8F' }}>
                                {book.sellPrice?.toLocaleString()}đ
                            </span>
                            {book.discountPercent !== 0 && (
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#D1D5DB', textDecoration: 'line-through' }}>
                                    {book.listPrice?.toLocaleString()}đ
                                </span>
                            )}
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#D1D5DB', fontFamily: "'DM Sans', sans-serif" }}>
                            Đã bán {book.soldQuantity}
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                            onClick={handleToggleFavorite}
                            disabled={loading}
                            title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                            style={{
                                flexShrink: 0, width: '36px', height: '36px',
                                border: `1.5px solid ${isFavorite ? '#FCA5A5' : '#E5E7EB'}`,
                                borderRadius: '8px',
                                background: isFavorite ? '#FEF2F2' : 'transparent',
                                color: isFavorite ? '#DC2626' : '#9CA3AF',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease', fontFamily: 'inherit',
                            }}
                        >
                            {isFavorite ? (
                                <FavoriteIcon sx={{ fontSize: '18px', color: '#E11D48' }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ fontSize: '18px' }} />
                            )}
                        </button>
                        {!outOfStock && (
                            <button
                                onClick={isToken() ? handleAddProduct : () => navigation("/login")}
                                title="Thêm vào giỏ hàng"
                                style={{
                                    flex: 1, padding: '8px 12px', height: '36px',
                                    border: '1.5px solid #2C7B8F', borderRadius: '8px',
                                    background: 'transparent', color: '#2C7B8F',
                                    cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                                    transition: 'all 0.22s ease', fontFamily: "'DM Sans', sans-serif",
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#2C7B8F'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2C7B8F'; }}
                            >
                                <ShoppingCartOutlinedIcon sx={{ fontSize: '16px' }} />
                                + Giỏ hàng
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookProps;
