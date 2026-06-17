import { endpointBE } from "../layout/utils/Constant";
import FeedbackModel from "../model/FeedbackModel";
import { getIdUserByToken } from "../layout/utils/JwtService";

export async function getAllFeedback() {
    const token = localStorage.getItem("token");
    const response = await fetch(endpointBE + "/feedbacks?page=0&size=100", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách feedback: " + response.statusText);
    }
    const responseData = await response.json();
    if (responseData && responseData.success && responseData.data) {
        return (responseData.data.content || []).map((feedback) => {
            const fb = new FeedbackModel();
            fb.idFeedback = feedback.idFeedback;
            fb.comment = feedback.content;
            fb.dateCreated = feedback.createdAt;
            fb.readed = feedback.read;
            fb.username = "User_" + feedback.userId;
            return fb;
        });
    }
    return [];
}

export async function getTotalNumberOfFeedbacks() {
    try {
        const token = localStorage.getItem("token");
        const endpoint = endpointBE + "/feedbacks?size=1";
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const responseData = await response.json();
        if (responseData && responseData.success && responseData.data) {
            return responseData.data.totalElements || 0;
        }
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
    }
    return 0;
}

export async function getUnreadFeedbackCount() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return 0;
        }
        const response = await fetch(endpointBE + "/feedbacks/unread-count", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const responseData = await response.json();
            if (responseData && responseData.success) {
                return responseData.data || 0;
            }
        }
    } catch (error) {
        console.error("Error fetching unread feedback count:", error);
    }
    return 0;
}

export async function getUnreadFeedbacks() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return [];
        const response = await fetch(endpointBE + "/feedbacks?page=0&size=100", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const responseData = await response.json();
        if (responseData && responseData.success && responseData.data) {
            return (responseData.data.content || [])
                .filter(feedback => !feedback.read)
                .map((feedback) => {
                    const fb = new FeedbackModel();
                    fb.idFeedback = feedback.idFeedback;
                    fb.comment = feedback.content;
                    fb.dateCreated = feedback.createdAt;
                    fb.readed = feedback.read;
                    fb.username = "User_" + feedback.userId;
                    return fb;
                });
        }
    } catch (e) {
        console.error("Error getUnreadFeedbacks:", e);
    }
    return [];
}

export async function markFeedbackAsRead(idFeedback) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(endpointBE + `/feedbacks/${idFeedback}/read`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.ok;
    } catch (error) {
        console.error("Error marking feedback as read:", error);
        return false;
    }
}

export async function deleteFeedback(idFeedback) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(endpointBE + `/feedbacks/${idFeedback}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return false;
    }
}

export async function addFeedback(content) {
    try {
        const token = localStorage.getItem("token");
        const userId = getIdUserByToken();
        const response = await fetch(endpointBE + "/feedbacks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-User-Id": userId
            },
            body: JSON.stringify({ content })
        });
        return response.ok;
    } catch (error) {
        console.error("Error adding feedback:", error);
        return false;
    }
}
