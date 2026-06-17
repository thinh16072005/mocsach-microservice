package com.bookstore.book.controller;

import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.book.dto.response.BookListResponse;
import com.bookstore.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
