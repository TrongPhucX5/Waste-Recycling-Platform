import { apiClient } from './client';

export interface SystemSettings {
  systemName: string;
  supportEmail: string;
  supportPhone: string;
  pointsPerValidReport: number;
  pointsForCorrectClassification: number;
  pointsForFastProcessing: number;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data?: SystemSettings;
}

export const settingsApi = {
  // Get all system settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await apiClient.get<SettingsResponse>('/api/admin/settings');
      
      return response?.data || {
        systemName: 'CWCRP Platform',
        supportEmail: 'support@cwcrp.com',
        supportPhone: '+84 123 456 789',
        pointsPerValidReport: 30,
        pointsForCorrectClassification: 20,
        pointsForFastProcessing: 10,
      };
    } catch (error) {
      // Return default values if API not implemented yet
      return {
        systemName: 'CWCRP Platform',
        supportEmail: 'support@cwcrp.com',
        supportPhone: '+84 123 456 789',
        pointsPerValidReport: 30,
        pointsForCorrectClassification: 20,
        pointsForFastProcessing: 10,
      };
    }
  },

  // Update system settings
  async updateSettings(settings: SystemSettings): Promise<SystemSettings> {
    const response = await apiClient.post<SettingsResponse>(
      '/api/admin/settings',
      settings
    );
    
    return response?.data || settings;
  },
};