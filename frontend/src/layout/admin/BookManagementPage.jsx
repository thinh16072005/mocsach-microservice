import React, { useState } from "react";
import { BookTable } from "./components/BookTable";
import BookModel from "../../model/BookModel";
import { BookForm } from "./components/BookForm";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const BookManagementPage = () => {
    const [keyCountReload, setKeyCountReload] = useState(0);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedBook(null);
    };

    const handleReload = () => {
        setKeyCountReload((prev) => prev + 1);
    };

    return (
        <div className='container my-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '22px', color: '#1E293B', margin: 0 }}>
                    Quản lý sách
                </h3>
                <div className='d-flex gap-2'>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <SearchIcon style={{ position: "absolute", left: "10px", color: "#94A3B8", fontSize: "18px" }} />
                        <input
                            className='form-control'
                            placeholder='Tìm theo tên sách hoặc tác giả...'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ width: 300, paddingLeft: "34px", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "13.5px" }}
                        />
                    </div>
                    <button
                        className='btn btn-primary'
                        onClick={handleOpenForm}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <AddIcon sx={{ fontSize: 18 }} /> Thêm sách mới
                    </button>
                </div>
            </div>

            {/* Bảng sách */}
            <BookTable
                keyCountReload={keyCountReload}
                setBookData={setSelectedBook}
                handleOpenForm={handleOpenForm}
                onDeleteSuccess={handleReload}
                searchKeyword={searchKeyword}
            />

            {/* Form thêm/sửa */}
            <BookForm
                open={openForm}
                onClose={handleCloseForm}
                bookData={selectedBook}
                onSuccess={handleReload}
            />
        </div>
    );
};



export default BookManagementPage;
