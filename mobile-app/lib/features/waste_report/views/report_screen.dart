import 'package:flutter/material.dart';
import '../viewmodels/report_viewmodel.dart';

class ReportScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Lấy ViewModel bằng Provider hoặc Riverpod
    // final viewModel = ...
    return Scaffold(
      appBar: AppBar(title: Text('Gửi báo cáo rác')),
      body: Center(
        child: Column(
          children: [
            Text('Form báo cáo rác ở đây'),
            // ... các widget nhập liệu, nút gửi
          ],
        ),
      ),
    );
  }
}
