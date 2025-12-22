# API Authentication Documentation

## Base URL
```
/api/authentication
```

---

## 1. Register - Đăng ký tài khoản mới

### Endpoint
```
POST /api/authentication/register
```

### Description
Tạo tài khoản người dùng mới trong hệ thống.

### Request Body
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2024-12-20",
  "gender": "string",
  "address": "string"
}
```

### Response
**Status: 200 OK**
```json
{
  "message": "User registered successfully"
}
```

**Status: 400 Bad Request**
```json
{
  "error": "Username already exists" | "Invalid email format" | "..."
}
```

**Status: 500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "detail": "error message"
}
```

---

## 2. Login - Đăng nhập

### Endpoint
```
POST /api/authentication/login
```

### Description
Xác thực thông tin đăng nhập và cấp token.

### Request Body
```json
{
  "userName": "string",
  "password": "string"
}
```

### Response
**Status: 200 OK**
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "userId": 1,
  "username": "string",
  "email": "string"
}
```

**Status: 400 Bad Request**
```json
{
  "error": "Username and password are required"
}
```

**Status: 401 Unauthorized**
```json
{
  "error": "Invalid credentials"
}
```

**Status: 404 Not Found**
```json
{
  "error": "User not found"
}
```

**Status: 500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "detail": "error message"
}
```

---

## 3. Get User By ID - Lấy thông tin người dùng theo ID

### Endpoint
```
GET /api/authentication/{id}
```

### Description
Lấy thông tin chi tiết của một người dùng theo ID.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | int | Yes | ID của người dùng |

### Response
**Status: 200 OK**
```json
{
  "userId": 1,
  "username": "string",
  "email": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2024-12-20",
  "gender": "string",
  "address": "string",
  "createdAt": "2024-12-20T10:00:00",
  "updatedAt": "2024-12-20T10:00:00"
}
```

**Status: 400 Bad Request**
```json
{
  "error": "Invalid user ID"
}
```

**Status: 404 Not Found**
```json
{
  "error": "User not found"
}
```

**Status: 500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "detail": "error message"
}
```

---

## 4. Refresh Token - Làm mới token

### Endpoint
```
POST /api/authentication/refreshToken
```

### Description
Dùng refresh token để lấy access token mới.

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| refreshToken | string | Yes | Refresh token từ lần đăng nhập trước |

### Response
**Status: 200 OK**
```json
{
  "accessToken": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here",
  "userId": 1,
  "username": "string"
}
```

**Status: 400 Bad Request**
```json
{
  "error": "Invalid refresh token"
}
```

---

## Error Handling

Tất cả các endpoint đều trả về các error code sau:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Thông tin đăng nhập sai |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 500 | Internal Server Error - Lỗi máy chủ |

---

## Authentication

Sau khi đăng nhập, sử dụng access token trong header:
```
Authorization: Bearer {accessToken}
```

---

## Notes
- Username và password bắt buộc phải có
- Email phải có định dạng hợp lệ
- Password tối thiểu 6 ký tự
- Refresh token hết hạn sau 7 ngày
- Access token hết hạn sau 1 giờ
