import { toast } from "react-toastify";

// ✅ Helper để format Date sang string YYYY-MM-DD
export const formatDateToInput = (date) => {
    if (!date) return '';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

// ✅ Helper để format Date hiển thị (dd/mm/yyyy)
export const formatDateDisplay = (date) => {
    if (!date) return '-';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('vi-VN');
    } catch {
        return '-';
    }
};

// ✅ Helper để lấy token từ localStorage
export const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Token không tìm thấy!");
        return null;
    }
    return token;
};

// ✅ Helper để xử lý lỗi response từ server
export const handleErrorResponse = async (response) => {
    try {
        const errorData = await response.json();
        console.group(`❌ Error ${response.status}`);
        console.log('Error Data:', errorData);
        console.groupEnd();
        
        // Xử lý nhiều định dạng lỗi từ backend
        if (errorData.notification) return errorData.notification;
        if (errorData.message) return errorData.message;
        if (errorData.error) return errorData.error;
        if (errorData.errors && Array.isArray(errorData.errors)) {
            return errorData.errors.map((e) => e.message || e).join(', ');
        }
        if (errorData.fieldErrors && typeof errorData.fieldErrors === 'object') {
            return Object.entries(errorData.fieldErrors)
                .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
        }
        if (typeof errorData === 'string') return errorData;
        
        return `Lỗi ${response.status}: ${response.statusText}`;
    } catch (e) {
        console.log('Không parse được JSON response');
        return `Lỗi ${response.status}: ${response.statusText}`;
    }
};

// ✅ Helper để log request
export const logRequest = (action, data) => {
    console.group(`📤 ${action}`);
    console.log('Request Body:', JSON.stringify(data, null, 2));
    console.groupEnd();
};

// ✅ Helper để log response
export const logResponse = (action, response) => {
    console.group(`✅ ${action}`);
    console.log('Response:', JSON.stringify(response, null, 2));
    console.groupEnd();
};

// ✅ Helper để debug request
export const debugRequest = (token, endpoint) => {
    console.log("🔑 Token tồn tại:", token ? "✅ Có" : "❌ Không");
    console.log("🔑 Token preview:", token ? token.substring(0, 50) + "..." : "Không có");
    console.log("📍 Endpoint đầy đủ:", endpoint);
};

// ✅ Helper để debug response
export const debugResponse = (status, statusText) => {
    console.log("📥 Response status:", status, statusText);
};

