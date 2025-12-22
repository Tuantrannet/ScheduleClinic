
# API ManagerUser API Documentation

## Base URL
```
/api/ManagerUser
```

---

## 1. Get User By ID
**GET** `/api/ManagerUser/getById?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id   | int  | Yes      | User ID     |

**Response Example:**
```json
{
  "userId": 1,
  "userName": "alice",
  "isActive": true,
  "userRoles": [
    { "roleId": 1, "roleName": "Admin" }
  ]
}
```

---

## 2. Get User By Username
**GET** `/api/ManagerUser/getByUsername?username={username}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| username | string | Yes | Username |

**Response Example:**
```json
{
  "userId": 2,
  "userName": "bob",
  "isActive": true,
  "userRoles": []
}
```

---

## 3. Get All Users
**GET** `/api/ManagerUser/getAll`

**Response Example:**
```json
[
  {
    "userId": 1,
    "userName": "alice",
    "isActive": true,
    "userRoles": [ { "roleId": 1, "roleName": "Admin" } ]
  },
  {
    "userId": 2,
    "userName": "bob",
    "isActive": true,
    "userRoles": []
  }
]
```

---

## 4. Update User
**PUT** `/api/ManagerUser/update?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id   | int  | Yes      | User ID     |

**Request Body Example:**
```json
{
  "userId": 1,
  "userName": "alice",
  "passwordHash": "newhash",
  "isActive": true
}
```

**Response Example:**
```json
{
  "message": "User updated successfully"
}
```

---

## 5. Delete User
**DELETE** `/api/ManagerUser/delete?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id   | int  | Yes      | User ID     |

**Response Example:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 6. Check User Exists
**GET** `/api/ManagerUser/check-exists/{username}`

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| username | string | Yes | Username |

**Response Example:**
```json
{
  "exists": true
}
```

---

## 7. Assign Role To User
**POST** `/api/ManagerUser/assignRole`

**Request Body Example:**
```json
{
  "userId": 1,
  "roleId": 2
}
```

**Response:**
204 No Content

---

## 8. Remove Role From User
**DELETE** `/api/ManagerUser/removeRole?userId={userId}&roleId={roleId}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| userId | int | Yes | User ID |
| roleId | int | Yes | Role ID |

**Response:**
204 No Content

---

## User Entity Structure
```json
{
  "userId": 1,
  "userName": "string",
  "passwordHash": "string",
  "isActive": true,
  "userRoles": [ { "roleId": 1, "roleName": "string" } ]
}
```

## AssignRoleRequest DTO
```json
{
  "userId": 1,
  "roleId": 2
}
```

---

## Notes
- Không trả về trường passwordHash cho client (chỉ dùng nội bộ).
- Các trường bắt buộc: userName, isActive.
- Một số endpoint yêu cầu quyền Admin.
