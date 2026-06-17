import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//hàm generic nhận vào một component WrappedComponent có props kiểu P.
const RequireAdmin = (WrappedComponent) => {
	const WithAdminCheck = (props) => {
		const navigate = useNavigate();

		useEffect(() => {
			const token = localStorage.getItem("token");

			// Nếu chưa đăng nhập thì về trang /login
			if (!token) {
				navigate("/login");
				return;
			}

			// Giải mã token
			const decodedToken = jwtDecode(token);

			// Lấy thông tin từ token đó
			const role = decodedToken.role;

			// Kiểm tra quyền
			if (role !== "ADMIN") {
				navigate("/error-403");
			}
		}, [navigate]);

		return <WrappedComponent {...props} />;
	};
	return WithAdminCheck || null;
};

export default RequireAdmin;
