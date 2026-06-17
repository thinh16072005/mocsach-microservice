/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

import BookModel from "../../model/BookModel";
import BookProps from "./components/BookProps";
import { Button, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { getIdUserByToken } from "../utils/JwtService";
import { getBookById } from "../../api/BookApi";
import { getFavoriteBooksByUser } from "../../api/FavouriteBookApi";

const FavoriteBooksList = (props) => {
    const [bookList, setBookList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadData, setReloadData] = useState(0);

    useEffect(() => {
        const fetchFavoriteBooks = async () => {
            try {
                setLoading(true);
                const idUser = Number(getIdUserByToken());

                // Kiểm tra idUser có hợp lệ không
                if (!idUser || isNaN(idUser)) {
                    setBookList([]);
                    setLoading(false);
                    return;
                }

                // 1. Lấy danh sách ID sách yêu thích
                const idBookList = await getFavoriteBooksByUser(idUser);

                if (!idBookList || idBookList.length === 0) {
                    setBookList([]);
                    setLoading(false);
                    return;
                }

                // 2. Tạo array bookPromises để chứa các Promise Sách
                const bookPromises = idBookList.map((idBook) =>
                    getBookById(idBook)
                );

                // 3. Lấy tất cả các sách
                const books = await Promise.all(bookPromises);

                // 4. Set list sách vào state
                setBookList(books);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải sách yêu thích:", error);
                setBookList([]);
                setLoading(false);
            }
        };

        fetchFavoriteBooks();
    }, [reloadData]); // Chỉ phụ thuộc vào reloadData

    // Hàm để refresh lại danh sách sau khi xóa
    const handleRefresh = () => {
        setReloadData(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className='container-book container mb-5 py-5 px-5 bg-light'>
                <div className='row'>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className='col-md-6 col-lg-3 mt-3'>
                            <Skeleton
                                className='my-3'
                                variant='rectangular'
                                height={400}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='container-book container mb-5 pb-5 px-5 bg-light'>
            <h2 className='mt-4 px-3 py-3 mb-0'>SÁCH YÊU THÍCH</h2>
            <hr className='mt-0' />
            <div className='row'>
                {bookList.length > 0 ? (
                    bookList.map((book) => (
                        <BookProps
                            key={book.idBook}
                            book={book}
                            onRemove={handleRefresh}
                            isFavoritePage={true}
                        />
                    ))
                ) : (
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                        <h4 className='text-center'>
                            Bạn chưa yêu thích quyển sách nào
                        </h4>
                        <Link to={"/products"}>
                            <Button variant='contained' className='mt-3'>
                                Kho sách
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoriteBooksList;
