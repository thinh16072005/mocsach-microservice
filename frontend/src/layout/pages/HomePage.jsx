import React from "react";
import { Link } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import useScrollToTop from "../../hooks/ScrollToTop";

const HomePage = () => {
    useScrollToTop();

    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)",
            minHeight: "calc(100vh - 120px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px"
        }}>
            <div style={{
                maxWidth: "800px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                padding: "60px 40px",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.6)"
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #EEF8FA 0%, #2C7B8F 100%)",
                    borderRadius: "20px",
                    marginBottom: "24px",
                    boxShadow: "0 10px 20px rgba(44, 123, 143, 0.15)"
                }}>
                    <MenuBookIcon sx={{ color: "#fff", fontSize: 40 }} />
                </div>
                <h1 style={{
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "#0F172A",
                    marginBottom: "16px",
                    letterSpacing: "-0.5px"
                }}>
                    Chào mừng bạn đến với <span style={{ color: "#2C7B8F" }}>Mộc Sách</span>
                </h1>
                <p style={{
                    fontSize: "18px",
                    color: "#475569",
                    lineHeight: 1.6,
                    marginBottom: "36px",
                    maxWidth: "600px",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    Nền tảng chia sẻ tri thức và kết nối đam mê đọc sách. Hãy tạo tài khoản ngay hôm nay để bắt đầu hành trình khám phá thế giới tri thức vô tận của chúng tôi.
                </p>
                <div>
                    <Link to="/register" style={{
                        display: "inline-block",
                        padding: "14px 32px",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#fff",
                        background: "linear-gradient(135deg, #2C7B8F 0%, #1A5E70 100%)",
                        borderRadius: "12px",
                        textDecoration: "none",
                        boxShadow: "0 10px 20px rgba(44, 123, 143, 0.2)",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(44, 123, 143, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(44, 123, 143, 0.2)";
                    }}>
                        Đăng ký tài khoản mới
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
