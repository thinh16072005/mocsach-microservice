import React, { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import CartItemModel from "../../model/CartItemModel";
import UserModel from "../../model/UserModel";
import { getIdUserByToken } from "../utils/JwtService";
import { get1User } from "../../api/UserApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, List, ListItem, ListItemButton, ListItemText, Radio, RadioGroup, TextField } from "@mui/material";
import { checkPhoneNumber } from "../utils/Validation";
import { BookHorizontal } from "./BookHorizontalProps";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import DeliveryModel from "../../model/DeliveryModel";
import { getDeliveryById } from "../../api/DeliveryApi";

import { getAllCoupons, getCoupon, updateUsedCoupon } from "../../api/CouponApi";

export const CheckoutPage = (props) => {
	useScrollToTop();


	// Xử lý phương thức thanh toán
	const [payment, setPayment] = useState(1); // mặc định là cod
	const [fullName, setFullName] = useState(""); //Họ và tên người nhận
	const [phoneNumber, setPhoneNumber] = useState(""); //Số điện thoại
	const [deliveryAddress, setDeliveryAddress] = useState(""); //Địa chỉ giao hàng
	const [note, setNote] = useState(""); //Ghi chú
	const [delivery, setDelivery] = useState(new DeliveryModel(1, "Giao hàng tận nơi", 10000));
	const [couponList, setCouponList] = useState([]);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showCouponDialog, setShowCouponDialog] = useState(false);


	// Báo lỗi
	const [errorPhoneNumber, setErrorPhoneNumber] = useState(""); //Lỗi số điện thoại


	// Lấy dữ liệu của người dùng
	const [user, setUser] = useState();
	useEffect(() => {

		getDeliveryById(1)
			.then((response) => {
				setDelivery(response);
			})
			.catch((error) => {
				console.log(error);
			});

		const idUser = Number(getIdUserByToken());
		get1User(idUser)
			.then((response) => {
				setUser(response);
				setFullName(response.firstName + " " + response.lastName);
				setPhoneNumber(response.phoneNumber);
				setDeliveryAddress(response.deliveryAddress);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	//Lấy mã giảm giá
	useEffect(() => {
		getAllCoupons()
			.then((response) => {
				setCouponList(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	//Hàm xử lý khi người dùng thay đổi phương thức thanh toán
	const handleChangePayment = (event) => {
		setPayment(Number(event.target.value));
	};

	//Hàm xử lý submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		//Xóa tất cả các thông báo lỗi
		setErrorPhoneNumber("");

		//Lấy token
		const token = localStorage.getItem("token");

		const orderItems = [];

		props.cartList.forEach((cartItem) => {
			orderItems.push({
				bookId: cartItem.book?.idBook,
				quantity: cartItem.quantity,
			})
		})

		const orderCodeGenerated = Math.floor(Date.now() + Math.random() * 1000);

		if (payment === 2) {
			try {

				if (selectedCoupon) {
					await updateUsedCoupon(selectedCoupon.code);
				}

				// Lưu thông tin đơn hàng vào localStorage trước khi redirect
				const orderData = {
					deliveryAddress: deliveryAddress,
					phoneNumber: phoneNumber,
					fullName: fullName,
					totalPriceProduct: props.totalPriceProduct,
					note: note,
					paymentId: payment,
					deliveryId: delivery.idDelivery || 1,
					orderItems: orderItems,
					totalPrice: (props.totalPriceProduct  * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery),
					paymentStatus: "PAID" // PayOS - đã thanh toán
				};
				localStorage.setItem('pendingOrder', JSON.stringify(orderData));

				const idUser = Number(getIdUserByToken());
				const paymentRequest = {
					orderCode: orderCodeGenerated,
					amount: Math.round(props.totalPriceProduct  * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery),
					description: "Thanh toan don hang " + idUser,
					returnUrl: "http://localhost:3000/payment-success",
					cancelUrl: "http://localhost:3000/cart",
					buyerName: fullName,
					buyerPhone: phoneNumber,
					buyerEmail: user?.email || ""
				};

				const response = await fetch(endpointBE + "/payments/payos/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify(paymentRequest)
				});

				if (response.ok) {
					const result = await response.json();
					if (result.success && result.data) {
						// Redirect đến trang thanh toán PayOS
						window.location.href = result.data.checkoutUrl;
					} else {
						toast.error(result.message || "Tạo link thanh toán thất bại");
					}
				} else {
					toast.error("Không thể tạo link thanh toán");
				}
			} catch (error) {
				console.error("Payment error:", error);
				toast.error("Lỗi thanh toán");
			}
		}

		//Nếu người dùng chọn phương thức thanh toán là COD
		if (payment === 1) {

			const request = {
				deliveryAddress: deliveryAddress,
				phoneNumber: phoneNumber,
				fullName: fullName,
				totalPriceProduct: props.totalPriceProduct,
				note: note,
				paymentId: payment,
				deliveryId: delivery.idDelivery || 1,
				orderItems: orderItems,
				totalPrice: (props.totalPriceProduct  * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery),
				paymentStatus: "PENDING"
			}

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
					props.setIsCheckout(false);
					if (props.onSuccessSubmit) {
						props.onSuccessSubmit();
					}
					if (selectedCoupon) {
						await updateUsedCoupon(selectedCoupon.code);
					}
				}
				else {
					toast.error((await response.json()).message || "Đặt hàng thất bại!");
				}
			} catch (error) {
				toast.error("Đặt hàng thất bại!");
			}
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>ĐỊA CHỈ GIAO HÀNG</strong>
					<hr />
					<div className='row'>
						<div className='col-lg-6 col-md-6 col-sm-12'>
							<TextField
								required={true}
								fullWidth
								type='text'
								label='Họ và tên người nhận'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className='input-field'
							/>
							<TextField
								error={errorPhoneNumber.length > 0 ? true : false}
								helperText={errorPhoneNumber}
								required={true}
								fullWidth
								type='text'
								label='Số điện thoại'
								value={phoneNumber}
								onChange={(e) => { setPhoneNumber(e.target.value); checkPhoneNumber(setErrorPhoneNumber, e.target.value) }}
								className='input-field'
							/>
						</div>
						<div className='col-lg-6 col-md-6 col-sm-12'>
							<TextField
								required={true}
								fullWidth
								type='text'
								label='Email'
								value={user?.email}
								disabled
								className='input-field'
							/>
							<TextField
								required={true}
								fullWidth
								type='text'
								label='Địa chỉ nhận hàng'
								value={deliveryAddress}
								onChange={(e) => setDeliveryAddress(e.target.value)}
								className='input-field'
							/>
						</div>
					</div>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>PHƯƠNG THỨC GIAO HÀNG</strong>
					<hr />
					<FormControl>
						<RadioGroup value={1}>
							<FormControlLabel
								value={1}
								control={<Radio checked={true} sx={{ color: "#2C7B8F", "&.Mui-checked": { color: "#2C7B8F" } }} />}
								label={
									<div style={{ display: "flex", flexDirection: "column" }}>
										<strong>{delivery.nameDelivery}</strong>
										<span style={{ fontSize: "14px", color: "#666" }}>
											Phí vận chuyển: {delivery.feeDelivery.toLocaleString("vi-vn")} đ
										</span>
									</div>
								}
							/>
						</RadioGroup>
					</FormControl>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>PHƯƠNG THỨC THANH TOÁN</strong>
					<hr />
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-controlled-radio-buttons-group'
							name='controlled-radio-buttons-group'
							value={payment}
							onChange={handleChangePayment}
						>
							<FormControlLabel
								value={1}
								control={<Radio />}
								label={
									<div
										style={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<img
											src='https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_cashondelivery.svg?q=10311'
											alt='Cash on Delivery'
											style={{
												width: "40px",
												marginRight: "10px",
											}}
										/>
										Thanh toán tiền mặt khi nhận hàng (COD)
									</div>
								}
							/>

							<FormControlLabel
								value={2}
								control={<Radio />}
								label={
									<div
										style={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<img
											src='https://payos.vn/docs/img/logo.svg'
											alt='Cash on Delivery'
											style={{
												width: "55px",
											}}
										/>
										Thanh toán bằng PAYOS
									</div>
								}
							/>
						</RadioGroup>
					</FormControl>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>MÃ KHUYẾN MÃI GIẢM GIÁ</strong>
					<hr />
					<div className='d-flex align-items-end w-50'>
						<TextField
							className='w-50'
							id='standard-basic'
							label='Mã khuyến mãi (nếu có): '
							variant='standard'
							value={selectedCoupon?.code || ""}
							InputProps={{ readOnly: true }}
						/>
						<Button
							className='ms-3'
							variant='outlined'
							onClick={() => setShowCouponDialog(true)}
						>
							Lấy mã giảm giá
						</Button>
					</div>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>GHI CHÚ</strong>
					<hr />
					<TextField
						className='w-100'
						id='standard-basic'
						label='Ghi chú'
						variant='outlined'
						multiline
						minRows={3}
						maxRows={4}
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>KIỂM TRA LẠI ĐƠN HÀNG</strong>
					<hr />
					<div className='row my-3'>
						<div className='col'>
							<span className='ms-3'>Sản phẩm</span>
						</div>
						<div className='col-2 text-center'>Số lượng</div>
						<div className='col-2 text-center'>Tổng tiền</div>
					</div>

					{props.cartList.map((cartItem) => {
						return (
							<BookHorizontal
								cartItem={cartItem}
								key={cartItem.idCart}
							/>
						);
					})}
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'
					style={{ height: "auto" }}
				>
					<div className='container my-3'>
						<div className='row'>
							<div className='me-3 col text-end'>Tổng số tiền sách</div>
							<div className='ms-3 col-2 text-end'>
								{props.totalPriceProduct.toLocaleString("vi-vn")} đ
							</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>Mã giảm giá</div>
							<div className='ms-3 col-2 text-end'>{selectedCoupon?.discountPercent}%</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>--------------</div>
							<div className='ms-3 col-2 text-end'>--------</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>Phí vận chuyển</div>
							<div className='ms-3 col-2 text-end'>{delivery.feeDelivery.toLocaleString("vi-vn")} đ</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>
								<strong>Tổng số tiền (gồm VAT)</strong>
							</div>
							<div className='ms-3 col-2 text-end text-danger fs-5'>
								<strong>
									{(props.totalPriceProduct * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery).toLocaleString("vi-vn")}{" "}
									đ
								</strong>
							</div>
						</div>
						<hr className='mt-3' />
						<div className='row' style={{ marginTop: '10px' }}>
							<div className='col-6 d-flex align-items-center'>
								<span
									style={{ cursor: "pointer" }}
									onClick={() => props.setIsCheckout(false)}
								>
									<strong className='ms-2'>Quay trở về</strong>
								</span>
							</div>
							<div className='col-6'>
								<Button
									type='submit'
									variant='contained'
									sx={{ width: "100%" }}
								>
									Xác nhận thanh toán
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>

			{showCouponDialog && (
				<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCouponDialog(false)}>
					<div style={{ background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)' }} onClick={e => e.stopPropagation()}>
						<div style={{ padding: '24px 24px 16px', background: 'linear-gradient(135deg, #2C7B8F, #1A5E70)' }}>
							<h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#fff', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12H16c-.7 2-3 3-4.5 3S7 14 7 12H2.5"/><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z"/></svg>
								Mã giảm giá khả dụng
							</h3>
							<p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '13.5px', fontFamily: "'DM Sans', sans-serif" }}>Chọn một mã bên dưới để áp dụng vào đơn hàng của bạn.</p>
						</div>
						
						<div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
							{(() => {
								const validCoupons = couponList.filter(coupon => coupon.isUsed === false && coupon.isActive === true && new Date(coupon.expiryDate).getTime() > new Date().getTime());
								if (validCoupons.length === 0) {
									return (
										<div style={{ textAlign: 'center', padding: '32px 0', color: '#64748B', fontFamily: "'DM Sans', sans-serif" }}>
											<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px', opacity: 0.5 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
											<p style={{ margin: 0, fontSize: '15px' }}>Chưa có mã giảm giá nào phù hợp!</p>
										</div>
									);
								}
								return validCoupons.map((coupon) => (
									<div 
										key={coupon.idCoupon}
										onClick={() => {
											setSelectedCoupon(coupon);
											setShowCouponDialog(false);
											toast.success(`Đã áp dụng mã: ${coupon.code}`);
										}}
										style={{ 
											display: 'flex', border: '1.5px dashed', borderRadius: '12px', padding: '16px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden', alignItems: 'center', gap: '16px', backgroundColor: selectedCoupon?.idCoupon === coupon.idCoupon ? '#F0FDF4' : '#fff', borderColor: selectedCoupon?.idCoupon === coupon.idCoupon ? '#22C55E' : '#CBD5E1'
										}}
										onMouseEnter={e => { if (selectedCoupon?.idCoupon !== coupon.idCoupon) { e.currentTarget.style.borderColor = '#2C7B8F'; e.currentTarget.style.backgroundColor = '#F8FAFC'; } }}
										onMouseLeave={e => { if (selectedCoupon?.idCoupon !== coupon.idCoupon) { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = '#fff'; } }}
									>
										<div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#EEF8FA', color: '#2C7B8F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
											{coupon.discountPercent}%
										</div>
										<div style={{ flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
											<div style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>{coupon.code}</div>
											<div style={{ fontSize: '13px', color: '#64748B' }}>HSD: {new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}</div>
										</div>
										<div style={{ padding: '6px 14px', borderRadius: '6px', background: selectedCoupon?.idCoupon === coupon.idCoupon ? '#22C55E' : '#2C7B8F', color: '#fff', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", border: 'none' }}>
											{selectedCoupon?.idCoupon === coupon.idCoupon ? 'Đang dùng' : 'Áp dụng'}
										</div>
									</div>
								));
							})()}
						</div>
						
						<div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
							<button
								onClick={() => setShowCouponDialog(false)}
								style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
								onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
								onMouseLeave={e => e.currentTarget.style.background = '#fff'}
							>
								Đóng cửa sổ
							</button>
						</div>
					</div>
				</div>
			)}

		</>
	);
};
