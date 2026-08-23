import { api } from './api';

export interface StatusDto {
    id: number;
    name: string;
    appointments?: any;
}

export interface PatientInformationDto {
    zaloId: string;
    patientName: string;
    gender: string;
    birthday: string;
    phoneNumber: string;
    cccd?: string;
}

export interface AdminAppointmentDto {
    appointmentId: number;
    patientId: string;
    statusId: number;
    status: string;
    timeStart: string;
    timeEnd: string;
    patientInformation?: {
        fullName?: string;
    };
}

// Interface map với Class C# WorkingHour
export interface WorkingHourDto {
    workingId: number;
    mor_Start: string; // TimeOnly trả về string "HH:mm:ss"
    mor_End: string;
    aff_Start: string;
    aff_End: string;
    duration: number;
}

export interface AdminFilterParams {
    page: number;
    statusId?: number;
    fromDate?: string;
    toDate?: string;
    date?: string;
}

export const adminApi = {
    getAllStatuses: (token: string) => {
        return api.get<StatusDto[]>('/Status/getAll', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    getAllBookings: (params: AdminFilterParams, token: string) => {
        const query = new URLSearchParams();
        query.append('page', params.page.toString());
        
        if (params.statusId !== undefined && params.statusId !== null) {
            query.append('statusId', params.statusId.toString());
        }

        if (params.date) {
            query.append('Date', params.date);
        } else if (params.fromDate && params.toDate) {
            query.append('fromDate', params.fromDate);
            query.append('toDate', params.toDate);
        }
        
        return api.get<AdminAppointmentDto[]>(`/Appointment/getAllByFilter?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    updatePendingCancel: (id: number, token: string) => {
        return api.patch(`/Appointment/updatePendingCancel?appointmentId=${id}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    updateConfirmPending: (id: number, token: string) => {
        return api.patch(`/Appointment/updateConfirmPending?appointmentId=${id}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    getPatientDetail: (appointmentId: number, token: string) => {
        return api.get<PatientInformationDto>(`/Appointment/getPatientById?appointmentId=${appointmentId}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    // Lấy chi tiết giờ làm việc
    getWorkingHours: (token: string) => {
        return api.get<WorkingHourDto>('/WorkingHour/getDetail', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    // ✅ THÊM MỚI: Cập nhật giờ làm việc
    // Endpoint: /api/WorkingHour/Update
    updateWorkingHour: (data: WorkingHourDto, token: string) => {
        return api.put<WorkingHourDto>('/WorkingHour/Update', data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
};