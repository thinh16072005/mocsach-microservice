import { useNavigate, useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useEffect, useState } from "react";
import { getBookById, searchBook } from "../../api/BookApi";
import { getGenreByIdBook } from "../../api/GenreApi";
import { getAllImageByBook } from "../../api/ImageApi";
import BookProps from "./components/BookProps";
import { Skeleton } from "@mui/material";
import RatingStar from "./components/rating/Rating";
import SelectQuantity from "./components/select-quantity/SelectQuantity";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Comment from "./components/comment/Comment";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { CheckoutPage } from "../pages/CheckoutPage";
import { getCartAllByIdUser, updateQuantityCartItem, addCartItem } from "../../api/CartApi";

const BookDetail = (props) => {
    useScrollToTop();
    const navigate = useNavigate();

    const [cartList, setCartList] = useState([]);
    const [totalPriceProduct, setTotalPriceProduct] = useState(0);
    const [isCheckout, setIsCheckout] = useState(false);

    const { idBook } = useParams();
    let idBookNumber = 0;
    try {
        idBookNumber = parseInt(idBook + "");
        if (Number.isNaN(idBookNumber)) idBookNumber = 0;
    } catch (error) { console.error("Error:", error); }

    const [book, setBook]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [erroring, setErroring] = useState(null);
    const [genres, setGenres]   = useState(null);
    const [images, setImages]   = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        setLoading(true);
        getBookById(idBookNumber)
            .then(r => { setBook(r); setLoading(false); })
            .catch(e => { setLoading(false); setErroring(e.message); });
    }, [idBookNumber]);

    useEffect(() => { 
        getGenreByIdBook(idBookNumber).then(setGenres); 
    }, [idBookNumber]);

    useEffect(() => { 
        getAllImageByBook(idBookNumber).then(setImages).catch(console.error); 
    }, [idBookNumber]);

    useEffect(() => {
        setQuantity(1);
        setIsCheckout(false);
    }, [idBookNumber]);

    useEffect(() => {
        if (genres && genres.length > 0) {
            setLoadingRecommendations(true);
            const primaryGenreId = genres[0].idGenre;
            searchBook(primaryGenreId, "", 5, 0)
                .then(res => {
                    const filtered = (res.bookList || [])
                        .filter(b => b.idBook !== idBookNumber)
                        .slice(0, 4);
                    setRecommendedBooks(filtered);
                    setLoadingRecommendations(false);
                })
                .catch(err => {
                    console.error("Error fetching recommendations:", err);
                    setLoadingRecommendations(false);
                });
        } else {
            setRecommendedBooks([]);
        }
    }, [genres, idBookNumber]);

    const add    = () => { if (quantity < (book?.quantity ?? 1)) setQuantity(q => q + 1); };
    const reduce = () => { if (quantity > 1) setQuantity(q => q - 1); };

    const handleAddProduct = async (book) => {
        const cartList = await getCartAllByIdUser();
        const existing = cartList.find(c => c.book?.idBook === book.idBook);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + quantity;
            try { await updateQuantityCartItem(existing); } catch (e) { console.error(e); }
            return;
        }
        await addCartItem(book.idBook, quantity);
    };

    const handleBuyNow = (book) => {
        setCartList([{ book, quantity, idUser: Number(getIdUserByToken()) }]);
        if (book.sellPrice) setTotalPriceProduct(book.sellPrice * quantity);
        setIsCheckout(!isCheckout);
    };

    /* ─── Loading ─── */
    if (loading) return (
        <div className='container my-4' style={{ background: '#fff', borderRadius: '16px', padding: '32px' }}>
            <div className='row'>
                <div className='col-4'><Skeleton variant='rectangular' height={400} style={{ borderRadius: '12px' }} /></div>
                <div className='col-8 ps-5'>
                    <Skeleton variant='rectangular' height={36} style={{ borderRadius: '8px', marginBottom: '16px' }} />
                    <Skeleton variant='rectangular' height={20} style={{ borderRadius: '8px', marginBottom: '12px' }} />
                    <Skeleton variant='rectangular' height={20} style={{ borderRadius: '8px', marginBottom: '12px', width: '60%' }} />
                    <Skeleton variant='rectangular' height={80} style={{ borderRadius: '8px', marginTop: '24px' }} />
                </div>
            </div>
        </div>
    );

    if (erroring) return (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif" }}>Gặp lỗi: {erroring}</h2>
        </div>
    );

    if (!book) return (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif" }}>Sách không tồn tại</h2>
        </div>
    );

    return (
        <>
            {isCheckout ? (
                <CheckoutPage cartList={cartList} totalPriceProduct={totalPriceProduct} setIsCheckout={setIsCheckout} />
            ) : (
                <>
                    {/* ══ Main Panel ══ */}
                    <div className='container my-4 animate-slide-up' style={{
                        background: '#fff', borderRadius: '16px',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                        padding: '32px', fontFamily: "'DM Sans', sans-serif",
                    }}>
                        <div className='row'>
                            {/* Cover */}
                            <div className='col-lg-4 col-md-5 col-sm-12'>
                                <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#F8FAFC' }}>
                                    <Carousel emulateTouch showIndicators={false} showArrows showThumbs={false}>
                                        {images?.map((img, i) => (
                                            <div key={i} style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                                                <img
                                                    src={img.urlImage}
                                                    alt={book.nameBook}
                                                    style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            </div>

                            {/* Info */}
                            <div className='col-lg-8 col-md-7 col-sm-12 ps-lg-5 mt-4 mt-md-0'>
                                {/* Title */}
                                <h1 style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '28px', fontWeight: 400, color: '#111827',
                                    lineHeight: 1.3, marginBottom: '14px'
                                }}>
                                    {book.nameBook}
                                </h1>

                                {/* Meta */}
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13.5px', color: '#9CA3AF', marginBottom: '16px' }}>
                                    <span>Thể loại:&nbsp;
                                        <strong style={{ color: '#374151' }}>{genres?.map(g => g.nameGenre).join(', ')}</strong>
                                    </span>
                                    <span style={{ color: '#E5E7EB' }}>·</span>
                                    <span>Tác giả:&nbsp;
                                        <strong style={{ color: '#374151' }}>{book.author}</strong>
                                    </span>
                                </div>

                                {/* Rating */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    <RatingStar readonly ratingPoint={book.avgRating} />
                                    <span style={{ fontSize: '13px', color: '#2C7B8F', fontWeight: 600 }}>{book.avgRating}</span>
                                    <span style={{ color: '#E5E7EB' }}>|</span>
                                    <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
                                        Đã bán <strong style={{ color: '#6B7280' }}>{book.soldQuantity}</strong>
                                    </span>
                                </div>

                                {/* Price Box */}
                                <div style={{
                                    background: '#EEF8FA', borderRadius: '10px',
                                    padding: '18px 22px', marginBottom: '20px',
                                    display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap'
                                }}>
                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 800, color: '#2C7B8F' }}>
                                        {book.sellPrice?.toLocaleString()}đ
                                    </span>
                                    {book.listPrice && (
                                        <span style={{ fontSize: '15px', color: '#CBD5E1', textDecoration: 'line-through', fontFamily: "'DM Sans', sans-serif" }}>
                                            {book.listPrice?.toLocaleString()}đ
                                        </span>
                                    )}
                                    {book.discountPercent > 0 && (
                                        <span style={{
                                            background: '#2C7B8F', color: '#fff', borderRadius: '20px',
                                            padding: '3px 10px', fontSize: '12px', fontWeight: 600,
                                            fontFamily: "'DM Sans', sans-serif"
                                        }}>
                                            −{book.discountPercent}%
                                        </span>
                                    )}
                                </div>

                                {/* Shipping */}
                                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#2C7B8F', fontSize: '14px' }}>✦</span> Miễn phí vận chuyển toàn quốc
                                </div>

                                {/* Quantity */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500, minWidth: '72px' }}>Số lượng:</span>
                                    <SelectQuantity max={book.quantity} quantity={quantity} add={add} reduce={reduce} setQuantity={setQuantity} />
                                    <span style={{ fontSize: '13px', color: '#D1D5DB' }}>{book.quantity} có sẵn</span>
                                </div>

                                {/* CTA */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {book.quantity === 0 ? (
                                        <div style={{
                                            padding: '11px 24px', borderRadius: '10px',
                                            border: '1.5px solid #FCA5A5', color: '#DC2626',
                                            fontSize: '14px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif"
                                        }}>
                                            Hết hàng
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                style={{
                                                    padding: '11px 26px', borderRadius: '10px',
                                                    border: '1.5px solid #2C7B8F', background: 'transparent',
                                                    color: '#2C7B8F', fontSize: '14px', fontWeight: 600,
                                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                                    transition: 'all 0.22s ease',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#2C7B8F'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2C7B8F'; }}
                                                onClick={isToken() ? () => handleAddProduct(book) : () => navigate("/login")}
                                            >
                                                Thêm vào giỏ
                                            </button>
                                            <button
                                                style={{
                                                    padding: '11px 30px', borderRadius: '10px',
                                                    border: 'none', background: '#2C7B8F',
                                                    color: '#fff', fontSize: '14px', fontWeight: 600,
                                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                                    transition: 'background 0.22s ease',
                                                    boxShadow: '0 4px 12px rgba(44,123,143,0.25)',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#1A5E70'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#2C7B8F'; }}
                                                onClick={isToken() ? () => handleBuyNow(book) : () => navigate("/login")}
                                            >
                                                Mua ngay
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══ Description ══ */}
                    <div className='container my-3' style={{
                        background: '#fff', borderRadius: '16px',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.05)', padding: '28px 32px'
                    }}>
                        <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 400, color: '#111827', marginBottom: '14px' }}>
                            Mô tả sản phẩm
                        </h5>
                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
                            <p style={{
                                fontFamily: "'DM Sans', sans-serif", fontSize: '14.5px',
                                color: '#4B5563', lineHeight: '1.85', whiteSpace: 'pre-wrap', margin: 0
                            }}>
                                {book.description}
                            </p>
                        </div>
                    </div>
 
                    {/* ══ Recommended Books ══ */}
                    {recommendedBooks.length > 0 && (
                        <div className='container my-3' style={{
                            background: '#fff', borderRadius: '16px',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.05)', padding: '28px 32px'
                        }}>
                            <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>
                                Sách cùng thể loại
                            </h5>
                            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>
                                Có thể bạn cũng thích những cuốn sách thuộc thể loại này
                            </p>
                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                                <div className='row'>
                                    {recommendedBooks.map((recBook) => (
                                        <BookProps key={recBook.idBook} book={recBook} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ Reviews ══ */}
                    <div className='container my-3 mb-5' style={{
                        background: '#fff', borderRadius: '16px',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.05)', padding: '28px 32px'
                    }}>
                        <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 400, color: '#111827', marginBottom: '14px' }}>
                            Đánh giá của khách hàng
                        </h5>
                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
                            <Comment idBook={idBookNumber} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default BookDetail;
