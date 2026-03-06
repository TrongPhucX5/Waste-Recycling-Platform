import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class CloudinaryService {
  static const String cloudName = 'TEN_CLOUD_CUA_BAN';
  static const String uploadPreset = 'TEN_PRESET_CUA_BAN';

  // Hàm nhận vào file ảnh và trả về đường link URL
  static Future<String?> uploadImage(File imageFile) async {
    try {
      final url = Uri.parse('https://api.cloudinary.com/v1_1/$cloudName/image/upload');
      final request = http.MultipartRequest('POST', url)
        ..fields['upload_preset'] = uploadPreset
        ..files.add(await http.MultipartFile.fromPath('file', imageFile.path));

      final response = await request.send();
      
      if (response.statusCode == 200) {
        final responseData = await response.stream.toBytes();
        final responseString = String.fromCharCodes(responseData);
        final jsonMap = jsonDecode(responseString);
        return jsonMap['secure_url']; // Link ảnh thành công
      }
      return null;
    } catch (e) {
      print('Lỗi Upload Ảnh Mobile: $e');
      return null;
    }
  }
}
