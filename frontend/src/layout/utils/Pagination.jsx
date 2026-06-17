import React from "react";
import "../utils/Pagination.css";

const Pagination = (props) => {
	const showListPage = [];

	if (props.currentPage === 1) {
		showListPage.push(props.currentPage);
		if (props.totalPages >= 2) {
			showListPage.push(props.currentPage + 1);
		}
		if (props.totalPages >= 3) {
			showListPage.push(props.currentPage + 2);
		}
	} else if (props.currentPage > 1) {
		if (props.currentPage >= 3) {
			showListPage.push(props.currentPage - 2);
		}
		if (props.currentPage >= 2) {
			showListPage.push(props.currentPage - 1);
		}
		showListPage.push(props.currentPage);
		if (props.currentPage + 1 <= props.totalPages) {
			showListPage.push(props.currentPage + 1);
		}
		if (props.currentPage + 2 <= props.totalPages) {
			showListPage.push(props.currentPage + 2);
		}
	}

	return (
		<nav aria-label='Page navigation example' className='mt-5 fs-5'>
			<ul className='pagination justify-content-center'>
				<li
					className={
						"page-item " + (props.currentPage === 1 ? "disabled" : "")
					}
					onClick={
						props.currentPage === 1
							? () => { }
							: () => props.handlePagination(props.currentPage - 1)
					}
				>
					<button className='page-link'>Previous</button>
				</li>
				{props.currentPage >= 4 && (
					<>
						<li className='page-item' onClick={() => props.handlePagination(1)}>
							<button className='page-link'>1</button>
						</li>
						<li className='page-item'>
							<button className='page-link'>...</button>
						</li>
					</>
				)}
				{showListPage.map((pageNumber) => (
					<li
						className={
							"page-item" +
							(props.currentPage === pageNumber ? " actived" : "")
						}
						key={pageNumber}
						onClick={() => props.handlePagination(pageNumber)}
					>
						<button className='page-link'>{pageNumber}</button>
					</li>
				))}
				{props.currentPage < props.totalPages - 2 && (
					<>
						<li className='page-item'>
							<button className='page-link'>...</button>
						</li>
						<li className='page-item' onClick={() => props.handlePagination(props.totalPages)}>
							<button className='page-link'>{props.totalPages}</button>
						</li>
					</>
				)}
				<li
					className={
						"page-item " +
						(props.totalPages === props.currentPage ? "disabled" : "")
					}
					onClick={
						props.totalPages === props.currentPage
							? () => { }
							: () => props.handlePagination(props.currentPage + 1)
					}
				>
					<button className='page-link'>Next</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
