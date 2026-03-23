# Đặc Tả API Favorite/Share Cho Location

## 1. Tổng quan

### 1.1. Mục tiêu
Tài liệu này mô tả đặc tả nghiệp vụ và hợp đồng API cho luồng `favorite` và `share` áp dụng cho `location` trong hệ thống Hosting.

### 1.2. Phạm vi
- Chỉ áp dụng cho `location`
- Chưa mở rộng sang `service` hoặc tài nguyên khác
- `favorite` là dữ liệu được lưu theo user
- `share` không lưu DB trong phiên bản đầu

### 1.3. Xác thực
- Tất cả API trong tài liệu này yêu cầu JWT
- Chuẩn auth bám theo module `location` hiện có
- Header sử dụng:

```http
Authorization: Bearer <jwt_token>
```

### 1.4. Quy ước dữ liệu
- Định danh public dùng `locationCode`
- Không dùng numeric `id` trong request/response public
- Link chia sẻ phải chứa `locationCode`
- Nếu cần domain frontend đầy đủ thì backend sử dụng biến cấu hình `FRONTEND_BASE_URL`

## 2. Danh sách API

| API | Method | Path |
| --- | --- | --- |
| Toggle favorite location | `POST` | `/location/toggle-favorite` |
| Lấy danh sách location đã favorite | `GET` | `/location/get-my-favorite-location` |
| Tạo link share location | `GET` | `/location/get-share-link` |

## 3. Đặc tả chi tiết

### 3.1. Toggle favorite location

#### Mục đích
Cho phép user đang đăng nhập thêm hoặc bỏ yêu thích một `location` bằng đúng một API.

#### Endpoint
```http
POST /location/toggle-favorite
```

#### Auth
- Bắt buộc JWT

#### Request Body

| Field | Kiểu | Bắt buộc | Mô tả |
| --- | --- | --- | --- |
| `locationCode` | `string` | Có | Mã location cần favorite hoặc unfavorite |

#### Request Example
```json
{
  "locationCode": "LOC001"
}
```

#### Validation chính
- `locationCode` không được để trống
- `locationCode` phải là location tồn tại trong hệ thống
- Tác động theo user đang đăng nhập

#### Hành vi nghiệp vụ
- Nếu user chưa favorite `locationCode` này:
  - tạo favorite record
  - trả về `isFavorite = true`
- Nếu user đã favorite:
  - xóa favorite record
  - trả về `isFavorite = false`

#### Success Response

| Field | Kiểu | Mô tả |
| --- | --- | --- |
| `message` | `string` | Thông báo kết quả |
| `locationCode` | `string` | Mã location đã thao tác |
| `isFavorite` | `boolean` | Trạng thái favorite sau khi toggle |

#### Success Response Example
```json
{
  "message": "Cap nhat yeu thich thanh cong",
  "locationCode": "LOC001",
  "isFavorite": true
}
```

#### Error cases điển hình

| HTTP Code | Điều kiện |
| --- | --- |
| `400` | Thiếu `locationCode` hoặc `locationCode` không hợp lệ |
| `401` | Thiếu hoặc sai JWT |
| `404` | `locationCode` không tồn tại |
| `500` | Lỗi hệ thống |

### 3.2. Lấy danh sách location đã favorite

#### Mục đích
Cho phép user xem toàn bộ `location` đã được user đó đánh dấu yêu thích.

#### Endpoint
```http
GET /location/get-my-favorite-location
```

#### Auth
- Bắt buộc JWT

#### Request
- Không có request body
- Không yêu cầu query params ở phiên bản đầu

#### Hành vi nghiệp vụ
- Lấy danh sách location đã favorite của user hiện tại
- Trả về thông tin location theo shape gần với `LocationListDto`
- Có thể bổ sung `isFavorite = true` để frontend dùng trực tiếp
- Dữ liệu nên bao gồm:
  - thông tin location cơ bản
  - type info
  - owner info
  - renter info nếu có
  - services
  - address

#### Success Response

| Field | Kiểu | Mô tả |
| --- | --- | --- |
| `message` | `string` | Thông báo kết quả |
| `data` | `LocationListDto[]` | Danh sách location đã favorite |

#### Success Response Example
```json
{
  "message": "Lay danh sach favorite thanh cong",
  "data": [
    {
      "locationCode": "LOC001",
      "locationName": "Kho A - Tang 1",
      "locationDescription": "Kho chua hang dien tu",
      "locationNote": "Gan trung tam",
      "locationLogo": "https://cdn.example.com/location-a.png",
      "locationPriceStart": 1000000,
      "locationPriceEnd": 2000000,
      "locationPriceAfterDeal": 1500000,
      "minTime": "2026-03-01T00:00:00.000Z",
      "maxTime": "2026-12-31T00:00:00.000Z",
      "hasRent": 0,
      "locationRate": 4,
      "typeCode": "TYPE001",
      "typeName": "Kho",
      "ownerCode": "USR001",
      "ownerName": "owner_a",
      "ownerEmail": "owner_a@example.com",
      "renterCode": null,
      "isFavorite": true,
      "services": [],
      "address": []
    }
  ]
}
```

#### Error cases điển hình

| HTTP Code | Điều kiện |
| --- | --- |
| `401` | Thiếu hoặc sai JWT |
| `500` | Lỗi hệ thống |

### 3.3. Tạo link share location

#### Mục đích
Trả về link chia sẻ cho một `location`, để frontend/mobile dùng khi người dùng nhấn share.

#### Endpoint
```http
GET /location/get-share-link?locationCode=LOC001
```

#### Auth
- Bắt buộc JWT ở phiên bản đầu để đồng nhất với module `location`

#### Query Params

| Field | Kiểu | Bắt buộc | Mô tả |
| --- | --- | --- | --- |
| `locationCode` | `string` | Có | Mã location cần tạo link share |

#### Validation chính
- `locationCode` không được để trống
- `locationCode` phải tồn tại

#### Hành vi nghiệp vụ
- Backend kiểm tra location tồn tại
- Backend tạo `shareUrl` chứa `locationCode`
- Link được dùng để frontend mở màn chi tiết location
- Frontend sau đó gọi API detail hiện có:

```http
GET /location/get-location-by-code?locationCode=<locationCode>
```

#### Công thức link đề xuất
```text
${FRONTEND_BASE_URL}/location-detail?locationCode=<locationCode>
```

#### Success Response

| Field | Kiểu | Mô tả |
| --- | --- | --- |
| `message` | `string` | Thông báo kết quả |
| `locationCode` | `string` | Mã location |
| `shareUrl` | `string` | Link chia sẻ cho frontend/mobile |

#### Success Response Example
```json
{
  "message": "Tao link chia se thanh cong",
  "locationCode": "LOC001",
  "shareUrl": "https://frontend.example.com/location-detail?locationCode=LOC001"
}
```

#### Error cases điển hình

| HTTP Code | Điều kiện |
| --- | --- |
| `400` | Thiếu `locationCode` hoặc `locationCode` không hợp lệ |
| `401` | Thiếu hoặc sai JWT |
| `404` | `locationCode` không tồn tại |
| `500` | Lỗi hệ thống |

## 4. Public Interface Đề Xuất

### 4.1. ToggleFavoriteRequestDto
```ts
export class ToggleFavoriteRequestDto {
  locationCode: string;
}
```

### 4.2. ToggleFavoriteResponseDto
```ts
export class ToggleFavoriteResponseDto {
  message: string;
  locationCode: string;
  isFavorite: boolean;
}
```

### 4.3. FavoriteLocationListResponseDto
```ts
export class FavoriteLocationListResponseDto {
  message: string;
  data: Array<LocationListDto & { isFavorite?: boolean }>;
}
```

### 4.4. GetShareLinkResponseDto
```ts
export class GetShareLinkResponseDto {
  message: string;
  locationCode: string;
  shareUrl: string;
}
```

## 5. Acceptance Cases

| STT | Case | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Favorite lần đầu | API tạo record favorite và trả `isFavorite = true` |
| 2 | Unfavorite khi đã favorite | API xóa record và trả `isFavorite = false` |
| 3 | Favorite với `locationCode` không tồn tại | Trả `404` |
| 4 | Danh sách favorite rỗng | Trả `data: []` |
| 5 | Danh sách favorite có dữ liệu | Trả đúng shape location, kèm `isFavorite = true` nếu áp dụng |
| 6 | Share link hợp lệ | Trả đúng `shareUrl` chứa `locationCode` |
| 7 | Share link cho location không tồn tại | Trả `404` |

## 6. Giả định Và Ghi Chú
- Tài liệu này chỉ đặc tả API, chưa bao gồm ERD và sequence diagram
- `favorite` là dữ liệu persisted theo user
- `share` không có log và không tăng counter ở v1
- `LocationListDto` có thể được mở rộng thêm `isFavorite` nếu frontend cần dùng lại trực tiếp
- Domain frontend là cấu hình môi trường, không hard-code trong source
