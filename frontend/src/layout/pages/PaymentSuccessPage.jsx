import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getIdUserByToken } from "../utils/JwtService";
import { endpointBE } from "../utils/Constant";

export const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {

        //Lấy token
        const token = localStorage.getItem("token");

        const createOrder = async () => {

            //Lấy thông tin đơn hàng từ localStorage
            const orderRequest = JSON.parse(localStorage.getItem('pendingOrder') || '{}');

            const request = {
                deliveryAddress: orderRequest.deliveryAddress,
                phoneNumber: orderRequest.phoneNumber,
                fullName: orderRequest.fullName,
                totalPriceProduct: orderRequest.totalPriceProduct,
                note: orderRequest.note,
                paymentId: orderRequest.paymentId,
                deliveryId: orderRequest.deliveryId || 1,
                orderItems: orderRequest.orderItems,
                totalPrice: orderRequest.totalPrice,
                paymentStatus: "PAID"
            }
            localStorage.removeItem('pendingOrder');

            try {
                const endPoint = endpointBE + "/orders";
                const response = await fetch(endPoint, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                });

                if (response.ok) {
                    toast.success("Đặt hàng thành công!");
                }
                else {
                    toast.error("Đặt hàng thất bại!");
                }
            } catch (error) {
                toast.error("Lỗi hệ thống: Đặt hàng thất bại!");
            }
        }
        createOrder();
    }, []);

    return (
        <>
            <div style={{
                minHeight: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f9f9f9",
            }}>
                <div style={{
                    background: "white",
                    borderRadius: "14px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                    minWidth: "340px",
                    maxWidth: "420px",
                    padding: "40px 32px",
                    textAlign: "center"
                }}>
                    <svg style={{ marginBottom: 16 }} fill="none" height="55" viewBox="0 0 24 24" width="55">
                        <circle cx="12" cy="12" r="12" fill="#43C851" />
                        <path d="M7 13.5L10.5 17L17 10.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 style={{ margin: "16px 0 8px", color: "#223", fontWeight: 700 }}>Đặt hàng thành công!</h2>
                    <p style={{ color: "#555", fontSize: 17, marginBottom: 20 }}>
                        Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.<br />
                        Đơn hàng của bạn đã được đặt thành công.<br />
                        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.<br />
                    </p>
                    <button
                        style={{
                            background: "#43C851",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "20px",
                            padding: "12px 32px",
                            cursor: "pointer",
                            marginTop: 10,
                        }}
                        onClick={() => navigate("/")}
                    >
                        Về Trang Chủ
                    </button>
                </div>
            </div>
        </>
    );
};
