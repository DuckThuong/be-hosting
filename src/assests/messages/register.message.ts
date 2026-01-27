export class SuccessRegisterMessage {
  static readonly REGISTER_SUCCESS = 'Đăng ký thành công';
}

export class ErrorRegisterMessage {
  static readonly EMAIL_EMPTY = 'Email không được để trống';
  static readonly EMAIL_NOT_VALID = 'Email không hợp lệ';
  static readonly PASSWORD_EMPTY = 'Mật khẩu không được để trống';
  static readonly PASSWORD_NOT_VALID = 'Mật khẩu không hợp lệ';
  static readonly CONFIRM_PASSWORD_EMPTY = 'CONFIRM PASSWORD EMPTY';
  static readonly CONFIRM_PASSWORD_NOT_VALID = 'Xác nhận mật khẩu không hợp lệ';
  static readonly USER_ALREADY_EXISTS = 'Người dùng đã tồn tại';
  static readonly EMAIL_ALREADY_EXISTS = 'Email đã tồn tại';
  static readonly PHONE_NUMBER_ALREADY_EXISTS = 'Số điện thoại đã tồn tại';
  static readonly REGISTER_FAILED = 'Đăng ký thất bại';
}
