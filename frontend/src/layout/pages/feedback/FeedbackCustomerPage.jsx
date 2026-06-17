import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import FeedbackModel from "../../../model/FeedbackModel";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { endpointBE } from "../../utils/Constant";
import { isToken, getIdUserByToken } from "../../utils/JwtService";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../../hooks/ScrollToTop";

// Trang feedback
// chức năng : user gửi feedback
// Tạo ra một form cho người dùng (customer) nhập và gửi feedback. Nó gọi API POST /feedback/add-feedback

export const FeedbackCustomerPage = () => {
    useScrollToTop();
    const navigation = useNavigate();

    //----------- 3. KIỂM TRA LOGIN BẰNG 'isToken()' -----------
    const isLoggedIn = isToken();
    const userId = Number(getIdUserByToken());

    useEffect(() => {
        if (!isLoggedIn) {
            navigation("/login");
        }
    }, [isLoggedIn, navigation]); // Giữ nguyên useEffect này, nó vẫn đúng

    const token = localStorage.getItem("token");
    const [feedback, setFeedback] = useState({
        idFeedback: 0,
        title: "",
        comment: "",
        dateCreated: new Date(),
        readed: false,
        username: token ? jwtDecode(token).sub : "",
    });

    function hanleSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const feedbackRequestPayload = {
            content: feedback.title ? `${feedback.title} - ${feedback.comment}` : feedback.comment
        };

        toast.promise(
            fetch(endpointBE + "/feedbacks", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                    "X-User-Id": userId,
                },
                body: JSON.stringify(feedbackRequestPayload),
            })
                .then((response) => {
                    if (response.ok) {
                        setFeedback({
                            idFeedback: 0,
                            title: "",
                            comment: "",
                            dateCreated: new Date(),
                            readed: false,
                            username: token ? jwtDecode(token).sub : "",
                        });
                        toast.success("Gửi nhận xét thành công");
                    } else {
                        toast.error("Gặp lỗi trong quá trình gửi nhận xét");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Gặp lỗi trong quá trình gửi nhận xét");
                }),
            {
                pending: "Đang trong quá trình xử lý ...",
            }
        );
    }

    // Khúc này chủ yếu nếu mà không đăng nhập mà cố tình vào thì sẽ không render component ra
    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className='container-book container bg-light my-3 py-3 px-5'>
            <h3 className='text-center m-3'>PHẢN HỒI VỀ CHÚNG TÔI</h3>
            <div className='d-flex align-items-center justify-content-center'>
                <div className='w-50'>
                    <form className='form' onSubmit={hanleSubmit}>
                        <Box
                            sx={{
                                "& .MuiTextField-root": { mb: 3 },
                            }}
                        >
                            <TextField
                                required
                                id='filled-required'
                                label='Tiêu đề'
                                style={{ width: "100%" }}
                                value={feedback.title}
                                onChange={(e) =>
                                    setFeedback({ ...feedback, title: e.target.value })
                                }
                                size='small'
                            />

                            <TextField
                                required
                                id='filled-required'
                                label='Nội dung'
                                style={{ width: "100%" }}
                                value={feedback.comment}
                                multiline
                                maxRows={4}
                                onChange={(e) =>
                                    setFeedback({ ...feedback, comment: e.target.value })
                                }
                                size='small'
                            />

                            <Button
                                className='w-100 my-3'
                                type='submit'
                                variant='outlined'
                                sx={{ width: "25%", padding: "10px" }}
                            >
                                Gửi
                            </Button>
                        </Box>
                    </form>
                </div>
            </div>
        </div>
    );
};
