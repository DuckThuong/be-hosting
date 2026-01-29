export class SuccessServiceMessage {
  static readonly CREATE_SUCCESS = 'Tạo mới thành công';
  static readonly UPDATE_SUCCESS = 'Cập nhật thành công';
}

export class ErrorServiceMessage {
  static readonly CATCH_ERROR = 'Đã xảy ra lỗi';
  static readonly SERVICE_NOT_EXIST = 'Dịch vụ không tồn tại';
  static readonly SERVICE_CODE_NOTEMPTY = 'Mã dịch vụ không được để trống';
  static readonly SERVICE_CODE_INVALID =
    'Mã dịch vụ không được vượt quá 50 ký tự';
  static readonly SERVICE_NAME_NOTEMPTY = 'Tên dịch vụ không được để trống';
  static readonly SERVICE_NAME_INVALID =
    'Tên dịch vụ không được vượt quá 50 ký tự';
  static readonly SERVICE_DESCRIPTION_INVALID =
    'Mô tả dịch vụ không được vượt quá 2000 ký tự';
  static readonly SERVICE_LOGO_INVALID =
    'Logo dịch vụ không được vượt quá 2000 ký tự';
  static readonly SERVICE_BACKGROUND_INVALID =
    'Ảnh nền dịch vụ không được vượt quá 2000 ký tự';
  static readonly TYPE_NOT_EXIST = 'Dịch vụ không tồn tại';
  static readonly ID_REQUIRED = 'ID dịch vụ là bắt buộc';
}
