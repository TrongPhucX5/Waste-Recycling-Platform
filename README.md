# Crowdsourced Waste Collection & Recycling Platform

## Tổng quan dự án

Nền tảng kết nối người dân, doanh nghiệp tái chế và dịch vụ thu gom rác theo khu vực. Hỗ trợ báo cáo rác, phân loại tại nguồn, điều phối thu gom, quản lý điểm thưởng và giám sát toàn bộ quy trình. Dự án gồm hai phần: Web (React) cho quản trị, doanh nghiệp, thu gom và Mobile (Flutter) cho người dân, thu gom.

## Mô tả dự án

Nền tảng kết nối người dân, doanh nghiệp tái chế và dịch vụ thu gom rác theo khu vực. Hỗ trợ báo cáo rác, phân loại tại nguồn, điều phối thu gom, quản lý điểm thưởng và giám sát toàn bộ quy trình.

## Bối cảnh & Vấn đề

- Quản lý rác thải đô thị tại Việt Nam gặp nhiều khó khăn: lịch thu gom không ổn định, phân loại thấp, phối hợp rời rạc.
- Quy định bắt buộc phân loại rác tại nguồn từ 2025 tạo nhu cầu cấp thiết về nền tảng số hóa hỗ trợ kết nối, điều phối, giám sát minh bạch.

## Đối tượng sử dụng

- **Citizen (Người dân):** Báo cáo rác, theo dõi trạng thái, phân loại, nhận điểm thưởng, khiếu nại.
- **Recycling Enterprise (Doanh nghiệp tái chế):** Quản lý năng lực, tiếp nhận/gán yêu cầu, báo cáo, cấu hình điểm thưởng.
- **Collector (Đơn vị thu gom):** Nhận/gửi trạng thái, xác nhận hoàn thành, xem lịch sử công việc.
- **Administrator (Quản trị viên):** Quản lý tài khoản, giám sát hệ thống, giải quyết tranh chấp.

## Cấu trúc thư mục tổng

```
Waste-Recycling-Platform/
├── web-admin/
│   ├── src/
│   │   ├── services/           # Kết nối Firebase, Cloudinary
│   │   └── features/
│   │       ├── citizen/        # Chức năng cho người dân (web)
│   │       ├── enterprise/     # Chức năng cho doanh nghiệp tái chế
│   │       ├── collector/      # Chức năng cho đơn vị thu gom
│   │       ├── admin/          # Chức năng cho quản trị viên
│   │       └── task_board/     # Quản lý bảng phân công việc
│   └── ...
├── mobile_app/
│   ├── lib/
│   │   ├── services/           # Kết nối Firebase, Cloudinary (mobile)
│   │   └── features/
│   │       └── waste_report/   # Chức năng báo cáo rác, điểm thưởng, lịch sử (mobile)
│   │           ├── models/
│   │           ├── viewmodels/
│   │           └── views/
│   │               └── widgets/
│   └── ...
└── ...
```

## Tích hợp Firebase & Cloudinary

- **Firebase:** Quản lý dữ liệu báo cáo, trạng thái thu gom, điểm thưởng, tài khoản...
  - Web: cấu hình tại `web-admin/src/services/firebaseConfig.js`
  - Mobile: cấu hình tự động bằng `firebase_options.dart` và gọi trong `main.dart`
- **Cloudinary:** Upload ảnh báo cáo, xác nhận thu gom...
  - Web: hàm upload tại `web-admin/src/services/cloudinaryService.js`
  - Mobile: hàm upload tại `mobile_app/lib/services/cloudinary_service.dart`

## Luồng hoạt động mẫu

1. Citizen gửi báo cáo rác (ảnh, GPS, mô tả, loại rác) qua app mobile hoặc web.
2. Ảnh được upload lên Cloudinary, thông tin lưu vào Firebase.
3. Enterprise nhận/gán yêu cầu cho Collector (web).
4. Collector cập nhật trạng thái, xác nhận hoàn thành bằng ảnh (web/mobile).
5. Admin giám sát, xử lý tranh chấp nếu có (web).

## Hướng dẫn phát triển

- Web: Code logic trong hooks (use...js), giao diện trong components (jsx), container ghép lại ở index.jsx.
- Mobile: Code logic trong viewmodels, giao diện trong views, models cho dữ liệu.
- Khi cần gọi Firebase:
  - Web: import từ `src/services/firebaseConfig.js`
  - Mobile: dùng `Firebase.initializeApp` với `firebase_options.dart`
- Khi cần upload ảnh:
  - Web: dùng hàm từ `src/services/cloudinaryService.js`
  - Mobile: dùng hàm từ `lib/services/cloudinary_service.dart`

## Bảo mật

- Luôn cấu hình Firestore Rules chỉ cho phép người dùng đã đăng nhập thao tác dữ liệu.

## Ghi chú

- Có thể mở rộng thêm AI phân loại rác từ ảnh (tùy chọn).
- Nếu cần thêm tính năng, tạo thêm thư mục feature tương ứng cho web hoặc mobile.

---

Nếu cần hướng dẫn chi tiết về từng actor hoặc tích hợp Firebase/Cloudinary, xem các file mẫu trong từng thư mục hoặc liên hệ Lead dự án.
