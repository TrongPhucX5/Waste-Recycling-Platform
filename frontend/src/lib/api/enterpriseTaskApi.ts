import { ApiError, apiClient } from "./client";

export interface EnterpriseTaskReport {
  id: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  categoryName: string | null;
  citizenName: string;
  citizenPhone: string | null;
}

export interface EnterpriseCollectionTask {
  id: string;
  reportId: string;
  enterpriseId: string;
  collectorId: string | null;
  collectorName: string | null;
  collectorPhone: string | null;
  status: "Assigned" | "OnTheWay" | "Collected";
  collectedWeightKg: number | null;
  notes: string | null;
  assignedAt: string;
  completedAt: string | null;
  report: EnterpriseTaskReport;
}

export interface EnterpriseCollector {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isAvailable: boolean;
  createdAt: string;
  taskCount: number;
}

export interface EnterpriseTaskStats {
  totalTasks: number;
  totalUnassigned: number;
  totalAssigned: number;
  totalOnTheWay: number;
  totalCollected: number;
  totalWeightKg: number;
}

export const enterpriseTaskApi = {
  /**
   * Fetches collection tasks for the current enterprise
   */
  getTasks: (status?: string, unassignedOnly?: boolean) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (unassignedOnly) params.append("unassigned", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<EnterpriseCollectionTask[]>(`/enterprise/tasks${query}`);
  },

  /**
   * Assign a collector to a task
   */
  assignCollector: (taskId: string, collectorId: string) => {
    return apiClient.put<{ message: string; taskId: string; collectorId: string }>(
      `/enterprise/tasks/${taskId}/assign-collector`,
      { collectorId }
    );
  },

  /**
   * Get available collectors for this enterprise
   */
  getAvailableCollectors: () => {
    return apiClient.get<EnterpriseCollector[]>(`/enterprise/tasks/collectors`);
  },

  /**
   * Get statistics for enterprise tasks
   */
  getStats: () => {
    return apiClient.get<EnterpriseTaskStats>(`/enterprise/tasks/stats`);
  },
};
