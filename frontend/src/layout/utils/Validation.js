import { endpointBE } from "./Constant";

export const checkExistEmail = async (setErrorEmail, email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      setErrorEmail("Email không đúng định dạng");
      return true;
   }
   const endpoint = endpointBE + `/users/search/existsByEmail?email=${email}`;
   try {
      const response = await fetch(endpoint);
      const data = await response.text();
      if (data === "true") {
         setErrorEmail("Email đã tồn tại!");
         return true;
      }
      setErrorEmail("");
      return false;
   } catch (error) {
      console.log("Lỗi api khi gọi hàm kiểm tra email");
   }
};

export const checkExistUsername = async (setErrorUsername, username) => {
   if (username.trim() === "") {
      setErrorUsername("Tên đăng nhập không được để trống");
      return true;
   }
   if (username.trim().length < 8) {
      setErrorUsername("Tên đăng nhập phải chứa ít nhất 8 ký tự");
      return true;
   }
   const usernameRegex = /^[a-zA-Z0-9_]+$/;
   if (!usernameRegex.test(username.trim())) {
      setErrorUsername("Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới");
      return true;
   }
   const endpoint = endpointBE + `/users/search/existsByUsername?username=${username}`;
   try {
      const response = await fetch(endpoint);
      const data = await response.text();
      if (data === "true") {
         setErrorUsername("Username đã tồn tại!");
         return true;
      }
      setErrorUsername("");
      return false;
   } catch (error) {
      console.log("Lỗi api khi gọi hàm kiểm tra username");
   }
};

export const checkPassword = (setErrorPassword, password) => {
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
   if (password.trim() === "") {
      setErrorPassword("Mật khẩu không được để trống");
      return true;
   } else if (!passwordRegex.test(password)) {
      setErrorPassword("Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ và số.");
      return true;
   } else {
      setErrorPassword("");
      return false;
   }
};

export const checkRepeatPassword = (setErrorRepeatPassword, repeatPassword, password) => {
   if (repeatPassword !== password) {
      setErrorRepeatPassword("Mật khẩu không khớp.");
      return true;
   } else {
      setErrorRepeatPassword("");
      return false;
   }
};

export const checkPhoneNumber = (setErrorPhoneNumber, phoneNumber) => {
   const phoneNumberRegex = /^(0[1-9]|84[1-9])[0-9]{8}$/;
   if (phoneNumber.trim() === "") {
      setErrorPhoneNumber("Số điện thoại không được để trống");
      return true;
   } else if (!phoneNumberRegex.test(phoneNumber.trim())) {
      setErrorPhoneNumber("Số điện thoại không đúng.");
      return true;
   } else {
      setErrorPhoneNumber("");
      return false;
   }
};

export const validateDateOfBirth = (date) => {
    if (!date) return true;
    const birthDate = new Date(date);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return false;
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    return actualAge >= 13 && actualAge <= 120;
};
