// src/services/patientService.ts
import { api } from './api';

export interface UpdatePatientPayload {
  PatientName: string; 
  Gender: string;      
  Birthday: string;    // DateOnly (YYYY-MM-DD)
  PhoneNumber: string; // Cho phép chỉnh sửa
  CCCD?: string | null;
}

export interface AddPatientPayload {
  PatientName: string; // [Required] StringLength(100)
  Gender: string;      // [Required]
  Birthday: string;    // [Required] DateOnly (YYYY-MM-DD)
  PhoneNumber: string; // [Required] StringLength(10)
  CCCD?: string | null;// Optional
}

export interface PatientInfoDto {
  patientName: string; // JSON trả về thường là camelCase, nhưng nếu config C# giữ nguyên PascalCase thì sửa thành PatientName
  gender: string;
  birthday: string;
  phoneNumber: string;
  cccd?: string | null;
}

export const patientApi = {
  // Hàm nhận thêm accessToken để truyền vào header
  addInformation: (payload: AddPatientPayload, token: string) => {
    return api.post('/PatientInformation/add', payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

getDetail: (id: string, token: string) => {
  // API yêu cầu query param id: /PatientInformation/getDetail?id=...
  return api.get<PatientInfoDto>(`/PatientInformation/getDetail?id=${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
},

updateInformation: (payload: UpdatePatientPayload, token: string) => {
  return api.put('/PatientInformation/update', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
};


