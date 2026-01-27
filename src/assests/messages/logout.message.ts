export class SuccessLogoutMessage {
  static readonly LOGOUT_SUCCESS = 'Đăng xuất thành công';
}

export class ErrorLogoutMessage {
  static readonly LOGOUT_FAILED = 'Đăng xuất thất bại';
  static readonly TOKEN_EMPTY = 'Token không được để trống';
  static readonly TOKEN_NOT_VALID = 'Token không hợp lệ';
  static readonly TOKEN_NOT_FOUND = 'Token không tồn tại';
  static readonly TOKEN_NOT_VERIFIED = 'Token không được xác thực';
  static readonly TOKEN_EXPIRED = 'Token đã hết hạn';
}
