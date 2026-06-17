import { endpointBE } from "../layout/utils/Constant";
import { my_request } from "./Request";

export async function getFavoriteBooksByUser(idUser) {
    const endpoint = `${endpointBE}/favorites/user/${idUser}`;
    const token = localStorage.getItem('token');
    try {
        const response = await my_request(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response && response.success && Array.isArray(response.data)) {
            return response.data.map(item => item.bookId);
        }
    } catch (error) {
        console.error("Error in getFavoriteBooksByUser:", error);
    }
    return [];
}

export async function addFavoriteBook(idUser, idBook) {
    const endpoint = `${endpointBE}/favorites`;
    const token = localStorage.getItem('token');
    try {
        const response = await my_request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-User-Id': idUser
            },
            body: JSON.stringify({
                bookId: idBook
            })
        });
        return response;
    } catch (error) {
        console.error("Error in addFavoriteBook:", error);
    }
    return null;
}

export async function removeFavoriteBook(idUser, idBook) {
    const endpoint = `${endpointBE}/favorites/${idBook}/user/${idUser}`;
    const token = localStorage.getItem('token');
    try {
        const response = await my_request(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Error in removeFavoriteBook:", error);
    }
    return null;
}
