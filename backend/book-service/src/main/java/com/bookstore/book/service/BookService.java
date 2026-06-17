package com.bookstore.book.service;

import com.bookstore.book.dto.response.BookListResponse;
import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.book.entity.Book;
import com.bookstore.book.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public ApiResponse<Page<BookListResponse>> getBooks(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        Page<Book> books = bookRepository.findAll(pageable);
        initImages(books.getContent());
        return ApiResponse.success("OK", books.map(BookListResponse::from));
    }

    @Transactional
    public ApiResponse<List<BookListResponse>> getBestsellers(int size) {
        int limit = Math.min(Math.max(size, 1), 20);
        Pageable pageable = PageRequest.of(0, limit,
                Sort.by(Sort.Order.desc("soldQuantity"), Sort.Order.desc("avgRating"), Sort.Order.desc("idBook")));
        List<Book> books = bookRepository.findAll(pageable).getContent();
        initImages(books);
        return ApiResponse.success("OK", books.stream().map(BookListResponse::from).toList());
    }

    public ApiResponse<Page<BookListResponse>> searchBooks(String name, Integer genreId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> result;
        if (name != null && !name.isBlank() && genreId != null) {
            result = bookRepository.findByNameBookContainingIgnoreCaseAndGenres_IdGenre(name, genreId, pageable);
        } else if (name != null && !name.isBlank()) {
            result = bookRepository.findByNameBookContainingIgnoreCase(name, pageable);
        } else if (genreId != null) {
            result = bookRepository.findByGenres_IdGenre(genreId, pageable);
        } else {
            result = bookRepository.findAll(pageable);
        }
        initImages(result.getContent());
        return ApiResponse.success("OK", result.map(BookListResponse::from));
    }

    // PRIVATE METHODS ----------------------------------

    private static void initImages(List<Book> books) {
        books.forEach(b -> {
            if (b.getImages() != null) {
                b.getImages().size();
            }
        });
    }

    private static Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "idBook");
        }
        String[] parts = sort.split(",");
        String field = parts[0].trim();
        boolean asc = parts.length > 1 && "asc".equalsIgnoreCase(parts[1].trim());
        return asc ? Sort.by(field).ascending() : Sort.by(field).descending();
    }
}
