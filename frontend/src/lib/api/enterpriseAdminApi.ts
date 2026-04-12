import { apiClient } from "./client";

export interface EnterpriseListItem {
  id: string;
  companyName: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  serviceArea?: string;
  createdAt: string;
}

export const enterpriseAdminApi = {
  getEnterprises: (page: number, pageSize: number, isVerified?: boolean, search?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (isVerified !== undefined) params.append('isVerified', isVerified.toString());
    if (search) params.append('search', search);
    
    return apiClient.get<any>(`/admin/enterprises?${params.toString()}`);
  },
  
  getEnterpriseDetail: (id: string) => {
    return apiClient.get<any>(`/admin/enterprises/${id}`);
  },

  verifyEnterprise: (id: string) => {
    return apiClient.post<any>(`/admin/enterprises/${id}/verify`, {});
  },

  rejectEnterprise: (id: string, reason: string) => {
    return apiClient.post<any>(`/admin/enterprises/${id}/reject`, { reason });
  }
};