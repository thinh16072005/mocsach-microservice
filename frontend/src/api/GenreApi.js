import { endpointBE } from "../layout/utils/Constant";
import GenreModel from "../model/GenreModel";
import { my_request } from "./Request";

export async function getAllGenres() {
   const endpoint = endpointBE + "/genres";
   try {
      const response = await my_request(endpoint);
      if (response && response.success && Array.isArray(response.data)) {
         return response.data.map(genre => new GenreModel(genre.idGenre, genre.nameGenre));
      }
   } catch (error) {
      console.error("Error in getAllGenres:", error);
   }
   return [];
}

export async function getGenreByIdBook(idBook) {
   const endpoint = endpointBE + `/books/${idBook}`;
   try {
      const response = await my_request(endpoint);
      if (response && response.success && response.data && Array.isArray(response.data.genres)) {
         return response.data.genres.map(genre => new GenreModel(genre.idGenre, genre.nameGenre));
      }
   } catch (error) {
      console.error("Error in getGenreByIdBook:", error);
   }
   return [];
}
