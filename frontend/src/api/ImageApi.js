import ImageModel from "../model/ImageModel";
import { my_request } from "./Request";
import { endpointBE } from "../layout/utils/Constant";

export async function getAllImageByBook(idBook) {
    const endpoint = endpointBE + `/books/${idBook}`;
    try {
        const response = await my_request(endpoint);
        if (response && response.success && response.data && Array.isArray(response.data.images)) {
            return response.data.images.map((image) =>
                new ImageModel(
                    image.idImage,
                    image.nameImage,
                    image.thumbnail,
                    image.urlImage,
                    null
                )
            );
        }
    } catch (error) {
        console.error("Error in getAllImageByBook:", error);
    }
    return [];
}
