# API PatientInformation API Documentation

## Base URL
```
/api/PatientInformation
```

---

## 1. Create Patient Information
**POST** `/api/PatientInformation/add`

**Request Body Example:**
```json
{
  "patientId": "P001",
  "patientName": "Nguyen Van A",
  "gender": "Male",
  "birthday": "1990-01-01",
  "phoneNumber": "0123456789",
  "cccd": "123456789"
}
```

**Response Example:**
```json
{
  "message": "Patient information created successfully"
}
```

---

## 2. Get Patient Information Detail
**GET** `/api/PatientInformation/getDetail?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Patient ID |

**Response Example:**
```json
{
  "patientId": "P001",
  "patientName": "Nguyen Van A",
  "gender": "Male",
  "birthday": "1990-01-01",
  "phoneNumber": "0123456789",
  "cccd": "123456789"
}
```

---

## 3. Update Patient Information
**PUT** `/api/PatientInformation/update?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Patient ID |

**Request Body Example:**
```json
{
  "patientId": "P001",
  "patientName": "Nguyen Van A",
  "gender": "Male",
  "birthday": "1990-01-01",
  "phoneNumber": "0123456789",
  "cccd": "123456789"
}
```

**Response Example:**
```json
{
  "patientId": "P001",
  "patientName": "Nguyen Van A",
  "gender": "Male",
  "birthday": "1990-01-01",
  "phoneNumber": "0123456789",
  "cccd": "123456789"
}
```

---

## 4. Delete Patient Information
**DELETE** `/api/PatientInformation/delete?id={id}`

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Patient ID |

**Response:**
204 No Content

---

## PatientInformation Entity Structure
```json
{
  "patientId": "string",
  "patientName": "string",
  "gender": "Male|Female|Other",
  "birthday": "YYYY-MM-DD",
  "phoneNumber": "string",
  "cccd": "string"
}
```

## PatientInfoDto Structure
```json
{
  "patientName": "string",
  "gender": "Male|Female|Other",
  "phoneNumber": "string",
  "birthDay": "YYYY-MM-DD"
}
```

---

## Notes
- Các trường bắt buộc: patientId, patientName, phoneNumber.
- Định dạng ngày: YYYY-MM-DD.
- Số điện thoại tối đa 10 ký tự.
