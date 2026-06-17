import { endpointBE } from "../layout/utils/Constant";
import UserModel from "../model/UserModel";
import { my_request } from "./Request";

async function getUser(endPoint) {
    const token = localStorage.getItem("token");
    const response = await my_request(endPoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const responseData = response.data || (response._embedded ? response._embedded.users : response) || [];
    const userList = responseData.map((user) => {
        return new UserModel(
            user.idUser,
            user.dateOfBirth,
            user.deliveryAddress,
            user.email,
            user.firstName,
            user.lastName,
            user.gender,
            user.password,
            user.phoneNumber,
            user.username,
            user.avatar,
            user.enabled
        );
    });
    return userList;
}

// Hàm lấy user theo id review
export async function getUserByIdReview(idReview) {
    const endPoint = endpointBE + `/reviews/${idReview}/user`;
    const token = localStorage.getItem("token");
    const response = await my_request(endPoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = response.data || response;

    const user = new UserModel(
        data.idUser,
        data.dateOfBirth,
        data.deliveryAddress,
        data.email,
        data.firstName,
        data.lastName,
        data.gender,
        data.password,
        data.phoneNumber,
        data.username,
        data.avatar,
        data.enabled
    );
    return user;
}

// Hàm lấy 1 user theo id
export async function get1User(idUser) {
    const endPoint = endpointBE + `/users/${idUser}`;
    const token = localStorage.getItem("token");
    const response = await my_request(endPoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = response.data || response;

    const user = new UserModel(
        data.idUser,
        data.dateOfBirth,
        data.deliveryAddress,
        data.email,
        data.firstName,
        data.lastName,
        data.gender,
        data.password,
        data.phoneNumber,
        data.username,
        data.avatar,
        data.enabled
    );
    return user;
}

// Hàm upload avatar
export async function changeAvatar(idUser, avatarBase64) {
    const endpoint = endpointBE + `/users/${idUser}/avatar`;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                avatar: avatarBase64,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.notification || "Upload avatar thất bại");
        }

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
        }

        return data.token || "";
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
}
