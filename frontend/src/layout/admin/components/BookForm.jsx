import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { endpointBE } from "../../utils/Constant";
import { getAllGenres } from "../../../api/GenreApi";
import { getGenreByIdBook } from "../../../api/GenreApi";
import { getBookById } from "../../../api/BookApi";
import { getAllImageByBook } from "../../../api/ImageApi";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

export const BookForm = (props) => {
    const [book, setBook] = useState({
        idBook: 0,
        nameBook: "",
        author: "",
        description: "",
        listPrice: 0,
        sellPrice: 0,
        quantity: 0,
        avgRating: 0,
        soldQuantity: 0,
        discountPercent: 0,
    });

    const [statusBtn, setStatusBtn] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [existingImages, setExistingImages] = useState([]);
    const [removedImageIds, setRemovedImageIds] = useState([]);

    const [genres, setGenres] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState([]);

    //Load danh sách thể loại khi component mount
    useEffect(() => {
        loadGenres();
    }, []);

    //Hàm load danh sách thể loại
    const loadGenres = async () => {
        try {
            const genreList = await getAllGenres();
            setGenres(genreList);
            console.log("Loaded genres:", genreList);
        } catch (error) {
            console.error("Error loading genres:", error);
            toast.error("Không thể tải danh sách thể loại!");
        }
    };


    // Load dữ liệu khi mở form
    useEffect(() => {
        if (props.bookData && props.open) {
            // Mode UPDATE - Load dữ liệu sách
            console.log("Loading book data:", props.bookData);
            setBook({
                idBook: props.bookData.idBook,
                nameBook: props.bookData.nameBook || "",
                author: props.bookData.author || "",
                description: props.bookData.description || "",
                listPrice: props.bookData.listPrice || 0,
                sellPrice: props.bookData.sellPrice || 0,
                quantity: props.bookData.quantity || 0,
                avgRating: props.bookData.avgRating || 0,
                soldQuantity: props.bookData.soldQuantity || 0,
                discountPercent: props.bookData.discountPercent || 0,
            });
            // Load ảnh hiện tại
            loadExistingImages(props.bookData.idBook);

            // Load thể loại hiện tại
            loadBookGenre(props.bookData.idBook);
            
            setSelectedImages([]);
            setPreviewImages([]);
            setRemovedImageIds([]);
        } else if (!props.bookData && props.open) {
            // Mode CREATE - Làm mới form
            setBook({
                idBook: 0,
                nameBook: "",
                author: "",
                description: "",
                listPrice: 0,
                sellPrice: 0,
                quantity: 0,
                avgRating: 0,
                soldQuantity: 0,
                discountPercent: 0,
            });
            setSelectedImages([]);
            setPreviewImages([]);
            setSelectedGenreIds([]);
        }
    }, [props.bookData, props.open]);

    // Load thể loại của sách - cập nhật để load nhiều thể loại
    const loadBookGenre = async (bookId) => {
        try {
            const genreList = await getGenreByIdBook(bookId);
            if (genreList.length > 0) {
                const genreIds = genreList.map(genre => genre.idGenre);
                setSelectedGenreIds(genreIds);
                console.log("Loaded book genre IDs:", genreIds);
            } else {
                setSelectedGenreIds([]);
            }
        } catch (error) {
            console.error("Error loading book genre:", error);
            setSelectedGenreIds([]);
        }
    };

    // Load ảnh hiện tại của sách
    const loadExistingImages = async (bookId) => {
        try {
            const images = await getAllImageByBook(bookId);
            setExistingImages(images);
        } catch (error) {
            console.error("Lỗi khi load ảnh:", error);
            setExistingImages([]);
        }
    };

    // Xóa ảnh hiện tại
    const removeExistingImage = (imageId) => {
        setRemovedImageIds(prev => [...prev, imageId]);
        setExistingImages(prev => prev.filter(img => img.idImage !== imageId));
        toast.info("Đã xóa ảnh");
    };


    // Tính giá bán tự động
    useEffect(() => {
        if (book.listPrice && book.listPrice > 0) {
            const discount = book.discountPercent || 0;
            const calculatedSellPrice = book.listPrice - Math.round((book.listPrice * discount) / 100);
            
            if (calculatedSellPrice !== book.sellPrice) {
                setBook((prevBook) => ({
                    ...prevBook,
                    sellPrice: calculatedSellPrice,
                }));
            }
        }
    }, [book.listPrice, book.discountPercent]);

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length > 5) {
            toast.warning("Chỉ được chọn tối đa 5 ảnh!");
            e.target.value = "";
            return;
        }

        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                toast.warning(`File ${file.name} vượt quá 10MB!`);
                return false;
            }
            return true;
        });

        setSelectedImages(validFiles);

        // Tạo preview
        const previews = validFiles.map(file => URL.createObjectURL(file));
        
        // Xóa các URL cũ để tránh rò rỉ bộ nhớ
        previewImages.forEach(url => URL.revokeObjectURL(url));
        setPreviewImages(previews);
    };

    // Xóa ảnh mới
    const removeNewImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = previewImages.filter((_, i) => i !== index);
        URL.revokeObjectURL(previewImages[index]);
        setSelectedImages(newImages);
        setPreviewImages(newPreviews);
    };

    // Xử lý chọn/bỏ chọn thể loại
    const handleGenreToggle = (genreId) => {
        setSelectedGenreIds(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    };

    async function handleSubmit(event) {
        event.preventDefault();

        // Validation
        if (!book.nameBook || book.nameBook.trim() === "") {
            toast.error("Tên sách không được để trống!");
            return;
        }

        if (!book.author || book.author.trim() === "") {
            toast.error("Tên tác giả không được để trống!");
            return;
        }

        if (!book.listPrice || book.listPrice <= 0) {
            toast.error("Giá niêm yết phải lớn hơn 0!");
            return;
        }

        if (book.quantity === undefined || book.quantity < 0) {
            toast.error("Số lượng không được âm!");
            return;
        }

        // Validation cho thể loại
        if (!selectedGenreIds || selectedGenreIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một thể loại cho sách!");
            return;
        }

        // Kiểm tra ảnh khi THÊM MỚI
        if (!book.idBook && selectedImages.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 ảnh cho sách!");
            return;
        }

        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
            toast.error("Vui lòng đăng nhập lại!");
            return;
        }

        setStatusBtn(true);


        try {
            if (book.idBook) {
                // ============ MODE UPDATE ============
                const queryParams = new URLSearchParams();
                existingImages.forEach(img => {
                    queryParams.append("keepImageIds", img.idImage.toString());
                });

                const formData = new FormData();
                formData.append("data", new Blob([JSON.stringify({
                    nameBook: book.nameBook,
                    author: book.author,
                    description: book.description || "",
                    listPrice: book.listPrice,
                    quantity: book.quantity,
                    discountPercent: book.discountPercent || 0,
                    genreIds: selectedGenreIds
                })], { type: "application/json" }));

                selectedImages.forEach(file => {
                    formData.append("newImages", file);
                });

                const response = await fetch(`${endpointBE}/books/${book.idBook}?${queryParams.toString()}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Lỗi khi cập nhật sách");
                }

                toast.success("Cập nhật sách thành công!");
                
            } else {
                // ============ MODE CREATE ============
                const formData = new FormData();
                formData.append("data", new Blob([JSON.stringify({
                    nameBook: book.nameBook,
                    author: book.author,
                    description: book.description || "",
                    listPrice: book.listPrice,
                    quantity: book.quantity,
                    discountPercent: book.discountPercent || 0,
                    genreIds: selectedGenreIds
                })], { type: "application/json" }));

                selectedImages.forEach(file => {
                    formData.append("images", file);
                });

                const response = await fetch(`${endpointBE}/books`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("Phiên đăng nhập đã hết hạn!");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                        return;
                    }

                    const errorText = await response.text();
                    throw new Error(errorText || "Lỗi khi thêm sách");
                }

                toast.success("Thêm sách mới thành công!");
            }

            // Reset
            setBook({
                idBook: 0,
                nameBook: "",
                author: "",
                description: "",
                listPrice: 0,
                sellPrice: 0,
                quantity: 0,
                avgRating: 0,
                soldQuantity: 0,
                discountPercent: 0,
            });
            setExistingImages([]);
            setSelectedImages([]);
            setPreviewImages([]);
            setRemovedImageIds([]);
            setSelectedGenreIds([]);
 
            props.onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Đã xảy ra lỗi!");
        } finally {
            setStatusBtn(false);
        }
    }

    // Đóng dialog
    const handleClose = () => {
        if (!statusBtn) {
            // Clear preview URLs
            previewImages.forEach(url => URL.revokeObjectURL(url));
            props.onClose();
        }
    };

    if (!props.open) return null;

    const isCreateMode = !book.idBook;

    return (
        <div className="modal fade show" style={{ display: "block" }} onClick={handleClose}>
            <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <Typography className="modal-title" variant="h5" component="h2">
                            {isCreateMode ? "THÊM SÁCH MỚI" : "CẬP NHẬT THÔNG TIN SÁCH"}
                        </Typography>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleClose}
                            disabled={statusBtn}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="container px-3">
                            <form onSubmit={handleSubmit} className="form">
                                <input type="hidden" value={book?.idBook} />
                                
                                <div className="row">
                                    {/* Cột trái */}
                                    <div className="col-md-6">
                                        <Box sx={{ "& .MuiTextField-root": { mb: 3 } }}>
                                            <TextField
                                                required
                                                label="Tên sách"
                                                style={{ width: "100%" }}
                                                value={book.nameBook}
                                                onChange={(e) =>
                                                    setBook({ ...book, nameBook: e.target.value })
                                                }
                                                size="small"
                                            />

                                            <TextField
                                                required
                                                label="Tên tác giả"
                                                style={{ width: "100%" }}
                                                value={book.author}
                                                onChange={(e) =>
                                                    setBook({ ...book, author: e.target.value })
                                                }
                                                size="small"
                                            />

                                            <TextField
                                                required
                                                label="Giá niêm yết (đ)"
                                                style={{ width: "100%" }}
                                                type="number"
                                                value={book.listPrice || ""}
                                                onChange={(e) =>
                                                    setBook({
                                                        ...book,
                                                        listPrice: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                size="small"
                                                inputProps={{ min: 0 }}
                                            />

                                            <TextField
                                                label="% Giảm giá"
                                                style={{ width: "100%" }}
                                                type="number"
                                                value={book.discountPercent || ""}
                                                onChange={(e) => {
                                                    const discount = parseInt(e.target.value) || 0;
                                                    setBook({
                                                        ...book,
                                                        discountPercent: discount,
                                                    });
                                                }}
                                                size="small"
                                                inputProps={{ min: 0, max: 100 }}
                                            />
                                        </Box>
                                    </div>

                                    {/* Cột phải */}
                                    <div className="col-md-6">
                                        <Box sx={{ "& .MuiTextField-root": { mb: 3 } }}>
                                            <TextField
                                                label="Giá bán (đ)"
                                                style={{ width: "100%" }}
                                                type="number"
                                                value={book.sellPrice || ""}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                size="small"
                                                sx={{
                                                    "& .MuiInputBase-input": {
                                                        bgcolor: "#f5f5f5",
                                                        fontWeight: "bold",
                                                        color: "#d32f2f",
                                                    },
                                                }}
                                            />

                                            <TextField
                                                required
                                                label="Số lượng trong kho"
                                                style={{ width: "100%" }}
                                                type="number"
                                                value={book.quantity || ""}
                                                onChange={(e) =>
                                                    setBook({
                                                        ...book,
                                                        quantity: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                size="small"
                                                inputProps={{ min: 0 }}
                                            />

                                            {!isCreateMode && (
                                                <TextField
                                                    label="Đã bán"
                                                    style={{ width: "100%" }}
                                                    type="number"
                                                    value={book.soldQuantity || 0}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    size="small"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            bgcolor: "#f5f5f5",
                                                        },
                                                    }}
                                                />
                                            )}

                                            <TextField
                                                label="Mô tả sách"
                                                style={{ width: "100%" }}
                                                multiline
                                                rows={isCreateMode ? 6 : 4}
                                                value={book.description || ""}
                                                onChange={(e) =>
                                                    setBook({ ...book, description: e.target.value })
                                                }
                                                placeholder="Nhập mô tả về nội dung, tác giả, nhà xuất bản..."
                                            />
                                        </Box>
                                    </div>

                                    <div className="col-12">
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                                                Thể loại sách <span className="text-danger">*</span>
                                            </Typography>
                                            
                                            {selectedGenreIds.length === 0 && (
                                                <small className="text-danger d-block mb-2">
                                                    Vui lòng chọn ít nhất một thể loại cho sách
                                                </small>
                                            )}

                                            {/* Hiển thị các thể loại đã chọn */}
                                            {selectedGenreIds.length > 0 && (
                                                <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                    {selectedGenreIds.map(genreId => {
                                                        const genre = genres.find(g => g.idGenre === genreId);
                                                        return genre ? (
                                                            <Chip
                                                                key={genreId}
                                                                label={genre.nameGenre}
                                                                onDelete={() => handleGenreToggle(genreId)}
                                                                color="primary"
                                                                variant="outlined"
                                                                disabled={statusBtn}
                                                            />
                                                        ) : null;
                                                    })}
                                                </Box>
                                            )}

                                            {/* Danh sách checkbox để chọn thể loại */}
                                            <Paper 
                                                variant="outlined" 
                                                sx={{ 
                                                    p: 2, 
                                                    maxHeight: 200, 
                                                    overflowY: "auto",
                                                    bgcolor: "#f9f9f9"
                                                }}
                                            >
                                                {genres.length === 0 ? (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Đang tải danh sách thể loại...
                                                    </Typography>
                                                ) : (
                                                    genres.map((genre) => (
                                                        <FormControlLabel
                                                            key={genre.idGenre}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedGenreIds.includes(genre.idGenre)}
                                                                    onChange={() => handleGenreToggle(genre.idGenre)}
                                                                    disabled={statusBtn}
                                                                    size="small"
                                                                />
                                                            }
                                                            label={genre.nameGenre}
                                                            sx={{ 
                                                                display: "block",
                                                                mb: 0.5,
                                                                "&:hover": {
                                                                    bgcolor: "#f0f0f0",
                                                                    borderRadius: 1
                                                                }
                                                            }}
                                                        />
                                                    ))
                                                )}
                                            </Paper>
                                            
                                            <small className="text-muted d-block mt-2">
                                                ✓ Có thể chọn nhiều thể loại cho một cuốn sách
                                            </small>
                                        </Box>
                                    </div>            

                                    {/* Phần quản lý hình ảnh sách */}
                                    <div className="col-12">
                                        <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                                Quản lý hình ảnh sách
                                            </Typography>

                                            {/* Hiển thị ảnh hiện tại (khi UPDATE) */}
                                            {!isCreateMode && (
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
                                                        Ảnh hiện tại ({existingImages.length}):
                                                    </Typography>
                                                    
                                                    {existingImages.length === 0 ? (
                                                        <div className="alert alert-warning">
                                                            Sách chưa có ảnh. Vui lòng thêm ảnh mới bên dưới.
                                                        </div>
                                                    ) : (
                                                        <div className="row g-2">
                                                            {existingImages.map((image, index) => (
                                                                <div key={image.idImage} className="col-md-2 col-4">
                                                                    <div className="position-relative">
                                                                        <img
                                                                            src={image.urlImage}
                                                                            alt={image.nameImage || `Image ${index + 1}`}
                                                                            className="img-thumbnail"
                                                                            style={{ 
                                                                                width: "100%", 
                                                                                height: "140px", 
                                                                                objectFit: "cover",
                                                                                border: "3px solid #2196f3"
                                                                            }}
                                                                            onError={(e) => {
                                                                                console.error("Image load error:", image.urlImage);
                                                                                e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
                                                                            }}
                                                                        />
                                                                        {image.thumbnail && (
                                                                            <span className="badge bg-primary position-absolute top-0 start-0 m-1">
                                                                                Ảnh đại diện
                                                                            </span>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                                                            onClick={() => removeExistingImage(image.idImage)}
                                                                            disabled={statusBtn}
                                                                            style={{ padding: "4px 10px", fontSize: "14px", fontWeight: "bold" }}
                                                                            title="Xóa ảnh này"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                        <span className="badge bg-dark position-absolute bottom-0 start-0 m-1">
                                                                            ID: {image.idImage}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Box>
                                            )}

                                            {/* Upload ảnh mới */}
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                                                    {isCreateMode ? "Chọn ảnh cho sách:" : "Thêm ảnh mới:"}
                                                </Typography>
                                                <label 
                                                    style={{ 
                                                        display: "flex", 
                                                        flexDirection: "column", 
                                                        alignItems: "center", 
                                                        justifyContent: "center", 
                                                        padding: "24px", 
                                                        border: "2px dashed #CBD5E1", 
                                                        borderRadius: "10px", 
                                                        background: "#fff", 
                                                        cursor: "pointer", 
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#2C7B8F"; e.currentTarget.style.background = "#F8FAFC"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.background = "#fff"; }}
                                                >
                                                    <CloudUploadIcon sx={{ fontSize: 40, color: "#64748B", mb: 1 }} />
                                                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>Kéo thả hoặc nhấp để chọn ảnh</span>
                                                    <span style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Hỗ trợ JPG, PNG, WEBP lên đến 10MB</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageChange}
                                                        disabled={statusBtn}
                                                        style={{ display: "none" }}
                                                    />
                                                </label>
                                                <small className="text-muted d-block mt-2">
                                                    ✓ Tối đa 5 ảnh | ✓ Mỗi ảnh {'<'} 10MB | ✓ Định dạng: JPG, PNG, WEBP
                                                    {!isCreateMode && ` | ✓ Tổng ảnh hiện tại: ${existingImages.length + selectedImages.length}/5`}
                                                </small>
                                            </Box>

                                            {/* Preview ảnh mới */}
                                            {previewImages.length > 0 && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 2, color: "#388e3c", fontWeight: "bold" }}>
                                                        Ảnh mới sẽ thêm ({previewImages.length}):
                                                    </Typography>
                                                    <div className="row g-2">
                                                        {previewImages.map((preview, index) => (
                                                            <div key={index} className="col-md-2 col-4">
                                                                <div className="position-relative">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="img-thumbnail"
                                                                        style={{ 
                                                                            width: "100%", 
                                                                            height: "140px", 
                                                                            objectFit: "cover",
                                                                            border: "3px dashed #4caf50"
                                                                        }}
                                                                    />
                                                                    {existingImages.length === 0 && index === 0 && (
                                                                        <span className="badge bg-success position-absolute top-0 start-0 m-1">
                                                                            Ảnh đại diện mới
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                                                        onClick={() => removeNewImage(index)}
                                                                        disabled={statusBtn}
                                                                        style={{ padding: "4px 10px", fontSize: "14px" }}
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                    <span className="badge bg-success position-absolute bottom-0 start-0 m-1">
                                                                        Mới {index + 1}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Box>
                                            )}
                                        </Box>
                                    </div>
                                    {/* END PHẦN HIỂN THỊ ẢNH */}
                                </div>

                                <div className="modal-footer">
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose}
                                        disabled={statusBtn}
                                    >
                                        Hủy
                                    </Button>
                                    <LoadingButton
                                        type="submit"
                                        loading={statusBtn}
                                        variant="contained"
                                        sx={{ minWidth: 120 }}
                                        loadingIndicator={isCreateMode ? "Đang thêm..." : "Đang cập nhật..."}
                                    >
                                        {isCreateMode ? "Thêm mới" : "Cập nhật"}
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
