package com.bookstore.common.dto.shared;

import lombok.Data;
import java.util.List;

@Data
public class BookDTO {
    private int idBook;
    private String nameBook;
    private String author;
    private double listPrice;
    private double sellPrice;
    private int quantity;
    private double avgRating;
    private int soldQuantity;
    private int discountPercent;
    private List<ImageDTO> images;

    @Data
    public static class ImageDTO {
        private int idImage;
        private String nameImage;
        private String urlImage;
        private boolean thumbnail;
    }
}
