import { toast } from "react-toastify";
import { endpointBE } from "../layout/utils/Constant";
import { getIdUserByToken } from "../layout/utils/JwtService";
import CartItemModel from "../model/CartItemModel";
import BookModel from "../model/BookModel";
import ImageModel from "../model/ImageModel";
import { my_request } from "./Request";

export async function getCartAllByIdUser() {
   const idUser = Number(getIdUserByToken());
   if (!idUser) return [];
   const endpoint = endpointBE + `/cart/${idUser}`;
   const token = localStorage.getItem('token');
   try {
      const response = await my_request(endpoint, {
         headers: {
            'Authorization': `Bearer ${token}`,
         }
      });
      if (response && response.success && Array.isArray(response.data)) {
         return response.data.map(item => {
            const b = item.book;
            const bookModel = b ? new BookModel(
               b.idBook,
               b.nameBook,
               b.author,
               "", // description is not needed in cart view
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
            return new CartItemModel(item.idCartItem, item.quantity, bookModel, item.userId);
         });
      }
   } catch (error) {
      console.error('Error in getCartAllByIdUser: ', error);
   }
   return [];
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export async function updateQuantityCartItem(cartItem) {
   const endpoint = endpointBE + `/cart/items/${cartItem.idCart}`;
   const token = localStorage.getItem('token');
   try {
      const response = await my_request(endpoint, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
         body: JSON.stringify({
            quantity: cartItem.quantity,
         }),
      });
      if (response && response.success) {
         window.dispatchEvent(new Event('cart_updated'));
      }
   } catch (error) {
      console.error('Error: ', error);
   }
}

// Thêm sản phẩm vào giỏ hàng
export async function addCartItem(bookId, quantity) {
   const endpoint = endpointBE + `/cart/items`;
   const token = localStorage.getItem('token');
   const idUser = getIdUserByToken();
   try {
      const response = await my_request(endpoint, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-User-Id': idUser,
         },
         body: JSON.stringify({
            bookId,
            quantity
         }),
      });
      if (response && response.success) {
         toast.success("Đã thêm sản phẩm vào giỏ hàng");
         window.dispatchEvent(new Event('cart_updated'));
         return true;
      } else if (response) {
         toast.error(response.message || "Lỗi khi thêm sản phẩm");
      }
   } catch (error) {
      console.error('Error: ', error);
      toast.error("Lỗi kết nối khi thêm sản phẩm");
   }
   return false;
}

// Xóa sản phẩm khỏi giỏ hàng
export async function deleteCartItem(idCartItem) {
   const endpoint = endpointBE + `/cart/items/${idCartItem}`;
   const token = localStorage.getItem('token');
   try {
      const response = await fetch(endpoint, {
         method: 'DELETE',
         headers: {
            'Authorization': `Bearer ${token}`,
         },
      });
      if (response.ok) {
         toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
         window.dispatchEvent(new Event('cart_updated'));
         return true;
      }
   } catch (error) {
      console.error('Error: ', error);
   }
   return false;
}
