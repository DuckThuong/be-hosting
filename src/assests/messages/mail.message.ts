export class MailMessage {
  static readonly OTP_SENT = 'OTP đã được gửi đến email của bạn';
  static readonly OTP_NOT_FOUND = 'OTP không tồn tại hoặc đã hết hạn';
  static readonly OTP_EXPIRED = 'OTP đã hết hạn';
  static readonly OTP_INVALID = 'OTP không chính xác';
  static readonly OTP_VERIFIED = 'OTP verified successfully';
}

export enum MailErrorMessage {
  SEND_EMAIL_FAILED = 'Gửi email thất bại',
  OTP_NOT_FOUND = 'OTP không tồn tại hoặc đã hết hạn',
  OTP_EXPIRED = 'OTP đã hết hạn',
  OTP_INVALID = 'OTP không chính xác',
  RESEND_API_KEY_MISSING = 'RESEND_API_KEY không được cấu hình',
}

export enum MailSuccessMessage {
  OTP_SENT = 'OTP đã được gửi đến email của bạn',
  OTP_VERIFIED = 'Xác thực OTP thành công',
  EMAIL_SENT = 'Email đã được gửi thành công',
}
