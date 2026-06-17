import React, { useEffect, useState } from "react";
import CartItemModel from "../../model/CartItemModel";
import { getCartAllByIdUser } from "../../api/CartApi";
import BookCartProps from "./components/BookCartProps";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { isToken } from "../utils/JwtService";
import { toast } from "react-toastify";
import { CheckoutPage } from "../pages/CheckoutPage";

//Trang giỏ hàng

const BookCartList = () => {

	// Danh sách giỏ hàng
	const [cartList, setCartList] = useState([]);

	// Tổng tiền sản phẩm
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);

	const [reloadCart, setReloadCart] = useState(false); // ← Thêm state trigger

	// Thanh toán
	const [isCheckout, setIsCheckout] = useState(false);

	const navigation = useNavigate();

	useEffect(() => {
		// Lấy danh sách giỏ hàng của user
		getCartAllByIdUser().then((data) => {
			setCartList(data);
			// Tính tổng tiền sản phẩm
			setTotalPriceProduct(data.reduce((total, cartItem) => total + (cartItem.book?.sellPrice || 0) * (cartItem.quantity || 0), 0));
		});
		console.log(cartList);
	}, [reloadCart]);

	return (
		<>
			{!isCheckout ? (
				<>
					{cartList.length === 0 && (
						<div className='d-flex align-items-center justify-content-center flex-column position-relative'>
							<img
								src='https://newnet.vn/themes/newnet/assets/img/empty-cart.png'
								alt=''
								width='63%'
							/>
							<Link
								to="/products"
								className='position-absolute'
								style={{ bottom: "100px" }}
							>
								<Button variant='contained'>Mua sắm ngay</Button>
							</Link>
						</div>
					)}
					{cartList.length > 0 && (
						<div className='row my-4 pb-5 px-5'>
							{/* Bên trái */}
							<h2 className='mt-2 px-3 py-3 mb-0'>
								GIỎ HÀNG
							</h2>
							<div className='col-lg-8 col-md-12 col-sm-12 '>
								<div className='container-book bg-light '>
									<div className='row px-4 py-3'>
										<div className='col'>Sản phẩm</div>
										<div className='col-3 text-center'>Số lượng</div>
										<div className='col-2 text-center'>Số tiền</div>
										<div className='col-2 text-center'>Thao tác</div>
									</div>
								</div>
								<div className='container-book bg-light mt-3 px-3'>
									<div className='row px-4 py-3'>
										{cartList.map((cartItem) => {
											return (
												<BookCartProps
													cartItem={cartItem}
													key={cartItem.idCart}
													onDeleteSuccess={() => setReloadCart(!reloadCart)} // ← Truyền callback để reload
												/>
											);
										})}
									</div>
								</div>
							</div>

							{/* Bên phải */}

							<div
								className='container-book bg-light col-lg col-md-12 col-sm-12 px-5 pb-4 mt-lg-0 mt-md-3 mt-sm-3'
								style={{ height: "fit-content" }}
							>
								<div className='d-flex align-items-center justify-content-between mt-3'>
									<span>Thành tiền:</span>
									<span>
										<strong>
											{totalPriceProduct.toLocaleString()} đ
										</strong>
									</span>
								</div>
								<hr className='my-2' />
								<div className='d-flex align-items-center justify-content-between'>
									<span>
										<strong>Tổng số tiền (gồm VAT):</strong>
									</span>
									<span className='text-danger fs-5'>
										<strong>
											{totalPriceProduct.toLocaleString()} đ
										</strong>
									</span>
								</div>

								<Button
									variant='contained'
									sx={{ width: "100%", marginTop: "30px" }}
									onClick={() => {
										if (isToken()) {
											setIsCheckout(true);
										} else {
											toast.warning(
												"Bạn cần đăng nhập để thực hiện chức năng này"
											);
											navigation("/login");
										}
									}}
								>
									Thanh toán
								</Button>
							</div>
						</div>
					)}
				</>
			) : (
				<CheckoutPage
					setIsCheckout={setIsCheckout}
					cartList={cartList}
					totalPriceProduct={totalPriceProduct}
					onSuccessSubmit={() => setReloadCart(!reloadCart)}
				/>
			)}
		</>
	);
};

export default BookCartList;
