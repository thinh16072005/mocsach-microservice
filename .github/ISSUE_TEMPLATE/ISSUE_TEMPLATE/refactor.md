---
name: "♻️ Refactor / Tech Debt"
about: Cải thiện code hiện có mà không thay đổi hành vi
labels: refactor, tech-debt
assignees: ''
---

## Vấn đề hiện tại
<!-- Code nào cần cải thiện? Tại sao? (quá dài, magic number, duplicate code, ...) -->

## Class / File cần refactor
<!-- Ví dụ: BookService.java — method placeOrder() quá 50 dòng -->

## Hướng cải thiện đề xuất
- [ ] Tách phương thức dài thành các hàm nhỏ hơn
- [ ] Thay magic number bằng hằng số có tên
- [ ] Đổi field injection → constructor injection
- [ ] Xóa dead code / unused variable
- [ ] Cải thiện tên biến / phương thức
- [ ] Khác: ___

## Rủi ro
<!-- Refactor có thể ảnh hưởng đến gì? Cần chú ý điều gì? -->

## Tiêu chí hoàn thành
- [ ] Tất cả test hiện có vẫn pass sau refactor
- [ ] Checkstyle violations giảm (không tăng)
- [ ] Coverage không giảm

## Estimate (giờ)

## Assigned to
