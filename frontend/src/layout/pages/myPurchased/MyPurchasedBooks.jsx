import React, { useEffect, useState } from "react";
import {
    Container, Typography, Card, CardContent, CardMedia, Button,
    Box, Rating, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from "@mui/material";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { endpointBE } from "../../utils/Constant";

export const MyPurchasedBooks = () => {
    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState(0);

    // 1. Lấy User ID từ Token và Load dữ liệu
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                // In ra Token để kiểm tra
                console.log("ĐÃ GIẢI MÃ TOKEN:", decoded);

                // Lấy đúng trường ID (Thử 'idUser' theo file User.java)
                const id = decoded.idUser || decoded.id || decoded.sub;

                if (id) {
                    console.log("TÌM THẤY USER ID:", id);
                    setUserId(id);
                    loadData(id);
                } else {
                    console.error("LỖI: Không tìm thấy ID ('idUser' hoặc 'id') trong Token.");
                }
            } catch (e) {
                console.error("Lỗi giải mã token:", e);
            }
        } else {
            console.error("Lỗi: Chưa đăng nhập, không tìm thấy token.");
        }
    }, []);

    const loadData = (id) => {
        const token = localStorage.getItem("token");
        fetch(`${endpointBE}/orders/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Server response not OK");
                }
                return res.json();
            })
            .then((res) => {
                const orders = res.data || [];
                const itemsToReview = [];
                orders.forEach(order => {
                    if (order.listOrderDetails) {
                        order.listOrderDetails.forEach(detail => {
                            if (!detail.reviewed) {
                                itemsToReview.push({
                                    idOrderDetail: detail.idOrderDetail,
                                    orderId: order.idOrder,
                                    dateCreated: order.dateCreated,
                                    bookId: detail.bookId,
                                    bookName: detail.book?.nameBook || "Sách không tên",
                                    author: detail.book?.author || "Chưa rõ",
                                    bookImage: detail.book?.images?.[0]?.urlImage || "/images/books/hinh_nen_sach.jpg"
                                });
                            }
                        });
                    }
                });
                setBooks(itemsToReview);
            })
            .catch((err) => {
                console.error("Lỗi load sách:", err);
                toast.error("Lỗi khi tải dữ liệu. Vui lòng F5.");
            });
    };

    // 2. Mở Dialog
    const handleOpenReview = (item) => {
        setSelectedItem(item);
        setRating(5);
        setContent("");
        setOpen(true);
    };

    // 3. Gửi đánh giá
    const handleSubmitReview = () => {
        const token = localStorage.getItem("token");

        const payload = {
            bookId: selectedItem.bookId,
            ratingPoint: rating,
            content: content,
            orderDetailId: selectedItem.idOrderDetail
        };

        // 1. Gửi review lên book-service
        fetch(endpointBE + "/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-User-Id": userId,
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (res.ok) {
                    // 2. Đánh dấu đã đánh giá trong order-service
                    try {
                        await fetch(`${endpointBE}/orders/details/${selectedItem.idOrderDetail}/reviewed`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        });
                    } catch (e) {
                        console.error("Lỗi đánh dấu orderDetail:", e);
                    }
                    toast.success("Đánh giá thành công!");
                    setOpen(false);
                    loadData(userId); // Load lại danh sách
                } else {
                    const errorText = await res.text();
                    toast.error("Lỗi: " + errorText);
                }
            })
            .catch(() => toast.error("Lỗi kết nối server"));
    };

    return (
        <Container sx={{ mt: 4, mb: 8, minHeight: '60vh' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2' }}>
                Đánh Giá Sách Đã Mua
            </Typography>

            {books.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 5, color: 'gray' }}>
                    <Typography variant="h6">Bạn đã đánh giá hết các đơn hàng rồi!</Typography>
                </Box>
            ) : (
                books.map((item) => (
                    // [SỬA] Dùng các trường DTO
                    <Card key={item.idOrderDetail} sx={{ display: "flex", mb: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 120, height: 160, objectFit: "contain", borderRadius: 1, bgcolor: '#f5f5f5' }}
                            image={item.bookImage || "https://via.placeholder.com/150"} // Sửa
                            alt={item.bookName} // Sửa
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, ml: 3 }}>
                            <CardContent sx={{ flex: "1 0 auto", p: 0, pt: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.bookName}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">Tác giả: {item.author}</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Chip label={`Đơn hàng #${item.orderId}`} size="small" color="primary" variant="outlined" />
                                    <Chip label={`Ngày mua: ${new Date(item.dateCreated).toLocaleDateString('vi-VN')}`} size="small" sx={{ ml: 1 }} />
                                </Box>
                            </CardContent>
                            <Box sx={{ mt: 2 }}>
                                <Button variant="contained" color="warning" onClick={() => handleOpenReview(item)}>
                                    Viết Đánh Giá
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                ))
            )}

            {/* Dialog Đánh Giá */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Đánh giá: <strong>{selectedItem?.bookName}</strong></DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: 2 }}>
                        <Typography component="legend">Mức độ hài lòng</Typography>
                        <Rating value={rating} onChange={(e, v) => setRating(v)} size="large" />
                    </Box>
                    <TextField
                        autoFocus margin="dense" label="Nhận xét của bạn" type="text" fullWidth multiline rows={4}
                        variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="inherit">Hủy</Button>
                    <Button onClick={handleSubmitReview} variant="contained" color="primary">Gửi</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
