import Avatar from "@mui/material/Avatar";
import { useEffect, useLayoutEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import EditOutlined from "@mui/icons-material/EditOutlined";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";

import { getIdUserByToken, isToken } from "../utils/JwtService";
import UserModel from "../../model/UserModel";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import { get1User, changeAvatar } from "../../api/UserApi";
import { endpointBE } from "../utils/Constant";
import { checkPhoneNumber } from "../utils/Validation";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import OrderTable from "./components/OrderTable.jsx";


const ProfilePage = () => {
    useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

    const navigation = useNavigate();

    useLayoutEffect(() => {
        if (!isToken()) {
            navigation("/login");
        }
    });

    // Các biến thông tin cá nhân
    const [profileUser, setProfileUser] = useState({
        idUser: 0,
        dateOfBirth: new Date(),
        deliveryAddress: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "",
        password: "",
        phoneNumber: "",
        username: "",
        avatar: "",
        enabled: true,
    });

    const [editUser, setEditUser] = useState({
        idUser: 0,
        dateOfBirth: new Date(),
        deliveryAddress: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "",
        password: "",
        phoneNumber: "",
        username: "",
        avatar: "",
        enabled: true,
    });

    // State cho chế độ chỉnh sửa
    const [isEditMode, setIsEditMode] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        deliveryAddress: "",
        dateOfBirth: "",
        gender: "",
    });

    // State cho tab navigation
    const [currentTab, setCurrentTab] = useState(0);

    // State cho đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validatePasswordField = (field, value, sourceData = passwordData) => {
        if (field === "currentPassword") {
            if (!value) return "Vui lòng nhập mật khẩu hiện tại";
            return "";
        }

        if (field === "newPassword") {
            if (!value) return "Vui lòng nhập mật khẩu mới";
            if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
            return "";
        }

        if (field === "confirmPassword") {
            if (!value) return "Vui lòng xác nhận mật khẩu";
            if (value !== sourceData.newPassword) return "Mật khẩu xác nhận không khớp";
            return "";
        }

        return "";
    };

    // State cho upload avatar
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Lấy data user lên
    useEffect(() => {
        const idUser = Number(getIdUserByToken());

        get1User(idUser)
            .then((response) => {
                const userData = {
                    ...response,
                    dateOfBirth: new Date(response.dateOfBirth),
                };
                setProfileUser(userData);
                setEditUser(userData);
            })
            .catch((error) => console.log(error));
    }, []);

    const normalizeName = (value) => (value || "").trim().replace(/\s+/g, " ");

    const hasRealNameChange = (next, prev) =>
        normalizeName(next.firstName) !== normalizeName(prev.firstName) ||
        normalizeName(next.lastName) !== normalizeName(prev.lastName);

    const clearFieldError = (field) => {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateRequiredFields = () => {
        const nextErrors = {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            deliveryAddress: "",
            dateOfBirth: "",
            gender: "",
        };

        if (!editUser.firstName?.trim()) nextErrors.firstName = "Vui lòng nhập họ đệm";
        if (!editUser.lastName?.trim()) nextErrors.lastName = "Vui lòng nhập tên";
        if (!editUser.phoneNumber?.trim()) nextErrors.phoneNumber = "Vui lòng nhập số điện thoại";
        if (!editUser.deliveryAddress?.trim()) nextErrors.deliveryAddress = "Vui lòng nhập địa chỉ giao hàng";
        if (!editUser.dateOfBirth) nextErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
        if (!editUser.gender?.trim()) nextErrors.gender = "Vui lòng chọn giới tính";

        setFieldErrors(nextErrors);
        return Object.values(nextErrors).every((value) => !value);
    };


    // Xử lý thay đổi tên
    const handleFirstNameChange = (e) => {
        setEditUser({ ...editUser, firstName: e.target.value });
        clearFieldError("firstName");
    };

    const handleLastNameChange = (e) => {
        setEditUser({ ...editUser, lastName: e.target.value });
        clearFieldError("lastName");
    };

    // Xử lý thay đổi số điện thoại
    const handlePhoneNumberChange = (e) => {
        setEditUser({ ...editUser, phoneNumber: e.target.value });
        setErrorPhoneNumber("");
        clearFieldError("phoneNumber");
    };

    // Xử lý thay đổi địa chỉ
    const handleAddressChange = (e) => {
        setEditUser({ ...editUser, deliveryAddress: e.target.value });
        clearFieldError("deliveryAddress");
    };
    // Xử lý thay đổi ngày sinh
    const handleDateOfBirthChange = (e) => {
        setEditUser({ ...editUser, dateOfBirth: new Date(e.target.value) });
        clearFieldError("dateOfBirth");
    };

    // Xử lý thay đổi giới tính
    const handleGenderChange = (e) => {
        setEditUser({ ...editUser, gender: e.target.value });
        clearFieldError("gender");
    };

    // Xử lý khi bấm nút chỉnh sửa
    const handleEditClick = () => {
        setIsEditMode(true);
        setEditUser({ ...profileUser });
    };

    // Xử lý khi hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditUser({ ...profileUser });
        setIsEditMode(false);
        setErrorPhoneNumber("");
        setFieldErrors({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            deliveryAddress: "",
            dateOfBirth: "",
            gender: "",
        });
    };

    // Xử lý khi submit form cập nhật thông tin
    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasValidRequiredFields = validateRequiredFields();
        if (!hasValidRequiredFields) {
            toast.warning("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }

        const prev = profileUser;
        const realNameChanged = hasRealNameChange(editUser, prev);

        // Nếu có thay đổi tên thật thì mới normalize,
        // còn không thì giữ nguyên để tránh việc người dùng nhập tên có khoảng trắng ở đầu/cuối hoặc nhiều khoảng trắng giữa các từ rồi bị normalize
        const firstNameToUse = realNameChanged ? normalizeName(editUser.firstName) : prev.firstName;
        const lastNameToUse = realNameChanged ? normalizeName(editUser.lastName) : prev.lastName;

        // Kiểm tra validation số điện thoại
        if (errorPhoneNumber.length > 0) {
            toast.warning("Vui lòng kiểm tra lại thông tin số điện thoại");
            return;
        }

        const token = localStorage.getItem("token");
        const idUser = getIdUserByToken();

        try {
            const response = await fetch(endpointBE + `/users/${idUser}/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    firstName: firstNameToUse,
                    lastName: lastNameToUse,
                    gender: editUser.gender,
                    phoneNumber: editUser.phoneNumber,
                    deliveryAddress: editUser.deliveryAddress,
                    dateOfBirth: editUser.dateOfBirth,
                }),
            });

            if (response.ok) {
                toast.success("Cập nhật thông tin thành công");
                const nextUser = {
                    ...editUser,
                    firstName: firstNameToUse,
                    lastName: lastNameToUse,
                };
                setProfileUser(nextUser);
                setEditUser(nextUser);
                setIsEditMode(false);
                localStorage.setItem("user_lastname", lastNameToUse || "");
                window.dispatchEvent(new Event("profile_updated"));
            } else {
                toast.error("Cập nhật thông tin thất bại");
            }
        } catch (error) {
            console.log(error);
            toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
        }
    };

    // Xử lý thay đổi mật khẩu
    const handlePasswordChange = (field, value) => {
        const nextData = { ...passwordData, [field]: value };
        setPasswordData(nextData);

        setPasswordErrors((prev) => {
            const nextErrors = {
                ...prev,
                [field]: validatePasswordField(field, value, nextData),
            };

            // Khi đổi mật khẩu mới, xác nhận mật khẩu cần được kiểm tra lại ngay.
            if (field === "newPassword" && nextData.confirmPassword) {
                nextErrors.confirmPassword = validatePasswordField(
                    "confirmPassword",
                    nextData.confirmPassword,
                    nextData
                );
            }

            return nextErrors;
        });
    };

    const handlePasswordBlur = (field) => {
        setPasswordErrors((prev) => ({
            ...prev,
            [field]: validatePasswordField(field, passwordData[field]),
        }));
    };

    // Xử lý upload avatar
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Kiểm tra loại file
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }

        // Kiểm tra kích thước file (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Kích thước ảnh không được vượt quá 10MB");
            return;
        }

        setIsUploadingAvatar(true);

        try {
            // Convert file sang Base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64String = reader.result;
                    const idUser = Number(getIdUserByToken());

                    // Gọi API upload avatar
                    await changeAvatar(idUser, base64String);

                    // Lấy lại thông tin user để cập nhật avatar
                    const updatedUser = await get1User(idUser);
                    const updatedUserData = {
                        ...updatedUser,
                        dateOfBirth: new Date(updatedUser.dateOfBirth),
                    };
                    setProfileUser(updatedUserData);
                    setEditUser(updatedUserData);

                    localStorage.setItem("user_avatar", updatedUserData.avatar || "");
                    window.dispatchEvent(new Event("profile_updated"));

                    toast.success("Upload avatar thành công!");
                } catch (error) {
                    console.error("Error uploading avatar:", error);
                    toast.error(error.message || "Upload avatar thất bại");
                } finally {
                    setIsUploadingAvatar(false);
                    // Reset input để có thể chọn cùng file lần nữa
                    e.target.value = "";
                }
            };

            reader.onerror = () => {
                toast.error("Lỗi khi đọc file ảnh");
                setIsUploadingAvatar(false);
                e.target.value = "";
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Đã xảy ra lỗi khi upload avatar");
            setIsUploadingAvatar(false);
            e.target.value = "";
        }
    };

    // Styled component cho input file ẩn
    const Input = styled("input")({
        display: "none",
    });

    // Xử lý submit đổi mật khẩu
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {
            currentPassword: validatePasswordField("currentPassword", passwordData.currentPassword),
            newPassword: validatePasswordField("newPassword", passwordData.newPassword),
            confirmPassword: validatePasswordField("confirmPassword", passwordData.confirmPassword),
        };

        const hasError = Object.values(newErrors).some((value) => value.length > 0);

        if (hasError) {
            setPasswordErrors(newErrors);
            return;
        }

        const token = localStorage.getItem("token");
        const idUser = getIdUserByToken();

        try {
            const response = await fetch(endpointBE + `/auth/change-password`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Đổi mật khẩu thành công");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setPasswordErrors({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(data.message || "Đổi mật khẩu thất bại");
            }
        } catch (error) {
            console.log(error);
            toast.error("Đã xảy ra lỗi khi đổi mật khẩu");
        }
    };

    //Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!isToken()) {
        navigation("/login");
        return null;
    }


    return (
        <div className='container my-5'>
            <div className='row'>
                <div className='col-sm-12 col-md-12 col-lg-3'>
                    <div className='bg-light rounded py-3 me-lg-2 me-md-0 me-sm-0'>
                        <div className='d-flex align-items-center justify-content-center flex-column position-relative'>
                            <Avatar
                                style={{ fontSize: "50px" }}
                                alt={(profileUser.lastName || "").toUpperCase()}
                                src={profileUser.avatar || "/images/user/user-default.jpg"}
                                sx={{ width: 100, height: 100 }}
                            />
                            <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                                <Input
                                    accept="image/*"
                                    id="avatar-upload"
                                    type="file"
                                    onChange={handleAvatarChange}
                                    disabled={isUploadingAvatar}
                                />
                                <IconButton
                                    color="primary"
                                    aria-label="upload avatar"
                                    component="span"
                                    disabled={isUploadingAvatar}
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: "calc(50% - 50px)",
                                        backgroundColor: "white",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        },
                                    }}
                                >
                                    {isUploadingAvatar ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <PhotoCamera />
                                    )}
                                </IconButton>
                            </label>
                        </div>

                        <div className='text-center mt-3'>
                            <p className='fs-4 fw-bold'>
                                {profileUser.firstName + " " + profileUser.lastName}
                            </p>
                        </div>

                        <div className='text-center mt-3'>
                            <p>{profileUser.email}</p>
                            {isUploadingAvatar && (
                                <p className='text-muted' style={{ fontSize: "0.875rem" }}>
                                    Đang tải lên...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='col-sm-12 col-md-12 col-lg-9'>
                    <div
                        className='bg-light rounded px-2 ms-lg-2 ms-md-0 ms-sm-0 mt-lg-0 mt-md-3 mt-sm-3'
                        style={{ minHeight: "300px" }}
                    >
                        {/* Tab Navigation */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={currentTab}
                                onChange={(e, newValue) => setCurrentTab(newValue)}
                                aria-label="profile tabs"
                            >
                                <Tab label="Thông tin cá nhân" />
                                <Tab label="Đơn hàng" />
                                <Tab label="Đổi mật khẩu" />
                            </Tabs>
                        </Box>

                        {/* Tab Panel: Thông tin cá nhân */}
                        {currentTab === 0 && (
                            <div className='py-3 position-relative'>
                                <h4 className='mb-4'>Thông tin cá nhân</h4>
                                {!isEditMode && (
                                    <div
                                        className='position-absolute'
                                        style={{
                                            top: "20px",
                                            right: "20px",
                                        }}
                                    >
                                        <Tooltip title='Chỉnh sửa thông tin' placement='bottom-end'>
                                            <Button
                                                variant='contained'
                                                type='button'
                                                className='rounded-pill'
                                                onClick={handleEditClick}
                                            >
                                                <EditOutlined sx={{ width: "24px" }} />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className='form' style={{ padding: "0 20px" }}>
                                    <div className='row'>
                                        <div className='col-sm-12 col-md-6 col-lg-4'>
                                            <TextField
                                                required
                                                fullWidth
                                                label='ID'
                                                value={profileUser.idUser}
                                                disabled={true}
                                                className='input-field'
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                required
                                                fullWidth
                                                label='Họ đệm'
                                                placeholder='Nhập họ đệm'
                                                value={editUser.firstName}
                                                onChange={handleFirstNameChange}
                                                onBlur={(e) => {
                                                    if (isEditMode && !e.target.value.trim()) {
                                                        setFieldErrors((prev) => ({ ...prev, firstName: "Vui lòng nhập họ đệm" }));
                                                    }
                                                }}
                                                disabled={!isEditMode}
                                                error={isEditMode && fieldErrors.firstName.length > 0}
                                                helperText={isEditMode ? fieldErrors.firstName : ""}
                                                className='input-field'


                                            />
                                            <TextField
                                                fullWidth
                                                required
                                                label='Số điện thoại'
                                                placeholder='Nhập số điện thoại'
                                                value={editUser.phoneNumber || ""}
                                                onChange={handlePhoneNumberChange}
                                                onBlur={(e) => {
                                                    if (isEditMode) {
                                                        if (!e.target.value.trim()) {
                                                            setFieldErrors((prev) => ({ ...prev, phoneNumber: "Vui lòng nhập số điện thoại" }));
                                                            return;
                                                        }
                                                        checkPhoneNumber(
                                                            setErrorPhoneNumber,
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                                disabled={!isEditMode}
                                                error={isEditMode && (fieldErrors.phoneNumber.length > 0 || errorPhoneNumber.length > 0)}
                                                helperText={isEditMode ? (fieldErrors.phoneNumber || errorPhoneNumber) : ""}
                                                className='input-field'
                                            />
                                        </div>
                                        <div className='col-sm-12 col-md-6 col-lg-4'>
                                            <TextField
                                                required
                                                fullWidth
                                                label='Tên tài khoản'
                                                value={profileUser.username}
                                                disabled={true}
                                                className='input-field'
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                required
                                                fullWidth
                                                label='Tên'
                                                placeholder='Nhập tên'
                                                value={editUser.lastName}
                                                onChange={handleLastNameChange}
                                                onBlur={(e) => {
                                                    if (isEditMode && !e.target.value.trim()) {
                                                        setFieldErrors((prev) => ({ ...prev, lastName: "Vui lòng nhập tên" }));
                                                    }
                                                }}
                                                disabled={!isEditMode}
                                                error={isEditMode && fieldErrors.lastName.length > 0}
                                                helperText={isEditMode ? fieldErrors.lastName : ""}
                                                className='input-field'
                                            />
                                            <TextField
                                                required
                                                fullWidth
                                                label='Địa chỉ giao hàng'
                                                placeholder='Nhập địa chỉ giao hàng'
                                                value={editUser.deliveryAddress || ""}
                                                onChange={handleAddressChange}
                                                onBlur={(e) => {
                                                    if (isEditMode && !e.target.value.trim()) {
                                                        setFieldErrors((prev) => ({ ...prev, deliveryAddress: "Vui lòng nhập địa chỉ giao hàng" }));
                                                    }
                                                }}
                                                disabled={!isEditMode}
                                                error={isEditMode && fieldErrors.deliveryAddress.length > 0}
                                                helperText={isEditMode ? fieldErrors.deliveryAddress : ""}
                                                className='input-field'
                                            />
                                        </div>
                                        <div className='col-sm-12 col-md-6 col-lg-4'>
                                            <TextField
                                                required
                                                fullWidth
                                                label='Email'
                                                value={profileUser.email}
                                                className='input-field'
                                                disabled={true}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                required
                                                fullWidth
                                                className='input-field'
                                                label='Ngày sinh'
                                                placeholder='Nhập ngày sinh'
                                                style={{ width: "100%" }}
                                                type='date'
                                                value={
                                                    editUser.dateOfBirth
                                                        ? new Date(editUser.dateOfBirth).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                disabled={!isEditMode}
                                                onChange={handleDateOfBirthChange}
                                                onBlur={(e) => {
                                                    if (isEditMode && !e.target.value) {
                                                        setFieldErrors((prev) => ({ ...prev, dateOfBirth: "Vui lòng chọn ngày sinh" }));
                                                    }
                                                }}
                                                error={isEditMode && fieldErrors.dateOfBirth.length > 0}
                                                helperText={isEditMode ? fieldErrors.dateOfBirth : ""}

                                            />
                                            <FormControl>
                                                <FormLabel id='demo-row-radio-buttons-group-label'>
                                                    Giới tính
                                                </FormLabel>

                                                <RadioGroup
                                                    row
                                                    aria-labelledby='demo-row-radio-buttons-group-label'
                                                    name='row-radio-buttons-group'
                                                    value={editUser.gender || ""}
                                                    onChange={handleGenderChange}

                                                >
                                                    <FormControlLabel
                                                        disabled={!isEditMode}
                                                        value='M'
                                                        control={<Radio />}
                                                        label='Nam'
                                                    />
                                                    <FormControlLabel
                                                        disabled={!isEditMode}
                                                        value='F'
                                                        control={<Radio />}
                                                        label='Nữ'
                                                    />
                                                </RadioGroup>
                                                {isEditMode && fieldErrors.gender && (
                                                    <span className='text-danger' style={{ fontSize: "0.75rem" }}>
                                                        {fieldErrors.gender}
                                                    </span>
                                                )}
                                            </FormControl>
                                        </div>
                                    </div>
                                    {isEditMode && (
                                        <div className='text-center my-3'>
                                            <Button
                                                variant='outlined'
                                                type='button'
                                                onClick={handleCancelEdit}
                                                sx={{ marginRight: "10px", padding: "10px 30px" }}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                variant='contained'
                                                type='submit'
                                                sx={{ padding: "10px 30px" }}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Tab Panel: Xem đơn hàng */}
                        {currentTab === 1 && (
                            <div>
                                <OrderTable/>
                            </div>
                        )}

                        {/* Tab Panel: Đổi mật khẩu */}
                        {currentTab === 2 && (
                            <div className='py-3'>
                                <h4 className='mb-4'>Đổi mật khẩu</h4>
                                <form onSubmit={handleChangePasswordSubmit} className='form' style={{ padding: "0 20px" }}>
                                    <div className='row'>
                                        <div className='col-sm-12 col-md-6 col-lg-4'>
                                            <TextField
                                                required
                                                fullWidth
                                                type='password'
                                                label='Mật khẩu hiện tại'
                                                placeholder='Nhập mật khẩu hiện tại'
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                                onBlur={() => handlePasswordBlur("currentPassword")}
                                                error={passwordErrors.currentPassword.length > 0}
                                                helperText={passwordErrors.currentPassword}
                                                className='input-field'
                                            />
                                        </div>
                                        <div className='col-sm-12 col-md-6 col-lg-4'>
                                            <TextField
                                                required
                                                fullWidth
                                                type='password'
                                                label='Mật khẩu mới'
                                                placeholder='Nhập mật khẩu mới'
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                                onBlur={() => handlePasswordBlur("newPassword")}
                                                error={passwordErrors.newPassword.length > 0}
                                                helperText={passwordErrors.newPassword}
                                                className='input-field'
                                            />
                                        </div>
                                        <div className='col-sm-12 col-md-6 col-lg-4'>
                                            <TextField
                                                required
                                                fullWidth
                                                type='password'
                                                label='Xác nhận mật khẩu mới'
                                                placeholder='Nhập lại mật khẩu mới'
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                                onBlur={() => handlePasswordBlur("confirmPassword")}
                                                error={passwordErrors.confirmPassword.length > 0}
                                                helperText={passwordErrors.confirmPassword}
                                                className='input-field'
                                            />
                                        </div>
                                    </div>
                                    <div className='text-center my-3'>
                                        <Button
                                            variant='outlined'
                                            type='button'
                                            onClick={() => {
                                                setPasswordData({
                                                    currentPassword: "",
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                });
                                                setPasswordErrors({
                                                    currentPassword: "",
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                });
                                            }}
                                            sx={{ marginRight: "10px", padding: "10px 30px" }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            variant='contained'
                                            type='submit'
                                            sx={{ padding: "10px 30px" }}
                                        >
                                            Đổi mật khẩu
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

