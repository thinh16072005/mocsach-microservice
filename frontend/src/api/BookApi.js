import { endpointBE } from "../layout/utils/Constant";
import BookModel from "../model/BookModel";
import { my_request } from "./Request";

// Tạo phương thức lấy sách
async function getBook(endpoint) {
   const response = await my_request(endpoint);
   if (!response || !response.success || !response.data) {
      return { bookList: [], totalPages: 0, size: 0, totalElements: 0 };
   }

   const page = response.data;
   const responseData = page.content || [];
   const totalPages = page.totalPages || 0;
   const totalElements = page.totalElements || 0;
   const size = page.size || 0;

   const bookList = responseData.map((book) =>
      new BookModel(
         book.idBook,
         book.nameBook,
         book.author,
         book.description || "",
         book.listPrice,
         book.sellPrice,
         book.quantity,
         book.avgRating,
         book.soldQuantity,
         book.discountPercent
      )
   );

   return { bookList, totalPages, size, totalElements };
}

// Lấy sách bán chạy
export async function getHotBook() {
   try {
      const endpoint = endpointBE + "/books/bestsellers?size=4";
      const response = await my_request(endpoint);
      if (response && response.success && Array.isArray(response.data)) {
         const bookList = response.data.map(book => new BookModel(
            book.idBook,
            book.nameBook,
            book.author,
            book.description || "",
            book.listPrice,
            book.sellPrice,
            book.quantity,
            book.avgRating,
            book.soldQuantity,
            book.discountPercent
         ));
         return {
            bookList,
            totalPages: 1,
            size: bookList.length,
            totalElements: bookList.length
         };
      }
   } catch (error) {
      console.error("Error fetching hot books:", error);
   }
   return { bookList: [], totalPages: 0, size: 0, totalElements: 0 };
}

// Lấy sách mới
export async function getNewBook() {
   const endpoint = endpointBE + "/books?sort=idBook,desc&size=4";
   return getBook(endpoint);
}

// Lấy tất cả các sách
export async function getAllBook(size, page) {
   if (!size) {
      size = 8;
   }
   if (page === undefined || page === null) {
      page = 0;
   }
   const endpoint = endpointBE + `/books?sort=soldQuantity,desc&sort=idBook,asc&size=${size}&page=${page}`;
   return getBook(endpoint);
}

// Tìm kiếm sách
export async function searchBook(idGenre, keySearch, size, page) {
   if (!size) {
      size = 8;
   }
   if (page === undefined) {
      page = 0;
   }

   let url = endpointBE + `/books/search?page=${page}&size=${size}`;
   if (keySearch && keySearch.trim() !== "") {
      url += `&name=${encodeURIComponent(keySearch)}`;
   }
   if (idGenre !== undefined && idGenre !== null) {
      url += `&genreId=${idGenre}`;
   }

   return getBook(url);
}

// Lấy sách theo ID
export async function getBookById(idBook) {
   const endpoint = endpointBE + `/books/${idBook}`;
   try {
      const response = await my_request(endpoint);
      if (response && response.success && response.data) {
         const bookData = response.data;
         return new BookModel(
            bookData.idBook,
            bookData.nameBook,
            bookData.author,
            bookData.description || "",
            bookData.listPrice,
            bookData.sellPrice,
            bookData.quantity,
            bookData.avgRating,
            bookData.soldQuantity,
            bookData.discountPercent
         );
      }
   } catch (error) {
      console.error("Error in getBookById:", error);
   }
   return null;
}


// Lấy số lượng sách theo genre ID
export async function getBookCountByGenreId(genreId) {
   try {
      const endpoint = endpointBE + `/books/search?genreId=${genreId}&size=1`;
      const response = await my_request(endpoint);
      if (response && response.success && response.data) {
         return response.data.totalElements || 0;
      }
   } catch (error) {
      console.error("Error fetching book count by genre:", error);
   }
   return 0;
}
