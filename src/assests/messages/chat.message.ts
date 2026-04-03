export class SuccessChatMessage {
  static readonly CONTACT_TO_USER_SUCCESS = 'Tạo cuộc trò chuyện thành công.';
  static readonly SEND_MESSAGE_SUCCESS = 'Gửi tin nhắn thành công.';
  static readonly GET_CONVERSATIONS_SUCCESS =
    'Lấy danh sách cuộc trò chuyện thành công.';
  static readonly GET_MESSAGES_SUCCESS = 'Lấy danh sách tin nhắn thành công.';
  static readonly MARK_AS_READ_SUCCESS = 'Đánh dấu đã đọc thành công.';
}

export class ErrorChatMessage {
  static readonly FROM_USER_NOT_FOUND = 'Người gửi không tồn tại.';
  static readonly TO_USER_NOT_FOUND = 'Người nhận không tồn tại.';
  static readonly CANNOT_CHAT_WITH_YOURSELF =
    'Không thể tạo cuộc trò chuyện với chính mình.';

  static readonly CONVERSATION_NOT_FOUND = 'Cuộc trò chuyện không tồn tại.';
  static readonly NOT_A_PARTICIPANT =
    'Bạn không có quyền truy cập cuộc trò chuyện này.';
  static readonly FORBIDDEN_SEND_MESSAGE =
    'Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này.';

  static readonly MESSAGE_CONTENT_NOTEMPTY =
    'Nội dung tin nhắn không được để trống.';
  static readonly MESSAGE_CONTENT_TOO_LONG =
    'Tin nhắn không được vượt quá 2000 ký tự.';

  static readonly PAGE_INVALID = 'Page phải lớn hơn 0.';
  static readonly LIMIT_INVALID = 'Limit phải từ 1 đến 100.';

  static readonly CATCH_ERROR = 'Đã xảy ra lỗi!';
}
