// quan ly frontend : quan ly feedback
// Đây là trang "cha" mà admin sẽ truy cập. Nó dùng RequireAdmin để bảo vệ chính nó, sau đó hiển thị FeedbackTable bên trong.

import RequireAdmin from "./RequireAdmin";
import { FeedbackTable } from "./components/FeedbackTable";
import React, { useState } from "react";
import FeedbackModel from "../../model/FeedbackModel";
import SearchIcon from "@mui/icons-material/Search";

const FeedbackManagement = () => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const handleReload = () => {
        setReloadKey(prev => prev + 1);
    };

    return (
        <div className='container my-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '22px', color: '#1E293B', margin: 0 }}>
                    Quản lý Feedback
                </h3>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <SearchIcon style={{ position: "absolute", left: "10px", color: "#94A3B8", fontSize: "18px" }} />
                    <input
                        className='form-control'
                        placeholder='Tìm theo tiêu đề hoặc người dùng...'
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ width: 300, paddingLeft: "34px", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "13.5px" }}
                    />
                </div>
            </div>

            <FeedbackTable
                searchKeyword={searchKeyword}
                reloadKey={reloadKey}
                onFeedbackSelected={setSelectedFeedback}
                onReload={handleReload}
            />
        </div>
    );
};

const FeedbackPage = RequireAdmin(FeedbackManagement);
export default FeedbackPage;
