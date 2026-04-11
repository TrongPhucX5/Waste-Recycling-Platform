import { apiClient } from './client';

export interface EnterpriseProfileData {
  companyName: string;
  address?: string;
  phoneNumber?: string;
  serviceArea?: string;
  capacityKgPerDay?: number;
}

export interface ProfileResponse {
  message?: string;
  data?: any;
}

export const enterpriseProfileApi = {
  // Update enterprise profile
  async updateProfile(data: EnterpriseProfileData): Promise<void> {
    const response = await apiClient.post<ProfileResponse>(
      '/api/enterprise/profile', 
      {
        companyName: data.companyName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        serviceArea: data.serviceArea,
        capacityKgPerDay: data.capacityKgPerDay,
      }
    );
    
    // Kiểm tra phản hồi từ server
    // Vì apiClient của bạn trả về thẳng data, nên ta check response.message
    if (response?.message && 
        !response.message.toLowerCase().includes('success') && 
        !response.message.toLowerCase().includes('updated')) {
      throw new Error(response.message || 'Failed to update profile');
    }
  },
};