import { toast } from "react-toastify";
import { endpointBE } from "../layout/utils/Constant";
import Coupon from "../model/Coupon";

export async function getCoupon(page = 0, size = 10) {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + `/coupons?page=${page}&size=${size}`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const responseData = await response.json();
        if (responseData && responseData.success && responseData.data) {
            const pageData = responseData.data;
            const couponList = (pageData.content || []).map((item) =>
                new Coupon(item.idCoupon, item.code, item.discountPercent, item.expiryDate, item.isUsed, item.isActive)
            );
            return {
                coupons: couponList,
                totalPages: pageData.totalPages || 0,
                totalElements: pageData.totalElements || 0,
                currentPage: page
            };
        }
    } catch (error) {
        console.error('Error in getCoupon: ', error);
    }
    return { coupons: [], totalPages: 0, totalElements: 0, currentPage: 0 };
}

export async function createCoupon(quantity, discountPercent, expiryDate) {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + `/coupons/batch?quantity=${quantity}`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ discountPercent, expiryDate })
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
            toast.success(responseData.message || "Tạo mã giảm giá thành công");
        } else {
            toast.error(responseData.message || "Lỗi khi tạo mã giảm giá");
        }
    } catch (error) {
        toast.error("Xảy ra lỗi khi tạo mã giảm giá");
    }
}

export async function deleteCoupon(id) {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + `/coupons/${id}`;
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
            toast.success(responseData.message || "Xóa mã giảm giá thành công");
        } else {
            toast.error(responseData.message || "Lỗi khi xóa mã giảm giá");
        }
    } catch (error) {
        toast.error("Xảy ra lỗi khi xóa mã giảm giá");
    }
}

export async function updateActiveCoupon(id, isActive) {
    const endpoint = endpointBE + `/coupons/${id}/activate`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
            toast.success(responseData.message || "Cập nhật mã giảm giá thành công");
        } else {
            toast.error(responseData.message || "Lỗi khi cập nhật mã giảm giá");
        }
    } catch (error) {
        toast.error("Xảy ra lỗi khi cập nhật mã giảm giá");
    }
}

export async function getAllCoupons() {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + "/coupons?size=1000";
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const responseData = await response.json();
        if (responseData && responseData.success && responseData.data) {
            return (responseData.data.content || []).map((item) =>
                new Coupon(item.idCoupon, item.code, item.discountPercent, item.expiryDate, item.isUsed, item.isActive)
            );
        }
    } catch (error) {
        console.error('Error: ', error);
    }
    return [];
}

export async function updateUsedCoupon(code) {
    const endpoint = endpointBE + `/coupons/use?code=${code}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
            console.log(responseData.message);
        } else {
            console.log(responseData.message);
        }
    } catch (error) {
        console.log("Xảy ra lỗi khi cập nhật mã giảm giá");
    }
}
