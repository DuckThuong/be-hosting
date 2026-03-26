export class SuccessLocationMessage {
  static readonly CREATE_SUCCESS = 'Tao moi thanh cong';
  static readonly UPDATE_SUCCESS = 'Cap nhat thanh cong';
  static readonly DELETE_SUCCESS = 'Xoa thanh cong';
  static readonly ADD_SERVICE_SUCCESS = 'Them dich vu thanh cong.';
  static readonly PAUSE_SERVICE_SUCCESS = 'Tam ngung dich vu thanh cong.';
  static readonly REMOVE_SERVICE_SUCCESS = 'Xoa dich vu thanh cong.';
  static readonly UPDATE_RENT_STATUS_SUCCESS =
    'Cap nhat trang thai cho thue thanh cong';
  static readonly CANCEL_RENT_SUCCESS = 'Huy cho thue thanh cong';
  static readonly CREATE_ADDRESS_SUCCESS = 'Tao dia chi thanh cong.';
  static readonly UPDATE_ADDRESS_SUCCESS = 'Cap nhat dia chi thanh cong.';
  static readonly DELETE_ADDRESS_SUCCESS = 'Xoa dia chi thanh cong.';
  static readonly FAVORITE_ADDED_SUCCESS = 'Da them vao danh sach yeu thich.';
  static readonly FAVORITE_REMOVED_SUCCESS =
    'Da xoa khoi danh sach yeu thich.';
  static readonly GET_FAVORITE_LIST_SUCCESS =
    'Lay danh sach yeu thich thanh cong.';
  static readonly GET_SHARE_LINK_SUCCESS = 'Tao link chia se thanh cong.';
  static readonly UPDATE_LOGO_SUCCESS = 'Cap nhat logo thanh cong.';
  static readonly ADD_MEDIA_SUCCESS = 'Them media thanh cong.';
  static readonly UPDATE_MEDIA_SUCCESS = 'Cap nhat media thanh cong.';
  static readonly DELETE_MEDIA_SUCCESS = 'Xoa media thanh cong.';
  static readonly REORDER_MEDIA_SUCCESS = 'Cap nhat thu tu media thanh cong.';
}

export class ErrorLocationMessage {
  static readonly CATCH_ERROR = 'Da xay ra loi!';
  static readonly TYPE_NOT_EXIST = 'Phan loai khong ton tai.';
  static readonly TYPE_NAME_INVALID = 'Ten loai khu vuc khong hop le.';
  static readonly TYPE_NAME_NOTEMPTY = 'Ten loai khu vuc khong duoc de trong.';
  static readonly TYPE_CODE_INVALID = 'Ma loai khu vuc khong hop le.';
  static readonly TYPE_CODE_NOTEMPTY = 'Ma loai khu vuc khong duoc de trong.';
  static readonly TYPE_DESCRIPTION_INVALID =
    'Chu thich loai khu vuc khong hop le.';
  static readonly TYPE_LOGO_INVALID = 'Logo loai khu vuc khong hop le.';
  static readonly TYPE_BACKGROUND_INVALID =
    'Anh nen loai khu vuc khong hop le.';
  static readonly LOCATION_NOT_FOUND = 'Khu vuc khong ton tai.';
  static readonly LOCATION_CODE_NOTEMPTY = 'Ma khu vuc khong duoc de trong.';
  static readonly LOCATION_CODE_INVALID = 'Ma khu vuc khong hop le.';
  static readonly LOCATION_NAME_NOTEMPTY = 'Ten khu vuc khong duoc de trong.';
  static readonly LOCATION_NAME_INVALID = 'Ten khu vuc khong hop le.';
  static readonly LOCATION_ALREADY_RENTED = 'Khu vuc dang duoc cho thue.';
  static readonly LOCATION_NOT_RENTED = 'Khu vuc chua duoc cho thue.';
  static readonly USER_RENT_CODE_REQUIRED =
    'Ma nguoi thue la bat buoc khi cho thue.';
  static readonly USER_RENT_CODE_INVALID = 'Ma nguoi thue khong hop le.';
  static readonly DELETE_FAILED = 'Xoa khu vuc that bai.';
  static readonly LOCATION_IN_USE =
    'Khu vuc dang duoc su dung, khong the xoa.';
  static readonly OWNER_CODE_NOTEMPTY =
    'Ma chu so huu khong duoc de trong.';
  static readonly OWNER_CODE_INVALID = 'Ma chu so huu khong hop le.';
  static readonly OWNER_NAME_INVALID = 'Ten chu so huu khong hop le.';
  static readonly OWNER_EMAIL_INVALID = 'Email chu so huu khong hop le.';
  static readonly RENDER_NAME_INVALID = 'Ten nguoi thue khong hop le.';
  static readonly RENDER_EMAIL_INVALID = 'Email nguoi thue khong hop le.';
  static readonly MIN_TIME_LIMIT_INVALID =
    'Thoi gian thue toi thieu khong hop le.';
  static readonly MAX_TIME_LIMIT_INVALID =
    'Thoi gian thue toi da khong hop le.';
  static readonly TIME_LIMIT_RANGE_INVALID =
    'Thoi gian thue toi thieu phai nho hon hoac bang thoi gian toi da.';
  static readonly LOCATION_DESCRIPTION_INVALID =
    'Mo ta khu vuc khong hop le (toi da 2000 ky tu).';
  static readonly LOCATION_NOTE_INVALID =
    'Ghi chu khu vuc khong hop le (toi da 2000 ky tu).';
  static readonly LOCATION_RATE_INVALID =
    'Danh gia khu vuc khong hop le (tu 0 den 5).';
  static readonly RENT_STATUS_REQUIRED = 'Trang thai cho thue la bat buoc.';
  static readonly RENT_STATUS_INVALID = 'Trang thai cho thue khong hop le.';
  static readonly ADDRESS_NOT_FOUND = 'Dia chi khong ton tai.';
  static readonly ADDRESS_ALREADY_EXISTS = 'Dia chi da ton tai.';
  static readonly ADDRESS_BELONGS_TO_OTHER_LOCATION =
    'Dia chi nay khong thuoc khu vuc da chi dinh.';
  static readonly ADDRESS_DATA_NOTEMPTY =
    'Du lieu dia chi khong duoc de trong.';
  static readonly ADDRESS_CODE_NOTEMPTY = 'Ma dia chi khong duoc de trong.';
  static readonly ADDRESS_CODE_INVALID = 'Ma dia chi khong hop le.';
  static readonly ADDRESS_NAME_NOTEMPTY = 'Ten dia chi khong duoc de trong.';
  static readonly ADDRESS_NAME_INVALID = 'Ten dia chi khong hop le.';
  static readonly FULL_ADDRESS_NOTEMPTY =
    'Dia chi chi tiet khong duoc de trong.';
  static readonly FULL_ADDRESS_INVALID = 'Dia chi chi tiet khong hop le.';
  static readonly ADDRESS_WARD_INVALID = 'Phuong xa khong hop le.';
  static readonly ADDRESS_DISTRICT_INVALID = 'Quan huyen khong hop le.';
  static readonly ADDRESS_CITY_INVALID = 'Thanh pho khong hop le.';
  static readonly ADDRESS_PROVINCE_INVALID = 'Tinh khong hop le.';
  static readonly ADDRESS_COUNTRY_INVALID = 'Quoc gia khong hop le.';
  static readonly ADDRESS_PORTAL_INVALID = 'Ma buu chinh khong hop le.';
  static readonly ADDRESS_LAT_INVALID = 'Vi do khong hop le.';
  static readonly ADDRESS_LONG_INVALID = 'Kinh do khong hop le.';
  static readonly ADDRESS_REGION_INVALID = 'Vung khong hop le.';
  static readonly ADDRESS_STATUS_INVALID = 'Trang thai dia chi khong hop le.';
  static readonly ADDRESS_TYPE_INVALID = 'Phan loai dia chi khong hop le.';
  static readonly ADDRESS_DESCRIPTION_INVALID =
    'Mo ta dia chi khong hop le (toi da 255 ky tu).';
  static readonly ADDRESS_NOTE_INVALID =
    'Ghi chu dia chi khong hop le (toi da 255 ky tu).';
  static readonly LOCATION_MEDIA_NOT_FOUND = 'Media cua khu vuc khong ton tai.';
  static readonly LOCATION_MEDIA_INVALID = 'Media khu vuc khong hop le.';
  static readonly LOCATION_MEDIA_CODE_NOTEMPTY =
    'Ma media khong duoc de trong.';
  static readonly LOCATION_MEDIA_CODE_INVALID = 'Ma media khong hop le.';
  static readonly LOCATION_MEDIA_NOT_BELONG_TO_LOCATION =
    'Media khong thuoc khu vuc da chi dinh.';
  static readonly LOCATION_LOGO_MUST_BE_IMAGE =
    'Chi anh moi duoc chon lam logo.';
  static readonly LOCATION_PERMISSION_DENIED =
    'Ban khong co quyen cap nhat khu vuc nay.';
  static readonly LOCATION_MEDIA_TYPE_INVALID = 'Loai media khong hop le.';
  static readonly LOCATION_MEDIA_FILE_REQUIRED =
    'File media la bat buoc.';
  static readonly LOCATION_MEDIA_DISPLAY_ORDER_INVALID =
    'Thu tu hien thi media khong hop le.';
  static readonly LOCATION_MEDIA_DELETE_LOGO_FORBIDDEN =
    'Khong the xoa media dang duoc dat lam logo.';
  static readonly LOCATION_MEDIA_REORDER_INVALID =
    'Du lieu sap xep media khong hop le.';
  static readonly LOCATION_MEDIA_UPDATE_INVALID =
    'Du lieu cap nhat media khong hop le.';
}

export class ErrorServiceMessage {
  static readonly SERVICE_CODE_NOTEMPTY = 'Ma dich vu khong duoc de trong.';
  static readonly SERVICE_CODE_INVALID = 'Ma dich vu khong hop le.';
  static readonly SERVICE_CODE_TOO_LONG =
    'Ma dich vu khong duoc vuot qua 50 ky tu.';
}
