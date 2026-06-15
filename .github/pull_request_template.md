## Mô tả thay đổi

<!-- Tóm tắt ngắn gọn PR này làm gì. Ví dụ: "Thêm class BankAccount với deposit/withdraw" -->

**Loại thay đổi:**
- [ ] ✨ Tính năng mới (`feat`)
- [ ] 🐛 Sửa lỗi (`fix`)
- [ ] 🧪 Thêm / sửa test (`test`)
- [ ] ♻️ Refactor (không thay đổi logic)
- [ ] 📝 Tài liệu (README, CHANGELOG, AI log...)
- [ ] 🔧 Cấu hình (pom.xml, CI, ...)

---

## Checklist trước khi merge

### Code
- [ ] Code biên dịch không có lỗi (`mvn compile`)
- [ ] Tất cả test hiện có vẫn pass (`mvn test`)
- [ ] Đã viết test cho tính năng / fix mới
- [ ] Coverage không giảm so với nhánh `main`
- [ ] Không có `System.out.println()` trong code production

### Tài liệu
- [ ] `CHANGELOG.md` đã cập nhật mục tương ứng
- [ ] Nếu có dùng AI → `AI_AUDIT_LOG.md` đã cập nhật
- [ ] Nếu có dùng AI → `PROMPTS.md` đã thêm prompt tương ứng

---

## Test đã viết / cập nhật

<!-- Liệt kê tên test method hoặc test class liên quan đến PR này -->

| Test | Mô tả | Kết quả |
|------|-------|---------|
| `testMethodName` | Kiểm tra ... | ✅ Pass |

---

## Sử dụng AI *(bỏ qua nếu không dùng)*

- [ ] PR này **không** dùng AI
- [ ] PR này **có** dùng AI — đã cập nhật `AI_AUDIT_LOG.md` và `PROMPTS.md`

**Tóm tắt nhanh** *(nếu có dùng)*:

| Công cụ | Mục đích | File | Mức hỗ trợ |
|---------|----------|------|-----------|
| | | | Low / Medium / High |

---

## Screenshots / Output *(nếu có)*

<!-- Dán screenshot terminal, test output, hoặc kết quả CI tại đây nếu cần minh họa -->
