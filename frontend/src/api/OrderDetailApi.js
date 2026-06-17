import { endpointBE } from "../layout/utils/Constant";
import OrderDetail from "../model/OrderDetail";
import BookModel from "../model/BookModel";
import ImageModel from "../model/ImageModel";
import { my_request } from "./Request";

export const get1OrderDetail = async (idOrder) => {
    const endpoint = endpointBE + `/orders/${idOrder}`;
    const token = localStorage.getItem('token');
    try {
        const response = await my_request(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response && response.success && response.data && Array.isArray(response.data.listOrderDetails)) {
            return response.data.listOrderDetails.map((od) => {
                const b = od.book;
                const bookModel = b ? new BookModel(
                    b.idBook,
                    b.nameBook,
                    b.author,
                    "",
                    b.listPrice,
                    b.sellPrice,
                    b.quantity,
                    b.avgRating,
                    b.soldQuantity,
                    b.discountPercent
                ) : undefined;
                if (bookModel && Array.isArray(b.images)) {
                    bookModel.images = b.images.map(img => new ImageModel(img.idImage, img.nameImage, img.thumbnail, img.urlImage, null));
                }
                const detail = new OrderDetail(
                    od.idOrderDetail,
                    od.quantity,
                    od.price,
                    od.reviewed
                );
                detail.book = bookModel;
                return detail;
            });
        }
    } catch (error) {
        console.error("Error in get1OrderDetail:", error);
    }
    return [];
}
