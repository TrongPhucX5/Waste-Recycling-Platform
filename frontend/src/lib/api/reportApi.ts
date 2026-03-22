import { ApiError, apiClient } from "./client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export const reportApi = {
  /**
   * Creates a new waste report for a citizen.
   * @param formData The form data containing Latitude, Longitude, Description, Address, WasteCategoryId, and Images.
   */
  createWasteReport: async (formData: FormData) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE_URL}/reports/create`, {
      method: "POST",
      headers,
      body: formData,
    });

    let data: unknown;
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: string }).message)
          : `HTTP ${res.status}`;
      throw new ApiError(res.status, message, data);
    }

    return data;
  },

  /**
   * Fetches the waste reports created by the currently logged-in citizen.
   */
  getMyReports: (page = 1, pageSize = 10) => {
    return apiClient.get<{
      message: string;
      pagination: { page: number; pageSize: number; total: number; totalPages: number };
      reports: Array<{
        id: string;
        citizenName: string;
        categoryName: string;
        status: "Pending" | "Accepted" | "Assigned" | "Collected";
        address: string;
        createdAt: string;
        imageCount: number;
      }>;
    }>(`/reports/my-reports?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Fetches the detailed information of a specific waste report by ID.
   * @param id The unique identifier of the report.
   */
  getReportById: (id: string) => {
    return apiClient.get<{
      message: string;
      report: any;
    }>(`/reports/${id}`);
  },
};
