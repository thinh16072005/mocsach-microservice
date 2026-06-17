import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IconButton, 
    Badge, 
    Tooltip, 
    Menu, 
    MenuItem, 
    Typography, 
    Box, 
    Divider,
    CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getUnreadFeedbackCount, getUnreadFeedbacks, markFeedbackAsRead } from '../../../api/FeedbackApi';
import { toast } from 'react-toastify';
import { endpointBE } from '../../utils/Constant';

const NotificationBell = () => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [unreadFeedbacks, setUnreadFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const menuOpen = Boolean(anchorEl);

    // Lấy số lượng feedback chưa đọc lần đầu
    useEffect(() => {
        getUnreadFeedbackCount()
            .then((count) => {
                setUnreadCount(count);
                setPreviousCount(count);
                setIsInitialized(true);
            })
            .catch((error) => {
                console.log("Lỗi lấy unread feedback count:", error);
                setIsInitialized(true);
            });
    }, []);

    // Polling để kiểm tra feedback mới
    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        const intervalId = setInterval(() => {
            getUnreadFeedbackCount()
                .then((count) => {
                    // Nếu có feedback mới, hiển thị thông báo
                    if (count > previousCount && previousCount >= 0) {
                        const newFeedbackCount = count - previousCount;
                        toast.info(
                            `Bạn có ${newFeedbackCount} ${newFeedbackCount === 1 ? 'đánh giá mới' : 'đánh giá mới'}!`,
                            {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            }
                        );
                    }
                    setUnreadCount(count);
                    setPreviousCount(count);
                })
                .catch((error) => {
                    console.log("Lỗi khi polling unread feedback count:", error);
                });
        }, 5000); // Polling mỗi 5 giây

        return () => {
            clearInterval(intervalId);
        };
    }, [isInitialized, previousCount]);

    // Lấy danh sách feedback chưa đọc khi mở menu
    const loadUnreadFeedbacks = async () => {
        setLoadingFeedbacks(true);
        try {
            console.log("=== NotificationBell: Loading unread feedbacks ===");
            // getUnreadFeedbacks() đã filter chỉ lấy feedback có isReaded === false
            const feedbacks = await getUnreadFeedbacks();
            console.log("NotificationBell: Received feedbacks count:", feedbacks.length);
            console.log("NotificationBell: Feedbacks data:", feedbacks);
            // Không cần filter lại vì API đã filter rồi
            setUnreadFeedbacks(feedbacks);
        } catch (error) {
            console.error("Lỗi khi tải feedback chưa đọc:", error);
            setUnreadFeedbacks([]);
        } finally {
            setLoadingFeedbacks(false);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        loadUnreadFeedbacks();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewAll = () => {
        handleClose();
        navigate('/admin/feedback');
    };

    const handleMarkAsRead = async (idFeedback) => {
        try {
            const success = await markFeedbackAsRead(idFeedback);

            if (success) {
                // Cập nhật lại danh sách và số lượng
                setUnreadFeedbacks(prev => prev.filter(f => f.idFeedback !== idFeedback));
                setUnreadCount(prev => Math.max(0, prev - 1));
                toast.success("Đã đánh dấu đã đọc");
            } else {
                toast.error("Lỗi khi đánh dấu đã đọc");
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu đã đọc:", error);
            toast.error("Lỗi khi đánh dấu đã đọc");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Tooltip title={unreadCount > 0 ? `${unreadCount} thông báo` : 'Thông báo'}>
                <IconButton
                    onClick={handleClick}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    <Badge 
                        badgeContent={unreadCount} 
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                            },
                            '@keyframes pulse': {
                                '0%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                                '50%': {
                                    transform: 'scale(1.1)',
                                    opacity: 0.8,
                                },
                                '100%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        <NotificationsIcon sx={{ fontSize: 28 }} />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 400,
                        maxHeight: 500,
                        mt: 1.5,
                    }
                }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        Phản hồi chưa đọc
                    </Typography>
                    {unreadCount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                            {unreadCount} {unreadCount === 1 ? 'phản hồi chưa đọc' : 'phản hồi chưa đọc'}
                        </Typography>
                    )}
                </Box>
                <Divider />

                

                {unreadFeedbacks.length > 0 && (
                    <>
                        <Divider />
                        <MenuItem onClick={handleViewAll} sx={{ justifyContent: 'center', py: 1.5 }}>
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                                Xem tất cả đánh giá
                            </Typography>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;


