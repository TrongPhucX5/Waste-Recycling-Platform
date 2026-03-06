import 'package:flutter/material.dart';
import '../../services/cloudinary_service.dart';
// import các hàm Firebase ở đây

class ReportViewModel extends ChangeNotifier {
  bool isLoading = false;

  Future<void> submitReport(/* các tham số cần thiết */) async {
    isLoading = true;
    notifyListeners();
    // Xử lý upload ảnh lên Cloudinary, lưu dữ liệu vào Firebase
    // ...
    isLoading = false;
    notifyListeners();
  }
}
