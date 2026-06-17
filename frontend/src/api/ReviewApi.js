import { endpointBE } from "../layout/utils/Constant";
import ReviewModel from "../model/ReviewModel";
import { my_request } from "./Request";
import { getIdUserByToken } from "../layout/utils/JwtService";

export async function getReviewByIdBook(idBook) {
    const endPoint = endpointBE + `/reviews/book/${idBook}`;
    try {
        const response = await my_request(endPoint);
        if (response && response.success && Array.isArray(response.data)) {
            return response.data.map((review) => {
                const model = new ReviewModel(
                    review.idReview,
                    review.content,
                    review.ratingPoint,
                    review.timestamp
                );
                model.user = review.user; // contains idUser, username, avatar
                return model;
            });
        }
    } catch (error) {
        console.error("Error in getReviewByIdBook:", error);
    }
    return [];
}

export async function addReview(bookId, ratingPoint, content, orderDetailId) {
    const token = localStorage.getItem("token");
    const userId = getIdUserByToken();
    const endpoint = endpointBE + "/reviews";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-User-Id": userId
            },
            body: JSON.stringify({
                bookId,
                ratingPoint,
                content,
                orderDetailId
            })
        });
        return response.ok;
    } catch (error) {
        console.error("Error in addReview:", error);
        return false;
    }
}
