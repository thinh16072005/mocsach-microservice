import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import CartItemModel from "../../model/CartItemModel";
import ImageModel from "../../model/ImageModel";
import { getAllImageByBook } from "../../api/ImageApi";

//Trang hiển thị lại thông tin sách , số lượng , tổng tiền trước khi mua
export const BookHorizontal = (props) => {


	const [imageList, setImageList] = useState([]); //Danh sách ảnh
	// Lấy ảnh ra từ BE
	useEffect(() => {
		if (props.cartItem.book) {
			getAllImageByBook(props.cartItem.book.idBook)
				.then((response) => {
					setImageList(response);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, []);

	return (
		<div className='row'>
			<div className='col'>
				<div className='d-flex'>
					<img
                        src={imageList[0]?.urlImage ? imageList[0].urlImage : "/images/books/hinh_nen_sach.jpg"}
						className='card-img-top'
						alt={props.cartItem.book?.nameBook}
						style={{ width: "100px" }}
					/>
					<div className='d-flex flex-column pb-2'>
						<Tooltip title={props.cartItem.book?.nameBook} arrow>
							<Link
								to={`/book/${props.cartItem.book?.idBook}`}
								className='d-inline text-black'
							>
								<p>
									{props.cartItem.book?.nameBook + " "}
								</p>
							</Link>
						</Tooltip>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.cartItem.book?.sellPrice ? props.cartItem.book.sellPrice.toLocaleString() : ""}đ
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{props.cartItem.book?.listPrice ? props.cartItem.book.listPrice.toLocaleString() : ""}đ
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-2 text-center'>
				<strong>{props.cartItem.quantity}</strong>
			</div>
			<div className='col-2 text-center'>
				<span className='text-danger'>
					<strong>
						{(props.cartItem.quantity && props.cartItem.book?.sellPrice) ? (props.cartItem.quantity * props.cartItem.book.sellPrice).toLocaleString() : ""}đ
					</strong>
				</span>
			</div>
			<hr className='mt-3' />
		</div>
	);
};
