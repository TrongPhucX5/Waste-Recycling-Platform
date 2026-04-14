import { apiClient } from './client';

export interface Complaint {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  reportId?: string;
  enterpriseId?: string;
}

export interface ComplaintsResponse {
  items: Complaint[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const complaintApi = {
  getMyComplaints: async (page = 1, pageSize = 10, status?: string): Promise<ComplaintsResponse> => {
    let url = `/complaints?page=${page}&pageSize=${pageSize}`;
    if (status) url += `&status=${status}`;
    const response = await apiClient.get<{ data: ComplaintsResponse }>(url);
    return response.data;
  },

  createComplaint: async (data: { content: string; reportId?: string; enterpriseId?: string }) => {
    return apiClient.post('/complaints', data);
  },
};
