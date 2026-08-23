// src/services/appointmentService.ts
import { api } from './api';

export interface CreateAppointmentRequest {
    patientId: string;   
    time_Start: string;  
    time_End: string;    
}

export interface StatusDto {
    id: number;
    name: string;
    appointments?: any;
}

export interface AppointmentDto {
    appointmentId: number;
    patientId: string;
    statusId: number;
    status: string;
    timeStart: string; 
    timeEnd: string;   
    patientInformation?: any;
}

export interface AppointmentFilterParams {
    zaloId?: string;
    page: number;
    statusId?: number;
    fromDate?: string; 
    toDate?: string;   
    date?: string;     
}

export const appointmentApi = {
    getAllStatuses: (token: string) => {
        return api.get<StatusDto[]>('/Status/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    createAppointment: (payload: CreateAppointmentRequest, token: string) => {
        return api.post('/Appointment/add', payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    getAppointmentsByFilter: (params: AppointmentFilterParams, token: string) => {
        const query = new URLSearchParams();
        
        if (params.zaloId) query.append('zaloId', params.zaloId);
        query.append('page', params.page.toString());
        
        if (params.statusId !== undefined && params.statusId !== null) {
            query.append('statusId', params.statusId.toString());
        }

        if (params.fromDate) query.append('fromDate', params.fromDate);
        if (params.toDate) query.append('toDate', params.toDate);
        if (params.date) query.append('Date', params.date);

        return api.get<AppointmentDto[]>(`/Appointment/getAllByFilter?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    // ✅ THÊM MỚI: API cập nhật trạng thái hủy (PATCH)
    updateSelfCancel: (appointmentId: number, token: string) => {
        // Lưu ý: api.patch(url, data, config). 
        // Vì params nằm trên URL nên data ta truyền null hoặc {}
        return api.patch(`/Appointment/updateSelfCancel?appointmentId=${appointmentId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    updateWait: (appointmentId: number, token: string) => {
        return api.patch(`/Appointment/updateWait?appointmentId=${appointmentId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};