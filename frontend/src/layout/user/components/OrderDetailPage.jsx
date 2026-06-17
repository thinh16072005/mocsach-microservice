import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cancel1Order, get1Order } from "../../../api/OrderApi";
import {
    Typography,
    Chip,
    CircularProgress,
    Box,
    Button,
} from "@mui/material";
import {
    PersonOutline,
    LocationOnOutlined,
    PaymentOutlined,
    LocalShippingOutlined,
    ReceiptOutlined,
    CalendarTodayOutlined,
    NoteOutlined,
    PhoneOutlined,
    ArrowBackOutlined,
    HighlightOffOutlined,
} from "@mui/icons-material";
import { get1OrderDetail } from "../../../api/OrderDetailApi";
import BookOrderDetail from "./BookOrderDetail";

export const OrderDetailPage = () => {
    const { idOrder } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderDetail, setOrderDetail] = useState([]);

    const getStatusColor = (status) => {
        if (status === "Thành công") return "success";
        if (status === "Đang xử lý") return "info";
        if (status === "Đang giao hàng") return "warning";
        return "error";
    };

    // Lấy 1 đơn hàng
    useEffect(() => {
        get1Order(Number(idOrder))
            .then((response) => {
                setOrder(response);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });

        get1OrderDetail(Number(idOrder))
            .then((response) => {
                setOrderDetail(response);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [idOrder]);

    const cancelOrder = (order) => {
        if (order) {
            order.status = "Bị huỷ";
            cancel1Order(order)
                .then(() => {
                    // Huỷ đơn xong, gọi lại API để reload dữ liệu mới
                    return get1Order(Number(idOrder));
                })
                .then((response) => {
                    setOrder(response); // Cập nhật lại dữ liệu đơn hàng
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "80px 20px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <Typography variant="h6">Không tìm thấy đơn hàng</Typography>
            </div>
        );
    }

    return (
        <div className='container my-3'>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div className='bg-light rounded-3 p-3 mb-3'>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: "transparent",
                            border: "none",
                            padding: "4px 0",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#666",
                            marginBottom: "16px",
                            fontSize: "14px",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#333";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#666";
                        }}
                    >
                        <ArrowBackOutlined fontSize="small" />
                        <span>Quay lại</span>
                    </button>
                    <div>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ marginBottom: "8px", fontSize: "13px" }}
                        >
                            Chi tiết đơn hàng
                        </Typography>
                        <Typography
                            variant="h4"
                            style={{
                                fontWeight: 700,
                                color: "#1a1a1a",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Đơn hàng{" "}
                            <span
                                style={{
                                    color: "#9c27b0",
                                    fontWeight: 700,
                                }}
                            >
								#{order.idOrder}
							</span>
                        </Typography>
                    </div>
                </div>

                {order.status === "Đang xử lý" && (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<HighlightOffOutlined />}
                        onClick={() => cancelOrder(order)}
                        sx={{
                            marginBottom: "10px",
                            fontWeight: 500,
                            borderRadius: "6px",
                            fontSize: "13px",
                            px: 1.5,
                            py: 0.3,
                            minWidth: "unset",
                            textTransform: "none",
                            boxShadow: "none",
                            '&:hover': {
                                backgroundColor: "#c62828",
                            },
                        }}
                    >
                        Hủy đơn hàng
                    </Button>

                )}

                {/* Main Card */}
                <div className='bg-light rounded-3 mb-3'>
                    {/* Status Bar */}
                    <div
                        style={{
                            padding: "20px",
                            backgroundColor: "white",
                            borderBottom: "1px solid #dee2e6",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Typography variant="body2" color="textSecondary">
                                Trạng thái đơn hàng
                            </Typography>
                            <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                                size="medium"
                                style={{ marginTop: "8px", fontWeight: 500 }}
                            />
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <Typography variant="body2" color="textSecondary">
                                Ngày đặt hàng
                            </Typography>
                            <Typography variant="body1" style={{ marginTop: "4px", fontWeight: 500 }}>
                                {order.dateCreated?.toString()}
                            </Typography>
                        </div>
                    </div>

                    {/* Content */}
                    <div className='p-3' style={{ backgroundColor: "white" }}>
                        {/* Grid Layout */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "24px",
                            }}
                        >
                            {/* Thông tin khách hàng */}
                            <div>
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: 600,
                                        marginBottom: "16px",
                                        color: "#333",
                                    }}
                                >
                                    Thông tin khách hàng
                                </Typography>

                                {/* Họ và tên */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <PersonOutline />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Họ và tên
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.fullName || "—"}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Số điện thoại */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <PhoneOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Số điện thoại
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.phoneNumber || "—"}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Địa chỉ giao hàng */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <LocationOnOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Địa chỉ giao hàng
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.deliveryAddress || "—"}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Ghi chú */}
                                {order.note && (
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                        <div style={{ color: "#666", marginTop: "2px" }}>
                                            <NoteOutlined />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                                Ghi chú
                                            </Typography>
                                            <Typography variant="body1" style={{ fontWeight: 500 }}>
                                                {order.note}
                                            </Typography>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin thanh toán */}
                            <div>
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: 600,
                                        marginBottom: "16px",
                                        color: "#333",
                                    }}
                                >
                                    Thông tin đơn hàng
                                </Typography>
                                {/* Mã đơn hàng */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <ReceiptOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Mã đơn hàng
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            #{order.idOrder}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Ngày tạo */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <CalendarTodayOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Ngày tạo
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.dateCreated?.toString() || "—"}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Ngày nhận hàng dự kiến */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <CalendarTodayOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Ngày nhận hàng dự kiến
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.dateCreated
                                                ? (() => {
                                                    const date = new Date(order.dateCreated);
                                                    date.setDate(date.getDate() + 3);
                                                    const year = date.getFullYear();
                                                    const month = `${date.getMonth() + 1}`.padStart(2, "0");
                                                    const day = `${date.getDate()}`.padStart(2, "0");
                                                    return `${year}-${month}-${day}`;
                                                })()
                                                : "—"}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Phương thức thanh toán */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <PaymentOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Phương thức thanh toán
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.namePayment || "—"}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Phương thức vận chuyển */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ color: "#666", marginTop: "2px" }}>
                                        <LocalShippingOutlined />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
                                            Phương thức vận chuyển
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {order.nameDelivery || "—"}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div
                            style={{
                                marginTop: "24px",
                                padding: "20px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <Typography
                                variant="h6"
                                style={{ fontWeight: 600, marginBottom: "16px", color: "#333" }}
                            >
                                Chi tiết thanh toán
                            </Typography>
                            {/* Tổng tiền sản phẩm */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <Typography variant="body1" style={{ fontWeight: 400, color: "#666" }}>
                                    Tổng số tiền sách
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 500, color: "#333" }}>
                                    {Number.parseInt(order.totalPriceProduct.toString()).toLocaleString("vi-vn")} đ
                                </Typography>
                            </div>

                            {/* Phí vận chuyển */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <Typography variant="body1" style={{ fontWeight: 400, color: "#666" }}>
                                    Phí vận chuyển
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 500, color: "#333" }}>
                                    {Number.parseInt(order.feeDelivery.toString()).toLocaleString("vi-vn")} đ
                                </Typography>
                            </div>

                            {/* Phí thanh toán */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <Typography variant="body1" style={{ fontWeight: 400, color: "#666" }}>
                                    Phí thanh toán
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 500, color: "#333" }}>
                                    {Number.parseInt(order.feePayment.toString()).toLocaleString("vi-vn")} đ
                                </Typography>
                            </div>

                            <div
                                style={{
                                    marginTop: "16px",
                                    paddingTop: "16px",
                                    borderTop: "2px solid #e0e0e0",
                                }}
                            >
                                {/* Tổng thanh toán */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0" }}>
                                    <Typography variant="h6" style={{ fontWeight: 600, color: "#333" }}>
                                        Tổng thanh toán
                                    </Typography>
                                    <Typography variant="h6" style={{ fontWeight: 700, color: "#d32f2f" }}>
                                        {Number.parseInt(order.totalPrice.toString()).toLocaleString("vi-vn")} đ
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-light rounded-3 mt-3'>
                    <div className='p-3'>
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: "0", color: "#333" }}>
                            Các sách có trong đơn hàng
                        </Typography>
                    </div>
                    <div className='bg-white mx-3 mb-3 rounded' style={{ padding: "20px" }}>
                        <div className='row'>
                            {orderDetail.map((orderDetail) => (
                                <BookOrderDetail key={orderDetail.idOrderDetail} orderDetail={orderDetail} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
