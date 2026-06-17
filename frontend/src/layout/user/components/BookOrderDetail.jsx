import { Link } from "react-router-dom";

const BookOrderDetail = ({ orderDetail }) => {
    const book = orderDetail?.book;
    if (!book) return null;

    const imageList = book.images || [];
    const imageUrl = imageList[0]?.urlImage || "/images/books/hinh-nen-sach.jpg";

    return (
        <div className='col-12'>
            <div 
                className='d-flex mb-3 pb-3' 
                style={{ 
                    borderBottom: "1px solid #eaeaea",
                    gap: "16px"
                }}
            >
                <Link to={`/book/${book.idBook}`} className="d-block flex-shrink-0">
                    <img
                        src={imageUrl}
                        className='img-fluid rounded'
                        alt={book.nameBook}
                        style={{ 
                            width: "80px", 
                            height: "110px", 
                            objectFit: "cover", 
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "transform 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.03)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    />
                </Link>
                <div className='d-flex flex-column flex-grow-1 min-w-0'>
                    <Link 
                        to={`/book/${book.idBook}`} 
                        style={{ 
                            textDecoration: "none", 
                            color: "#1a1a1a",
                            fontWeight: 600,
                            fontSize: "15px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#9c27b0";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#1a1a1a";
                        }}
                    >
                        {book.nameBook}
                    </Link>
                    
                    <span className="text-muted small mt-1">
                        Tác giả: {book.author || "—"}
                    </span>

                    <div className='mt-auto pt-2 d-flex flex-wrap align-items-center justify-content-between gap-2'>
                        <div className='d-flex align-items-center gap-2'>
                            <span className='text-danger font-weight-bold' style={{ fontSize: "16px", fontWeight: 700 }}>
                                {book.sellPrice?.toLocaleString()}đ
                            </span>
                            {book.discountPercent !== 0 && (
                                <span className='text-muted small text-decoration-line-through'>
                                    {book.listPrice?.toLocaleString()}đ
                                </span>
                            )}
                        </div>
                        <div className="d-flex align-items-center gap-3 text-secondary small">
                            <span>
                                Số lượng: <strong className="text-dark">{orderDetail.quantity}</strong>
                            </span>
                            <span className="text-danger font-weight-bold">
                                Tổng: <strong>{((orderDetail.quantity || 0) * (book.sellPrice || 0)).toLocaleString()}đ</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookOrderDetail;
