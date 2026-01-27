export class successLoginMessage {
  static readonly LOGIN_SUCCESS = 'Đăng nhập thành công';
}

export class ErrorLoginMessage {
  static readonly LOGIN_FAILED = 'Đăng nhập thất bại';
  static readonly EMAIL_EMPTY = 'Email không được để trống';
  static readonly EMAIL_NOT_VALID = 'Email không hợp lệ';
  static readonly PASSWORD_EMPTY = 'Mật khẩu không được để trống';
  static readonly PASSWORD_NOT_VALID = 'Mật khẩu không hợp lệ';
  static readonly PASSWORD_INCORRECT = 'Mật khẩu không chính xác';
  static readonly USER_NOT_FOUND = 'Người dùng không tồn tại';
  static readonly USER_NOT_ACTIVE = 'Người dùng không hoạt động';
  static readonly USER_NOT_VERIFIED = 'Người dùng không được xác thực';
  static readonly USER_NOT_VALID = 'Người dùng không hợp lệ';
  static readonly TOKEN_NOT_VALID = 'Token không hợp lệ';
  static readonly TOKEN_NOT_FOUND = 'Token không tồn tại';
  static readonly TOKEN_NOT_VERIFIED = 'Token không được xác thực';
  static readonly TOKEN_EXPIRED = 'Token đã hết hạn';
}
