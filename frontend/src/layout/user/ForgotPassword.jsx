import { Button, TextField } from "@mui/material";
import { useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useNavigate } from "react-router-dom";	
import { toast } from "react-toastify";
import { endpointBE } from "../utils/Constant";

export const ForgotPassword = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const [email, setEmail] = useState("");
	const navigation = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response  = await toast.promise(
			fetch(endpointBE + "/auth/forgot-password", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			})
				.then((response) => {
					if (response.ok) {
						toast.success(
							"Gửi thành công, hãy kiểm tra email để lấy mật khẩu"
						);
						setEmail("");
						navigation("/login");
					} else if(response.status === 404) {
						toast.warning("Email không tồn tại!");
					} else {
						toast.warning("Xảy ra lỗi trong quá trình xử lý")
					}
				})
				.catch((error) => {
					toast.error("Gửi thất bại");
					console.log(error);
				}),
			{ pending: "Đang trong quá trình xử lý ..." }
		);
	}

	return (
		<div
			className='container my-5 py-4 rounded-5 shadow-5 bg-light'
			style={{ width: "450px" }}
		>
			<h1 className='text-center'>QUÊN MẬT KHẨU</h1>
			<form
				onSubmit={handleSubmit}
				className='form'
				style={{ padding: "0 20px" }}
			>
				<TextField
					fullWidth
					required={true}
					id='outlined-required'
					label='Email'
					placeholder='Nhập email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='input-field'
				/>
				<div className='text-center my-3'>
					<Button
						fullWidth
						variant='outlined'
						type='submit'
						sx={{ padding: "10px" }}
					>
						Lấy lại mật khẩu
					</Button>
				</div>
			</form>
		</div>
	);
};

