
# API AppointmentManage API Documentation

## Base URL
```
/api/AppointmentManage
```

---

## 1. Get All Appointments By Condition
**GET** `/api/AppointmentManage/getAllByCondition?status={status}&day={day}&month={month}&year={year}&page={page}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| status | string | No | Appointment status |
| day | int | No | Day |
| month | int | No | Month |
| year | int | No | Year |
| page | int | Yes | Page number |

**Response Example:**
```json
[
  {
    "appointmentId": 1,
    "patientId": "P001",
    "appointmentDate": "2025-01-01",
    "status": "Pending"
  }
]
```

---

## 2. Get Appointment Detail
**GET** `/api/AppointmentManage/getDetailByAppointmentId?appointmentId={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| appointmentId | int | Yes | Appointment ID |

**Response Example:**
```json
{
  "appointmentId": 1,
  "patientId": "P001",
  "appointmentDate": "2025-01-01",
  "status": "Pending"
}
```

---

## 3. Update Status
**PUT** `/api/AppointmentManage/updateStatus?id={id}&status={status}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | int | Yes | Appointment ID |
| status | string | Yes | New status (Confirmed/Cancelled/Completed/Rejected) |

**Response:**
204 No Content

---

## Appointment Entity Structure
```json
{
  "appointmentId": 1,
  "patientId": "string",
  "appointmentDate": "YYYY-MM-DD",
  "status": "Pending|Confirmed|Completed|Cancelled|Rejected",
  "start_Time": "HH:mm",
  "end_Time": "HH:mm"
}
```

---

## Notes
- Các endpoint này yêu cầu quyền Manager.
- status có thể là: Pending, Confirmed, Completed, Cancelled, Rejected.
- Định dạng ngày: YYYY-MM-DD.