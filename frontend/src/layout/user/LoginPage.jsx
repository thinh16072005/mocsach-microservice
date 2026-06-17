import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { endpointBE } from "../utils/Constant";
import { get1User } from "../../api/UserApi";
import { getRoleByToken, getIdUserByToken } from "../utils/JwtService";
import "./Form.css";
import React from "react";

const LoginPage = () => {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginRequest = {
            username,
            password,
        };

        const endpoint = endpointBE + "/auth/login";

        try {
            // Gửi request đăng nhập cho server
            const response = await fetch(endpoint,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(loginRequest),
                });


            if (response.ok) {
                // Nhận response từ server
                const responseData = await response.json();
                
                // Lưu token vào localStorage
                localStorage.setItem("token", responseData.data.token);
                
                // Fetch và lưu thông tin profile
                try {
                    const idUser = Number(getIdUserByToken());
                    const userProfile = await get1User(idUser);
                    if (userProfile) {
                        localStorage.setItem("user_avatar", userProfile.avatar || "");
                        localStorage.setItem("user_lastname", userProfile.lastName || "");
                        window.dispatchEvent(new Event("profile_updated"));
                    }
                } catch (profileError) {
                    console.error("Lỗi tải thông tin cá nhân khi đăng nhập:", profileError);
                }

                // Giải mã token để lấy role
                const role = getRoleByToken();
                
                // Nếu là ADMIN, chuyển hướng đến AdminDashboard
                // Nếu không, chuyển hướng về HomePage
                if (role === "ADMIN") {
                    navigate("/admin/books");
                } else {
                    navigate("/");
                }
            } else {
                const responseData = await response.json();
                setError(responseData.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Đăng nhập thất bại");
        }

    };

    return (
        <div
            className='container my-5 py-4 rounded-5 shadow-5 bg-light'
            style={{ width: "450px" }}
        >
            <h1 className='text-center'>ĐĂNG NHẬP</h1>
            {error && <p className='text-danger text-center'>{error}</p>}
            <form
                onSubmit={handleSubmit}
                className='form'
                style={{ padding: "0 20px" }}
            >
                <TextField
                    fullWidth
                    required={true}
                    id='outlined-required'
                    label='Tên đăng nhập'
                    placeholder='Nhập tên đăng nhập'
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className='input-field'
                />
                <TextField
                    fullWidth
                    required={true}
                    type='password'
                    id='outlined-required'
                    label='Mật khẩu'
                    placeholder='Nhập mật khẩu'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='input-field'
                />
                <div className='d-flex justify-content-end mt-2 px-3'>
                    <span>
                        Bạn chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
                    </span>
                </div>
                <div className='text-center my-3'>
                    <Button
                        fullWidth
                        variant='outlined'
                        type='submit'
                        sx={{ padding: "10px" }}
                    >
                        Đăng nhập
                    </Button>
                </div>
            </form>
            <div className='d-flex justify-content-end mt-2 px-3'>
                <Link to={"/forgot-password"}>Quên mật khẩu</Link>
            </div>
        </div>
    );
};

export default LoginPage;

