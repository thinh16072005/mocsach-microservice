import React, { useEffect, useState } from "react";
import BookProps from "./components/BookProps";
import BookModel from "../../model/BookModel";
import { getAllBook } from "../../api/BookApi";
import "../products/Book.css";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";


const BookList = () => {
	const [bookList, setBookList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);
	const [currentPage, setCurrentPage] = useState(1); // Set trang hiện tại là 1

	useEffect(() => {
		// currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
		getAllBook(4, currentPage - 1) // size là (tổng sản phẩm được hiện)
			.then((response) => {
				setBookList(response.bookList);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, []);

	if (loading) {
		return (
			<div className='container-book container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
			</div>
		);
	}

	return (
		<div className='container-book container mb-5 pb-5 px-5 bg-light'>
					<h2 className='mt-4 px-3 py-3 mb-0'>TẤT CẢ</h2>
					<hr className='mt-0' />

			<div className='row'>
				{bookList.map((book) => (
					<BookProps key={book.idBook} book={book} />
				))}
			</div>
			<Link to={"/products"}>
					<div className='d-flex align-items-center justify-content-center'>
						<Button
							variant='outlined'
							size='large'
							className='text-primary mt-5 w-25'
						>
							Xem Thêm
						</Button>
					</div>
				</Link>
		</div>
	);
};

export default BookList;
