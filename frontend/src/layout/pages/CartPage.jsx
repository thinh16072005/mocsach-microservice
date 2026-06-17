import React from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import BookCartList from "../products/BookCartList";

const CartPage = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return <BookCartList />;
};

export default CartPage;
