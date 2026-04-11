import { apiClient } from "./client";

export interface EnterpriseListItem {
  id: string;
  companyName: string;
  userEmail?: string;
  serviceArea?: string;
  status: "Pending" | "Verified" | "Rejected";
  rejectionReason?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface EnterpriseDetail {
  id: string;
  userId: string;
  userEmail?: string;
  userFullName?: string;
  companyName: string;
  serviceArea?: string;
  capacityKgPerDay?: number;
  status: "Pending" | "Verified" | "Rejected";
  rejectionReason?: string;
  isVerified: boolean;
  createdAt: string;
  collectorCount: number;
  wasteTypeCount: number;
}

export const enterpriseAdminApi = {
  /**
   * Get all enterprises with pagination and filtering
   */
  getEnterprises: (
    page = 1,
    pageSize = 10,
    isVerified?: boolean,
    searchTerm?: string
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
    if (isVerified !== undefined) {
      params.append("isVerified", isVerified.toString());
    }
    if (searchTerm) {
      params.append("searchTerm", searchTerm);
    }

    return apiClient.get<{
      message: string;
      data: EnterpriseListItem[];
      pagination: {
        total: number;
        totalPages: number;
        page: number;
        pageSize: number;
      };
    }>(`/api/admin/enterprises?${params.toString()}`);
  },

  /**
   * Get enterprise detail by ID
   */
  getEnterpriseDetail: (enterpriseId: string) => {
    return apiClient.get<{
      message: string;
      data: EnterpriseDetail;
    }>(`/api/admin/enterprises/${enterpriseId}`);
  },

  /**
   * Verify/Approve an enterprise
   */
  verifyEnterprise: (enterpriseId: string) => {
    return apiClient.post<{
      message: string;
      data: { enterpriseId: string };
    }>(`/api/admin/enterprises/${enterpriseId}/verify`, {});
  },

  /**
   * Reject an enterprise with reason
   */
  rejectEnterprise: (enterpriseId: string, reasonForRejection: string) => {
    return apiClient.post<{
      message: string;
      data: { enterpriseId: string };
    }>(`/api/admin/enterprises/${enterpriseId}/reject`, {
      reasonForRejection,
    });
  },
};
