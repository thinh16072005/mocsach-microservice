import React, { useEffect } from "react";
import FavoriteBooksList from "../products/FavoriteBooksList";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import { isToken } from "../utils/JwtService";

const MyFavoriteBooksPage = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const navigate = useNavigate();

	useEffect(() => {
		if (!isToken()) {
			navigate("/login");
		}
	}, [navigate]);

	if (!isToken()) {
		return null;
	}

	return (
		<>
			<FavoriteBooksList />
		</>
	);
};

export default MyFavoriteBooksPage;
