---
name: "🧪 Test Task"
about: Nhiệm vụ viết hoặc cải thiện unit test
labels: test, in-progress
assignees: ''
---

## Class / Method cần test
<!-- Ví dụ: AccountService.transfer(), BankAccount.withdraw() -->

## Test cases cần viết
<!-- Liệt kê từng test case cần có — dùng định dạng: [input] → [expected output] -->

| # | Test case | Input | Expected |
|---|-----------|-------|----------|
| 1 | Happy path | | |
| 2 | Edge case: giá trị biên | | |
| 3 | Exception case | | |
| 4 | | | |

## Kỹ thuật kiểm thử áp dụng
- [ ] Equivalence Partitioning (EP)
- [ ] Boundary Value Analysis (BVA)
- [ ] Statement Coverage
- [ ] Branch / Decision Coverage
- [ ] Exception testing
- [ ] Mock / Stub (Mockito)

## Tiêu chí hoàn thành
- [ ] Tất cả test case trong bảng đã có method tương ứng
- [ ] Tất cả test pass (`mvn test`)
- [ ] Line coverage cho class này ≥ 80%
- [ ] Test đặt tên rõ ràng theo convention `methodName_condition_expectedResult`

## Estimate (giờ)

## Assigned to
<!-- Tag thành viên nhận việc: @username -->
