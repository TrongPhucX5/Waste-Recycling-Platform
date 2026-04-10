import { apiClient } from './client';

export interface EnterpriseProfile {
  id: string;
  companyName: string;
  serviceArea?: string;
  capacityKgPerDay?: number;
  status: 'Pending' | 'Verified' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface ProfileDetailResponse {
  success: boolean;
  message: string;
  data?: EnterpriseProfile;
}

export const enterpriseApi = {
  // Get current enterprise profile
  async getProfile(): Promise<EnterpriseProfile> {
    try {
      const response = await apiClient.get<ProfileDetailResponse>(
        '/api/enterprise/me'
      );
      
      if (!response.data) {
        throw new Error('Profile not found');
      }
      
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch profile'
      );
    }
  },
};