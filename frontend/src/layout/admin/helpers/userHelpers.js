import { endpointBE } from "../../utils/Constant";
import { my_request } from "../../../api/Request";
import UserModel from "../../../model/UserModel";


// Hàm lấy danh sách user có phân trang từ /users bằng cách phân trang tại frontend
export async function getUsers(page = 0, size = 10, sort = "idUser,asc") {
    const url = `${endpointBE}/users`;
    const token = localStorage.getItem("token") || "";
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const data = await my_request(url, { headers });
    const responseData = data.data || [];

    const allItems = responseData.map((u) => new UserModel(
        u.idUser,
        u.dateOfBirth,
        u.deliveryAddress,
        u.email,
        u.firstName,
        u.lastName,
        u.gender,
        u.password,
        u.phoneNumber,
        u.username,
        u.avatar,
        u.enabled
    ));

    // Thực hiện sắp xếp trên Client Side để tương thích hoàn toàn
    const [sortField, sortDir] = sort.split(",");
    allItems.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const totalElements = allItems.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const start = page * size;
    const items = allItems.slice(start, start + size);

    return {
        items,
        page: {
            number: page,
            size,
            totalElements,
            totalPages
        }
    };
}


