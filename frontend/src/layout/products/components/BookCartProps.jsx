import { Skeleton, Tooltip } from "@mui/material";
import CartItemModel from "../../../model/CartItemModel"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageModel from "../../../model/ImageModel";
import SelectQuantity from "./select-quantity/SelectQuantity";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";
import { toast } from "react-toastify";
import { updateQuantityCartItem, deleteCartItem } from "../../../api/CartApi";

const BookCartProps = (props) => {


	const [loading, setLoading] = useState(false);
	const [erroring, setErroring] = useState(null);

	// State để quản lý số lượng sản phẩm
	const [quantity, setQuantity] = useState(props.cartItem.quantity || 1);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Cập nhật quantity khi cartItem thay đổi
	useEffect(() => {
		setQuantity(props.cartItem.quantity || 1);
	}, [props.cartItem.quantity]);

	// Xử lý tăng số lượng
	const handleIncrease = () => {
		if (props.cartItem.book && quantity < (props.cartItem.book?.quantity || 0)) {
			const newQuantity = quantity + 1;
			setQuantity(newQuantity); //Cập nhật số lượng mới

			// Tạo cartItem mới với quantity mới
			const updatedCartItem = new CartItemModel(
				props.cartItem.idCart,
				newQuantity,
				props.cartItem.book,
				props.cartItem.idUser
			);

			// Gọi API cập nhật
			updateQuantityCartItem(updatedCartItem)
				.then(() => {
					// Gọi callback để reload giỏ hàng
					props.onDeleteSuccess();
				})
				.catch((error) => {
					console.error("Lỗi cập nhật số lượng:", error);

					setQuantity(quantity); //Set lại số lượng cũ
					toast.error("Không thể cập nhật số lượng");
				});
		} else {
			toast.warning("Số lượng sản phẩm đã đạt tối đa");
		}
	};

	// Xử lý giảm số lượng
	const handleDecrease = () => {
		if (quantity > 1) {
			const newQuantity = quantity - 1;
			setQuantity(newQuantity);

			// Tạo cartItem mới với quantity mới
			const updatedCartItem = new CartItemModel(
				props.cartItem.idCart,
				newQuantity,
				props.cartItem.book,
				props.cartItem.idUser
			);

			// Gọi API cập nhật
			updateQuantityCartItem(updatedCartItem)
				.then(() => {
					// Gọi callback để reload giỏ hàng
					props.onDeleteSuccess();
				})
				.catch((error) => {
					console.error("Lỗi cập nhật số lượng:", error);

					setQuantity(quantity); //Set lại số lượng cũ
					toast.error("Không thể cập nhật số lượng");
				});
		} else {
			toast.warning("Số lượng tối thiểu là 1");
		}
	};

	// Xử lý khi người dùng nhập số lượng trực tiếp
	const handleQuantityChange = (newQuantity) => {
		const maxQuantity = props.cartItem.book?.quantity || 0;


		if (newQuantity < 1) {
			toast.warning("Số lượng tối thiểu là 1");
			return;
		}

		if (newQuantity > maxQuantity) {
			toast.warning("Số lượng sản phẩm đã đạt tối đa");
			return;
		}

		setQuantity(newQuantity);

		// Tạo cartItem mới với quantity mới
		const updatedCartItem = new CartItemModel(
			props.cartItem.idCart,
			newQuantity,
			props.cartItem.book,
			props.cartItem.idUser
		);

		// Gọi API cập nhật
		updateQuantityCartItem(updatedCartItem)
			.then(() => {
				// Gọi callback để reload giỏ hàng
				props.onDeleteSuccess();
			})
			.catch((error) => {
				console.error("Lỗi cập nhật số lượng:", error);

				setQuantity(props.cartItem.quantity || 1); //Set lại số lượng cũ
				toast.error("Không thể cập nhật số lượng");
			});
	};

	const executeDelete = async () => {
		const success = await deleteCartItem(props.cartItem.idCart);
		if (success) {
			props.onDeleteSuccess();
		}
		setShowDeleteConfirm(false);
	};

	const handleConfirm = () => {
		setShowDeleteConfirm(true);
	}

if (loading) {
	return (
		<>
			<Skeleton className='my-3' variant='rectangular' />
		</>
	);
}

if (erroring) {
	return (
		<>
			<h4>Đã xảy ra lỗi</h4>
		</>
	);
}
return (
	<>
		{props.cartItem.book && (
			<>
				<div className='col'>
					<div className='d-flex'>
						<Link to={`/book/${props.cartItem.book.idBook}`}>
							<img
								src={props.cartItem.book.images?.[0]?.urlImage ?? "/images/books/hinh_nen_sach.jpg"}
								className='card-img-top'
								alt={props.cartItem.book.nameBook}
								style={{ width: "100px" }} />
						</Link>
						<div className='d-flex flex-column pb-2'>
							<Link to={`/book/${props.cartItem.book.idBook}`}>
								<Tooltip title={props.cartItem.book.nameBook} arrow>
									<span className='d-inline'>
										<p>{props.cartItem.book.nameBook}</p>
									</span>
								</Tooltip>
							</Link>
							<div className='mt-auto'>
								<span className='discounted-price text-danger'>
									<strong style={{ fontSize: "22px" }}>
										{props.cartItem.book.sellPrice?.toLocaleString()}đ
									</strong>
								</span>
								<span
									className='original-price ms-3 small'
									style={{ color: "#000" }}
								>
									<del>
										{props.cartItem.book.listPrice?.toLocaleString()}đ
									</del>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-3 text-center my-auto d-flex align-items-center justify-content-center'>
					<SelectQuantity
						max={props.cartItem.book.quantity}
						quantity={quantity}
						add={handleIncrease}
						reduce={handleDecrease}
						setQuantity={handleQuantityChange}
						book={props.cartItem.book}
					/>
				</div>
				<div className='col-2 text-center my-auto'>
					<span className='text-danger'>
						{quantity && props.cartItem.book.sellPrice && (
							<strong>
								{(quantity * props.cartItem.book.sellPrice).toLocaleString()}đ
							</strong>
						)}
					</span>
				</div>
				<div className='col-2 text-center my-auto'>
					<Tooltip title={"Xoá sản phẩm"} arrow>
						<button
							style={{
								outline: 0,
								backgroundColor: "transparent",
								border: 0,

							}}
							onClick={() => handleConfirm()}

						>
							<DeleteOutlineOutlinedIcon sx={{ cursor: "pointer" }} />
						</button>
					</Tooltip>
				</div>
				<hr className='my-3' />

				{showDeleteConfirm && (
					<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
							<h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1E293B', marginTop: 0, marginBottom: '12px' }}>Xác nhận xóa</h3>
							<p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#475569', marginBottom: '24px', lineHeight: 1.5 }}>
								Bạn có chắc chắn muốn bỏ quyển sách <strong>{props.cartItem.book?.nameBook}</strong> ra khỏi giỏ hàng không?
							</p>
							<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
								<button
									onClick={() => setShowDeleteConfirm(false)}
									style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
								>
									Hủy bỏ
								</button>
								<button
									onClick={executeDelete}
									style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#EF4444', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(239,68,68,0.2)' }}
								>
									Đồng ý xóa
								</button>
							</div>
						</div>
					</div>
				)}
			</>
		)}
	</>
);
};

export default BookCartProps;
