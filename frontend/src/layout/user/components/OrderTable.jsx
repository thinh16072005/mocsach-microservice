import { useEffect, useState } from "react";
import OrderModel from "../../../model/OrderModel";
import { getIdUserByToken } from "../../utils/JwtService";
import { getAllOrdersByIdUser } from "../../../api/OrderApi";
import { Box, Chip, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { VisibilityOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const OrderTable = (props) => {
    const [loading, setLoading] = useState(true);

    // Tạo biến để lấy tất cả các đơn hàng
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const idUser = Number(getIdUserByToken());
        getAllOrdersByIdUser(idUser)
            .then((response) => {
                const orders = response;
                setOrders(orders);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, []);

    const getStatusColor = (
        status
    ) => {
        if (status === "Thành công") return "success";
        if (status === "Đang xử lý") return "info";
        if (status === "Đang giao hàng") return "warning";
        return "error";
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        ID
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        TÊN KHÁCH HÀNG
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        NGÀY TẠO
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        TỔNG TIỀN
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        TRẠNG THÁI
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        THANH TOÁN
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "bold" }}>
                        HÀNH ĐỘNG
                    </th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr
                        key={order.idOrder}
                        style={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                        <td style={{ padding: "16px" }}>{order.idOrder}</td>
                        <td style={{ padding: "16px" }}>{order.fullName}</td>
                        <td style={{ padding: "16px" }}>{order.dateCreated.toString()}</td>
                        <td style={{ padding: "16px" }}>
                            {Number.parseInt(order.totalPrice.toString()).toLocaleString(
                                "vi-vn"
                            )}đ
                        </td>
                        <td style={{ padding: "16px" }}>
                            <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                                size="small"
                                variant="outlined"
                            />
                        </td>
                        <td style={{ padding: "16px" }}>{order.namePayment}</td>
                        <td style={{ padding: "16px" }}>
                            <Tooltip title="Chi tiết">
                                <Link to={`/order/${order.idOrder}`}>
                                    <IconButton size="small" color="primary">
                                        <VisibilityOutlined fontSize="small" />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
