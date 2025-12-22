# API WorkingHour API Documentation

## Base URL
```
/api/WorkingHour
```

---

## 1. Get Working Hour Detail
**GET** `/api/WorkingHour/getDetail?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | int | Yes | WorkingHour ID |

**Response Example:**
```json
{
  "workingId": 1,
  "mor_Start": "08:00",
  "mor_End": "12:00",
  "aff_Start": "13:00",
  "aff_End": "17:00",
  "duration": 30
}
```

---

## 2. Get All Working Hours
**GET** `/api/WorkingHour/getAll`

**Response Example:**
```json
[
  {
    "workingId": 1,
    "mor_Start": "08:00",
    "mor_End": "12:00",
    "aff_Start": "13:00",
    "aff_End": "17:00",
    "duration": 30
  }
]
```

---

## 3. Create Working Hour
**POST** `/api/WorkingHour/add`

**Request Body Example:**
```json
{
  "mor_Start": "08:00",
  "mor_End": "12:00",
  "aff_Start": "13:00",
  "aff_End": "17:00",
  "duration": 30
}
```

**Response:**
204 No Content

---

## 4. Update Working Hour
**PUT** `/api/WorkingHour/update`

**Request Body Example:**
```json
{
  "workingId": 1,
  "mor_Start": "08:00",
  "mor_End": "12:00",
  "aff_Start": "13:00",
  "aff_End": "17:00",
  "duration": 30
}
```

**Response Example:**
```json
{
  "workingId": 1,
  "mor_Start": "08:00",
  "mor_End": "12:00",
  "aff_Start": "13:00",
  "aff_End": "17:00",
  "duration": 30
}
```

---

## 5. Delete Working Hour
**DELETE** `/api/WorkingHour/delete?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | int | Yes | WorkingHour ID |

**Response:**
204 No Content

---

## 6. Get Slots From Day
**GET** `/api/WorkingHour/getSlots?dateCondition={date}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| dateCondition | date | Yes | Date (YYYY-MM-DD) |

**Response Example:**
```json
[
  {
    "start_Time": "08:00",
    "end_Time": "08:30",
    "status": "Available"
  },
  {
    "start_Time": "08:30",
    "end_Time": "09:00",
    "status": "Available"
  }
]
```

---

## WorkingHour Entity Structure
```json
{
  "workingId": 1,
  "mor_Start": "HH:mm",
  "mor_End": "HH:mm",
  "aff_Start": "HH:mm",
  "aff_End": "HH:mm",
  "duration": 30
}
```

## SlotDto Structure
```json
{
  "start_Time": "HH:mm",
  "end_Time": "HH:mm",
  "status": "string"
}
```

---

## Notes
- Các trường thời gian phải đúng định dạng HH:mm (24h).
- duration là số phút cho mỗi slot.
