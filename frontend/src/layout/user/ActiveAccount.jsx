import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import { Button, TextField } from "@mui/material";
import { endpointBE } from "../utils/Constant";

const ActiveAccount = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const { email: paramEmail, activationCode: paramCode } = useParams();
	const location = useLocation();
	const stateEmail = location.state?.email || "";

	const [email, setEmail] = useState(paramEmail || stateEmail || "");
	const [activationCode, setActivationCode] = useState(paramCode || "");
	const [enabled, setEnabled] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [notifications, setNotifications] = useState("");
	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		// Nếu tồn tại email và mã kích hoạt ở trên đường dẫn thì thực hiện gửi request tự động
		if (paramEmail && paramCode) {
			handleActive(paramEmail, paramCode);
		}
	}, [paramEmail, paramCode]);

	const handleActive = async (targetEmail, targetCode) => {
		setIsSending(true);
		try {
			const url =
				endpointBE +
				`/auth/activate?email=${encodeURIComponent(targetEmail)}&code=${encodeURIComponent(targetCode)}`;
			const response = await fetch(url, { method: "GET" });
			const data = await response.json();

			if (response.ok) {
				setEnabled(true);
				setIsSubmitted(true);
			} else {
				setNotifications(data.message || "Kích hoạt thất bại. Vui lòng kiểm tra lại mã.");
				setIsSubmitted(true);
			}
		} catch (error) {
			console.log("Lỗi kích hoạt: " + error);
			setEnabled(false);
			setNotifications("Không thể kết nối đến máy chủ.");
			setIsSubmitted(true);
		} finally {
			setIsSending(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email.trim() && activationCode.trim()) {
			handleActive(email.trim(), activationCode.trim());
		}
	};

	if (isSubmitted) {
		return (
			<div>
				<div className='container bg-light my-5 rounded-5 shadow-5 p-5' style={{ maxWidth: "500px" }}>
					<h1 className='text-center text-black mb-4'>KÍCH HOẠT TÀI KHOẢN</h1>
					<div className='d-flex align-items-center justify-content-center flex-column p-3'>
						{enabled ? (
							<>
								<img
									src='https://cdn0.fahasa.com/skin/frontend/base/default/images/order_status/ico_successV2.svg?q=10311'
									alt='success'
									style={{ width: "100px", marginBottom: "20px" }}
								/>
								<h2 className='my-3 text-success text-center'>
									Tài khoản kích hoạt thành công!
								</h2>
								<p className="text-muted text-center mb-4">Bạn có thể đăng nhập vào hệ thống ngay bây giờ.</p>
								<Link to={"/login"}>
									<Button variant='contained' sx={{ background: "linear-gradient(135deg, #2C7B8F 0%, #1A5E70 100%)", padding: "10px 24px" }}>
										Đăng nhập để tiếp tục
									</Button>
								</Link>
							</>
						) : (
							<>
								<img
									src='https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png'
									alt='fail'
									width={100}
									style={{ marginBottom: "20px" }}
								/>
								<h2 className='my-3 text-danger text-center'>
									Kích hoạt thất bại!
								</h2>
								<p className="text-center text-muted mb-4">{notifications}</p>
								<Button 
									variant='outlined' 
									onClick={() => setIsSubmitted(false)}
									sx={{ padding: "8px 20px" }}
								>
									Thử lại
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className='container bg-light my-5 rounded-5 shadow-5 p-5' style={{ maxWidth: "500px" }}>
				<h1 className='text-center text-black mb-4'>KÍCH HOẠT TÀI KHOẢN</h1>
				<form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
					<p className="text-muted text-center mb-2">
						Vui lòng nhập Email và Mã OTP 6 số đã được gửi tới hòm thư của bạn để kích hoạt tài khoản.
					</p>
					<TextField
						fullWidth
						required
						label='Email'
						placeholder='Nhập email đăng ký'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isSending || !!paramEmail}
					/>
					<TextField
						fullWidth
						required
						label='Mã kích hoạt (OTP)'
						placeholder='Nhập mã OTP 6 số'
						value={activationCode}
						onChange={(e) => setActivationCode(e.target.value)}
						disabled={isSending}
						inputProps={{ maxLength: 6 }}
					/>
					<Button
						fullWidth
						type="submit"
						variant='contained'
						disabled={isSending}
						sx={{ 
							background: "linear-gradient(135deg, #2C7B8F 0%, #1A5E70 100%)", 
							padding: "12px", 
							marginTop: "12px",
							fontWeight: 600
						}}
					>
						{isSending ? "Đang xử lý..." : "Kích hoạt tài khoản"}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ActiveAccount;

