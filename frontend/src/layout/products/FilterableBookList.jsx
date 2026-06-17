import React, { useEffect, useState } from "react";
import BookModel from "../../model/BookModel";
import { getAllBook, searchBook } from "../../api/BookApi";
import { Skeleton } from "@mui/material";
import BookProps from "./components/BookProps";
import ToolFilter from "../pages/components/ToolFilter";
import Pagination from "../utils/Pagination";
import useScrollToTop from "../../hooks/ScrollToTop.jsx";

const FilterableBookList = () => {
	const [bookList, setBookList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [size, setSize] = useState(8);

	//Tạo các thuộc tính hỗ trợ tìm kiếm

	//Tạo biến chứa id của thể loại được lấy
	const [genreId, setGenreId] = useState(undefined);

	//Tạo biến chứa từ khóa tìm kiếm
	const [keySearch, setKeySearch] = useState("");

	//Tạo hàm xử lý cho việc chọn thể loại
	const handleGenreChange = (newGenreId) => {
		setGenreId(newGenreId); //Gắn giá trị id thể loại vừa mới nhận
		setCurrentPage(1); //Sau khi chọn thể loại thì sẽ reset lại trang hiện tại thành 1
	};

	//Tạo hàm xử lý cho việc search theo tên sách
	const handleKeySearchChange = (newKeySearch) => {
		setKeySearch(newKeySearch); //Gắn giá trị từ khóa tìm kiếm vừa mới nhận
		setCurrentPage(1); //Sau khi chọn thể loại thì sẽ reset lại trang hiện tại thành 1
	};

	// Xử lý phân trang
	const handlePagination = (pageNumber) => {
		setCurrentPage(pageNumber);
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		//Nếu không thực hiện tìm kiếm sách thì sẽ lấy tất cả sách
		if (
			genreId === undefined && keySearch === ""
		) {

			// currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
			getAllBook(size, currentPage - 1)
				.then((response) => {
					setBookList(response.bookList);
					setTotalPages(response.totalPages);
					setSize(response.size);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					setErroring(error.message);
				});
		} else {
			// currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
			searchBook(genreId, keySearch, size, currentPage - 1)
				.then((response) => {
					setBookList(response.bookList);
					setTotalPages(response.totalPages);
					setSize(response.size);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					setErroring(error.message);
				});
		}
	}, [currentPage, genreId, keySearch]);

	useScrollToTop();
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
		<>
			{/* Thanh tìm kiếm  */}
			<div className='container-book container bg-light my-3 py-3 px-5'>
				<ToolFilter
					genreId={genreId}
					onGenreChange={handleGenreChange}
					keySearch={keySearch}
					onKeySearchChange={handleKeySearchChange}
				/>
			</div>

			{/* Kiểm tra danh sách sách xem có phần tử nào không */}

			{bookList.length > 0 &&
				(
					<div className='container-book container mb-5 pb-5 px-5 bg-light'>
						<div className='row'>
							{bookList.map((book) => (
								<BookProps key={book.idBook} book={book} />
							))}
						</div>
						<>
							<hr className='mt-5' style={{ color: "#aaa" }} />
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								handlePagination={handlePagination}
							/>
						</>
					</div>
				)
			}
			{bookList.length == 0 &&(
				<div className='container-book container mb-5 px-5 px-5 bg-light'>
					<h2 className='mt-4 px-3 py-3 mb-0'>
						Không có sách nào tồn tại!
					</h2>
				</div>
			)}
		</>

	);
};

export default FilterableBookList;
