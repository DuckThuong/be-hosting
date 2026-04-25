export class SuccessServiceMessage {
  static readonly CREATE_SUCCESS = 'Tao moi thanh cong';
  static readonly UPDATE_SUCCESS = 'Cap nhat thanh cong';
}

export class ErrorServiceMessage {
  static readonly CATCH_ERROR = 'Da xay ra loi';
  static readonly SERVICE_NOT_EXIST = 'Dich vu khong ton tai';
  static readonly SERVICE_CODE_NOTEMPTY = 'Ma dich vu khong duoc de trong';
  static readonly SERVICE_CODE_INVALID =
    'Ma dich vu khong duoc vuot qua 50 ky tu';
  static readonly SERVICE_NAME_NOTEMPTY = 'Ten dich vu khong duoc de trong';
  static readonly SERVICE_NAME_INVALID =
    'Ten dich vu khong duoc vuot qua 50 ky tu';
  static readonly SERVICE_DESCRIPTION_INVALID =
    'Mo ta dich vu khong duoc vuot qua 2000 ky tu';
  static readonly SERVICE_LOGO_INVALID =
    'Logo dich vu khong duoc vuot qua 2000 ky tu';
  static readonly SERVICE_BACKGROUND_INVALID =
    'Anh nen dich vu khong duoc vuot qua 2000 ky tu';
  static readonly SERVICE_PRICE_INVALID = 'Gia dich vu khong hop le';
  static readonly TYPE_NOT_EXIST = 'Dich vu khong ton tai';
  static readonly ID_REQUIRED = 'ID dich vu la bat buoc';
}
