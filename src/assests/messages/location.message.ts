export class SuccessLocationMessage {
  static readonly CREATE_SUCCESS = 'Tạo mới thành công';
  static readonly UPDATE_SUCCESS = 'Cập nhật thành công';
  static readonly DELETE_SUCCESS = 'Xóa thành công';
  static readonly ADD_SERVICE_SUCCESS = 'Thêm dịch vụ thành công.';
  static readonly PAUSE_SERVICE_SUCCESS = 'Tạm ngưng dịch vụ thành công.';
  static readonly REMOVE_SERVICE_SUCCESS = 'Xóa dịch vụ thành công.';
  static readonly UPDATE_RENT_STATUS_SUCCESS =
    'Cập nhật trạng thái cho thuê thành công';
  static readonly CANCEL_RENT_SUCCESS = 'Hủy cho thuê thành công';

  // ── Address ──────────────────────────────────────────────────────────────
  static readonly CREATE_ADDRESS_SUCCESS = 'Tạo địa chỉ thành công.';
  static readonly UPDATE_ADDRESS_SUCCESS = 'Cập nhật địa chỉ thành công.';
  static readonly DELETE_ADDRESS_SUCCESS = 'Xóa địa chỉ thành công.';
}

export class ErrorLocationMessage {
  static readonly CATCH_ERROR = 'Đã xảy ra lỗi!';
  static readonly TYPE_NOT_EXIST = 'Phân loại không tồn tại.';
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
  static readonly LOCATION_NOT_FOUND = 'Khu vực không tồn tại.';
  static readonly LOCATION_CODE_NOTEMPTY = 'Mã khu vực không được để trống.';
  static readonly LOCATION_CODE_INVALID = 'Mã khu vực không hợp lệ.';
  static readonly LOCATION_NAME_NOTEMPTY = 'Tên khu vực không được để trống.';
  static readonly LOCATION_NAME_INVALID = 'Tên khu vực không hợp lệ.';
  static readonly LOCATION_ALREADY_RENTED = 'Khu vực đang được cho thuê.';
  static readonly LOCATION_NOT_RENTED = 'Khu vực chưa được cho thuê.';
  static readonly USER_RENT_CODE_REQUIRED =
    'Mã người thuê là bắt buộc khi cho thuê.';
  static readonly USER_RENT_CODE_INVALID = 'Mã người thuê không hợp lệ.';
  static readonly DELETE_FAILED = 'Xóa khu vực thất bại.';
  static readonly LOCATION_IN_USE = 'Khu vực đang được sử dụng, không thể xóa.';
  static readonly OWNER_CODE_NOTEMPTY = 'Mã chủ sở hữu không được để trống.';
  static readonly OWNER_CODE_INVALID = 'Mã chủ sở hữu không hợp lệ.';
  static readonly MIN_TIME_LIMIT_INVALID =
    'Thời gian thuê tối thiểu không hợp lệ.';
  static readonly MAX_TIME_LIMIT_INVALID =
    'Thời gian thuê tối đa không hợp lệ.';
  static readonly TIME_LIMIT_RANGE_INVALID =
    'Thời gian thuê tối thiểu phải nhỏ hơn hoặc bằng thời gian tối đa.';
  static readonly LOCATION_DESCRIPTION_INVALID =
    'Mô tả khu vực không hợp lệ (tối đa 2000 ký tự).';
  static readonly LOCATION_NOTE_INVALID =
    'Ghi chú khu vực không hợp lệ (tối đa 2000 ký tự).';
  static readonly LOCATION_RATE_INVALID =
    'Đánh giá khu vực không hợp lệ (từ 0 đến 5).';
  static readonly RENT_STATUS_REQUIRED = 'Trạng thái cho thuê là bắt buộc.';

  static readonly ADDRESS_NOT_FOUND = 'Địa chỉ không tồn tại.';
  static readonly ADDRESS_ALREADY_EXISTS = 'Địa chỉ đã tồn tại.';
  static readonly ADDRESS_BELONGS_TO_OTHER_LOCATION =
    'Địa chỉ này không thuộc khu vực đã chỉ định.';
  static readonly ADDRESS_CODE_NOTEMPTY = 'Mã địa chỉ không được để trống.';
  static readonly ADDRESS_CODE_INVALID = 'Mã địa chỉ không hợp lệ.';
  static readonly ADDRESS_NAME_NOTEMPTY = 'Tên địa chỉ không được để trống.';
  static readonly ADDRESS_NAME_INVALID = 'Tên địa chỉ không hợp lệ.';
  static readonly FULL_ADDRESS_NOTEMPTY =
    'Địa chỉ chi tiết không được để trống.';
  static readonly FULL_ADDRESS_INVALID = 'Địa chỉ chi tiết không hợp lệ.';
  static readonly ADDRESS_WARD_INVALID = 'Phường/Xã không hợp lệ.';
  static readonly ADDRESS_DISTRICT_INVALID = 'Quận/Huyện không hợp lệ.';
  static readonly ADDRESS_CITY_INVALID = 'Thành phố không hợp lệ.';
  static readonly ADDRESS_PROVINCE_INVALID = 'Tỉnh không hợp lệ.';
  static readonly ADDRESS_COUNTRY_INVALID = 'Quốc gia không hợp lệ.';
  static readonly ADDRESS_PORTAL_INVALID = 'Mã bưu chính không hợp lệ.';
  static readonly ADDRESS_LAT_INVALID = 'Vĩ độ không hợp lệ.';
  static readonly ADDRESS_LONG_INVALID = 'Kinh độ không hợp lệ.';
  static readonly ADDRESS_REGION_INVALID = 'Vùng không hợp lệ.';
  static readonly ADDRESS_STATUS_INVALID = 'Trạng thái địa chỉ không hợp lệ.';
  static readonly ADDRESS_TYPE_INVALID = 'Phân loại địa chỉ không hợp lệ.';
  static readonly ADDRESS_DESCRIPTION_INVALID =
    'Mô tả địa chỉ không hợp lệ (tối đa 255 ký tự).';
  static readonly ADDRESS_NOTE_INVALID =
    'Ghi chú địa chỉ không hợp lệ (tối đa 255 ký tự).';
}

export class ErrorServiceMessage {
  static readonly SERVICE_CODE_NOTEMPTY = 'Mã dịch vụ không được để trống.';
  static readonly SERVICE_CODE_INVALID = 'Mã dịch vụ không hợp lệ.';
  static readonly SERVICE_CODE_TOO_LONG =
    'Mã dịch vụ không được vượt quá 50 ký tự.';
}
