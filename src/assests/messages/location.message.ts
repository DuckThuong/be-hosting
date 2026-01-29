export class SuccessLocationMessage {
  static readonly CREATE_SUCCESS = 'Tạo mới thành công';
}

export class ErrorLocationMessage {
  static readonly CATCH_ERROR = 'Đã xảy ra lỗi!';
  static readonly TYPE_NAME_INVALID = 'Tên của loại khu vực không hợp lệ.';
  static readonly TYPE_NAME_NOTEMPTY =
    'Tên của loại khu vực không được để trống.';
  static readonly TYPE_CODE_INVALID = 'Mã của loại khu vực không hợp lệ.';
  static readonly TYPE_CODE_NOTEMPTY =
    'Mã của loại khu vực không được để trống.';
  static readonly TYPE_DESCRIPTION_INVALID =
    'Chú thích của loại khu vực không hợp lệ.';
  static readonly TYPE_LOGO_INVALID = 'Logo của loại khu vực không hợp lệ.';
  static readonly TYPE_BACKGROUND_INVALID =
    'Ảnh nền loại khu vực không hợp lệ.';
}
