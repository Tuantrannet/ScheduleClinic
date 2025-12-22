
# API Appointment API Documentation

## Base URL
```
/api/Appointment
```

---

## 1. Create Appointment
**POST** `/api/Appointment/add`

**Request Body Example:**
```json
{
  "appoinmentId": 0,
  "patientId": "P001",
  "appointmentDate": "2025-01-01",
  "status": "Pending"
}
```

**Response Example:**
```json
{
  "message": "Đã tạo cuộc hẹn thành công"
}
```

---

## 2. Update Appointment
**PUT** `/api/Appointment/update`

**Request Body Example:**
```json
{
  "appoinmentId": 1,
  "patientId": "P001",
  "appointmentDate": "2025-01-02",
  "status": "Confirmed"
}
```

**Response Example:**
```json
{
  "appoinmentId": 1,
  "patientId": "P001",
  "appointmentDate": "2025-01-02",
  "status": "Confirmed"
}
```

---

## 3. Delete Appointment
**DELETE** `/api/Appointment/delete?appointmentId={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| appointmentId | int | Yes | Appointment ID |

**Response:**
204 No Content

---

## 4. Get All Appointments By Patient
**GET** `/api/Appointment/getAllByPatient?patientId={id}&page={page}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| patientId | string | Yes | Patient ID |
| page | int | Yes | Page number |

**Response Example:**
```json
[
  {
    "appointmentId": 1,
    "patientId": "P001",
    "appointmentDate": "2025-01-01",
    "status": "Pending"
  },
  {
    "appointmentId": 2,
    "patientId": "P001",
    "appointmentDate": "2025-01-02",
    "status": "Confirmed"
  }
]
```

---

## Appointment Entity Structure
```json
{
  "appointmentId": 1,
  "patientId": "string",
  "appointmentDate": "YYYY-MM-DD",
  "status": "Pending|Confirmed|Completed|Cancelled",
  "start_Time": "HH:mm",
  "end_Time": "HH:mm"
}
```

## RequestAppointment DTO
```json
{
  "appoinmentId": 1,
  "patientId": "string",
  "appointmentDate": "YYYY-MM-DD",
  "status": "string"
}
```

---

## Notes
- appointmentId là số nguyên tự tăng.
- status mặc định là "Pending".
- Định dạng ngày: YYYY-MM-DD.
- Định dạng giờ: HH:mm (24h).