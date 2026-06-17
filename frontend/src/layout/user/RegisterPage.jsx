import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkExistEmail, checkExistUsername, checkPassword, checkPhoneNumber, checkRepeatPassword } from "../utils/Validation";
import { toast } from "react-toastify";
import { endpointBE } from "../utils/Constant";
import React from "react";
import "./Form.css";

const RegisterPage = () => {
	const navigate = useNavigate();
	// Khai báo biến cần đăng ký
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	// Khai báo các biến lỗi
	const [errorUsername, setErrorUsername] = useState("");
	const [errorEmail, setErrorEmail] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorRepeatPassword, setErrorRepeatPassword] = useState("");
	const [errorPhoneNumber, setErrorPhoneNumber] = useState("");

	const [statusBtn, setStatusBtn] = useState(false);

	const handleUsernameChange = (e) => {
		setUserName(e.target.value);
		checkExistUsername(setErrorUsername, e.target.value);
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		checkPassword(setErrorPassword, e.target.value);
	}

	const handleRepeatPasswordChange = (e) => {
		setRepeatPassword(e.target.value);
		checkRepeatPassword(setErrorRepeatPassword, e.target.value, password);
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		checkExistEmail(setErrorEmail, e.target.value);
	}

	const handlePhoneNumberChange = (e) => {
		setPhoneNumber(e.target.value);
		checkPhoneNumber(setErrorPhoneNumber, e.target.value);
	}

	const handleSubmit = async (e) => {

		e.preventDefault();
		setStatusBtn(true);

		//Xóa tất cả các thông báo lỗi 
		setErrorUsername("");
		setErrorEmail("");
		setErrorPassword("");
		setErrorRepeatPassword("");
		setErrorPhoneNumber("");

		const checkUsername = await checkExistUsername(setErrorUsername, username);
		const checkPass = checkPassword(setErrorPassword, password);
		const checkRepeat = checkRepeatPassword(setErrorRepeatPassword, repeatPassword, password);
		const checkEmail = await checkExistEmail(setErrorEmail, email);
		const checkPhone = checkPhoneNumber(setErrorPhoneNumber, phoneNumber);

		if (checkUsername || checkPass || checkRepeat || checkEmail || checkPhone) {
			setStatusBtn(false);
			return;
		}

		try {
			const endpoint = endpointBE + "/auth/register";

			const response = await toast.promise(
				fetch(endpoint, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						username,
						password,
						email,
						firstName,
						lastName,
						phoneNumber,
						gender: "M",
					}),
				}),
				{ pending: "Đang trong quá trình xử lý ..." }
			);

			if (response.ok) {
				toast.success("Đăng ký tài khoản thành công.");
				toast.info("Vui lòng kiểm tra email để lấy mã kích hoạt");
				setStatusBtn(false);
				navigate("/active", { state: { email } });
				return true;
			} else {
				toast.error("Đăng ký tài khoản thất bại");
				setStatusBtn(false);
				return false;
			}
		} catch (error) {
			console.log(error);
			setStatusBtn(false);
			toast.error("Đăng ký tài khoản thất bại");
		}
	}


	return (
		<div className='container my-5 py-4 rounded-5 shadow-5 bg-light w-50'>
			<h1 className='text-center'>ĐĂNG KÝ</h1>

			<form onSubmit={handleSubmit} className='form'>
				<div className='row px-2'>
					<div className='col-lg-6 col-md-12 col-12'>
						<TextField
							fullWidth
							error={errorUsername.length > 0 ? true : false}
							helperText={errorUsername}
							required={true}
							label='Tên đăng nhập'
							placeholder='Nhập tên đăng nhập'
							value={username}
							onChange={handleUsernameChange}
							className='input-field'
						/>

						<TextField
							error={errorPassword.length > 0 ? true : false}
							helperText={errorPassword}
							required={true}
							fullWidth
							type='password'
							label='Mật khẩu'
							placeholder='Nhập mật khẩu'
							value={password}
							onChange={handlePasswordChange}
							className='input-field'
						/>

						<TextField
							error={errorRepeatPassword.length > 0 ? true : false}
							helperText={errorRepeatPassword}
							required={true}
							fullWidth
							type='password'
							label='Xác nhận mật khẩu'
							placeholder='Nhập lại mật khẩu'
							value={repeatPassword}
							onChange={handleRepeatPasswordChange}
							className='input-field'
						/>
					</div>
					<div className='col-lg-6 col-md-12 col-12'>
						<TextField
							fullWidth
							helperText={""}
							required={true}
							label='Họ đệm'
							placeholder='Nhập họ đệm'
							value={firstName}
							onChange={(e) => {
								setFirstName(e.target.value);
							}}
							className='input-field'
						/>
						<TextField
							fullWidth
							helperText={""}
							required={true}
							label='Tên'
							placeholder='Nhập tên'
							value={lastName}
							onChange={(e) => {
								setLastName(e.target.value);
							}}
							className='input-field'
						/>
						<TextField
							fullWidth
							error={errorPhoneNumber.length > 0 ? true : false}
							helperText={errorPhoneNumber}
							required={true}
							label='Số điện thoại'
							placeholder='Nhập số điện thoại'
							value={phoneNumber}
							onChange={handlePhoneNumberChange}
							className='input-field'
						/>
					</div>
					<div>
						<TextField
							fullWidth
							error={errorEmail.length > 0 ? true : false}
							helperText={errorEmail}
							required={true}
							label='Email'
							placeholder='Nhập email'
							type='email'
							value={email}
							onChange={handleEmailChange}
							className='input-field'
						/>
					</div>
				</div>
				<div className='d-flex justify-content-end mt-2 px-3'>
					<span>
						Bạn có tài khoản rồi? <Link to={"/login"}>Đăng nhập</Link>
					</span>
				</div>
				<div className='text-center my-3'>
					<LoadingButton
						type='submit'
						loading={statusBtn}
						variant='outlined'
						sx={{ width: "25%", padding: "10px" }}
					>
						ĐĂNG KÝ
					</LoadingButton>
				</div>
			</form>
		</div>
	);
}


export default RegisterPage;

