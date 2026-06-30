package com.bookstore.book.controller;

import com.bookstore.book.dto.request.CreateBookRequest;
import com.bookstore.book.entity.Book;
import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.book.dto.response.BookListResponse;
import com.bookstore.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookListResponse>>> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idBook") String sort) {
        return ResponseEntity.ok(bookService.getBooks(page, size, sort));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<ApiResponse<List<BookListResponse>>> getBestsellers(
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(bookService.getBestsellers(size));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<BookListResponse>>> searchBooks(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer genreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookService.searchBooks(name, genreId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBookById(@PathVariable int id) {
        ApiResponse<Book> response = bookService.getBookById(id);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Book>> createBook(
            @RequestPart("data") CreateBookRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        ApiResponse<Book> response = bookService.createBook(request, images);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<Void>> updateStock(
            @PathVariable int id,
            @RequestBody Map<String, Integer> request) {
        return ResponseEntity.ok(bookService.updateStock(id, request));
    }
}
