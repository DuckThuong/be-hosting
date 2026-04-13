# Favorite And Share API Test Guide

Base URL:

```text
http://127.0.0.1:8000
```

Test token:

```http
Authorization: Bearer <access_token>
```

## 1. Toggle favorite

Endpoint:

```http
POST /location/toggle-favorite
```

Auth:

```http
Authorization: Bearer <access_token>
```

Request sample:

```json
{
  "locationCode": "LOC_ROOM_01"
}
```

Success response sample when adding favorite:

```json
{
  "message": "Da them vao danh sach yeu thich.",
  "locationCode": "LOC_ROOM_01",
  "isFavorite": true
}
```

Success response sample when removing favorite:

```json
{
  "message": "Da xoa khoi danh sach yeu thich.",
  "locationCode": "LOC_ROOM_01",
  "isFavorite": false
}
```

Error codes:

- `400`: `locationCode` empty or invalid length
- `401`: missing token, invalid token, expired token
- `404`: location not found
- `500`: unexpected server error

## 2. Get my favorite locations

Endpoint:

```http
GET /location/get-my-favorite-location
```

Auth:

```http
Authorization: Bearer <access_token>
```

Request sample:

```http
GET /location/get-my-favorite-location
```

Success response sample:

```json
{
  "message": "Lay danh sach yeu thich thanh cong.",
  "data": [
    {
      "locationCode": "LOC_ROOM_01",
      "locationName": "Phong tro gan cho Ben Thanh",
      "locationLogo": "https://picsum.photos/seed/loc-room-01/800/600",
      "fullAddress": "120 Le Thanh Ton, Ben Nghe, Quan 1, Ho Chi Minh City",
      "locationPriceStart": 3500000,
      "locationPriceEnd": 4200000,
      "typeCode": "ROOM",
      "typeName": "Phong tro",
      "hasRent": 0,
      "isFavorite": true
    }
  ]
}
```

Error codes:

- `401`: missing token, invalid token, expired token
- `500`: unexpected server error

## 3. Get share link

Endpoint:

```http
GET /location/get-share-link?locationCode=LOC_ROOM_01
```

Auth:

```text
No token required
```

Request sample:

```http
GET /location/get-share-link?locationCode=LOC_ROOM_01
```

Success response sample:

```json
{
  "message": "Tao link chia se thanh cong.",
  "locationCode": "LOC_ROOM_01",
  "shareUrl": "http://localhost:3001/room-detail?locationCode=LOC_ROOM_01"
}
```

Error codes:

- `400`: `locationCode` empty or invalid length
- `404`: location not found
- `500`: unexpected server error

## 4. Suggested Postman flow

1. `POST /auth/signin` to get `access_token`
2. `POST /location/toggle-favorite` with Bearer token
3. `GET /location/get-my-favorite-location` with Bearer token
4. `GET /location/get-share-link?locationCode=LOC_ROOM_01` without token
