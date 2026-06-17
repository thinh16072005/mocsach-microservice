import { endpointBE } from "../layout/utils/Constant";
import OrderModel from "../model/OrderModel";
import { my_request } from "./Request";

const getToken = () => localStorage.getItem("token") || "";

let deliveryCache = null;
let paymentCache = null;

async function getDeliveryMap() {
    if (deliveryCache) return deliveryCache;
    try {
        const response = await my_request(endpointBE + "/deliveries");
        if (response && response.success && Array.isArray(response.data)) {
            deliveryCache = {};
            response.data.forEach(d => {
                deliveryCache[d.idDelivery] = d.nameDelivery;
            });
            return deliveryCache;
        }
    } catch (error) {
        console.error("Failed to load deliveries:", error);
    }
    return {};
}

async function getPaymentMap() {
    if (paymentCache) return paymentCache;
    try {
        const response = await my_request(endpointBE + "/payments");
        if (response && response.success && Array.isArray(response.data)) {
            paymentCache = {};
            response.data.forEach(p => {
                paymentCache[p.idPayment] = p.namePayment;
            });
            return paymentCache;
        }
    } catch (error) {
        console.error("Failed to load payments:", error);
    }
    return {};
}

export async function getOrders(page = 0, size = 10, sort = "idOrder,desc") {
   const url = `${endpointBE}/orders`;
   const token = getToken();
   const headers = {};
   if (token) headers.Authorization = `Bearer ${token}`;
   
   try {
      const response = await my_request(url, { headers });
      if (!response || !response.success || !Array.isArray(response.data)) {
         return { items: [], page: { number: 0, size: 10, totalElements: 0, totalPages: 0 } };
      }

      const ordersData = response.data;
      const deliveryMap = await getDeliveryMap();
      const paymentMap = await getPaymentMap();

      const items = ordersData.map((o) => {
         return new OrderModel(
             o.idOrder,
             o.deliveryAddress,
             o.totalPrice,
             o.totalPriceProduct,
             o.feeDelivery,
             o.feePayment,
             o.dateCreated,
             o.status,
             o.paymentStatus,
             o.userId,
             o.fullName,
             o.phoneNumber,
             o.note,
             paymentMap[o.paymentId] || "",
             deliveryMap[o.deliveryId] || ""
         );
      });

      if (sort.includes("idOrder")) {
         if (sort.includes("desc")) {
            items.sort((a, b) => b.idOrder - a.idOrder);
         } else {
            items.sort((a, b) => a.idOrder - b.idOrder);
         }
      }
      
      const totalElements = items.length;
      const totalPages = Math.ceil(totalElements / size);
      const startIndex = page * size;
      const paginatedItems = items.slice(startIndex, startIndex + size);

      return { 
         items: paginatedItems, 
         page: { number: page, size, totalElements, totalPages } 
      };
   } catch (error) {
      console.error("Error in getOrders:", error);
   }
   return { items: [], page: { number: 0, size: 10, totalElements: 0, totalPages: 0 } };
}

export async function getOrderById(idOrder) {
    const url = `${endpointBE}/orders/${idOrder}`;
    const token = getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        const response = await my_request(url, { headers });
        if (response && response.success && response.data) {
            const o = response.data;
            const deliveryMap = await getDeliveryMap();
            const paymentMap = await getPaymentMap();
            return new OrderModel(
                o.idOrder,
                o.deliveryAddress,
                o.totalPrice,
                o.totalPriceProduct,
                o.feeDelivery,
                o.feePayment,
                o.dateCreated,
                o.status,
                o.paymentStatus,
                o.userId,
                o.fullName,
                o.phoneNumber,
                o.note,
                paymentMap[o.paymentId] || "",
                deliveryMap[o.deliveryId] || ""
            );
        }
    } catch (error) {
        console.error("Error in getOrderById:", error);
    }
    return null;
}

export async function updateOrderStatus(idOrder, status) {
   const url = `${endpointBE}/orders/${idOrder}/status`;
   const token = getToken();
   const res = await fetch(url, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
   });
   if (!res.ok) {
      throw new Error("Cập nhật trạng thái thất bại");
   }
}

export const getAllOrdersByIdUser = async (idUser) => {
   const url = `${endpointBE}/orders/user/${idUser}`;
   const token = getToken();
   const headers = {};
   if (token) headers.Authorization = `Bearer ${token}`;
   try {
      const response = await my_request(url, { headers });
      if (response && response.success && Array.isArray(response.data)) {
         const deliveryMap = await getDeliveryMap();
         const paymentMap = await getPaymentMap();
         return response.data.map((o) => new OrderModel(
             o.idOrder,
             o.deliveryAddress,
             o.totalPrice,
             o.totalPriceProduct,
             o.feeDelivery,
             o.feePayment,
             o.dateCreated,
             o.status,
             o.paymentStatus,
             o.userId,
             o.fullName,
             o.phoneNumber,
             o.note,
             paymentMap[o.paymentId] || "",
             deliveryMap[o.deliveryId] || ""
         ));
      }
   } catch (error) {
      console.error("Error in getAllOrdersByIdUser:", error);
   }
   return [];
};

export const get1Order = async (idOrder) => {
   return getOrderById(idOrder);
};

export const cancel1Order = async (order) => {
    const token = localStorage.getItem("token");
    const endpoint = endpointBE + `/orders/${order.idOrder}/cancel`;
    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Hủy đơn hàng thất bại");
    }
    return response.json();
};

export async function getAllOrders() {
    try {
        const result = await getOrders(0, 1000);
        return result.items;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
}
