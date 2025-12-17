import { api } from './api';

export interface CreateAppointmentRequest {
    patientId: string;   // ZaloId hoặc User ID
    time_Start: string;  // ISO 8601: "2025-12-17T08:00:00"
    time_End: string;    // ISO 8601: "2025-12-17T08:10:00"
  }

  export const appointmentApi = {
    createAppointment: (payload: CreateAppointmentRequest, token: string) => {
    return api.post('/Appointment/add', payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};