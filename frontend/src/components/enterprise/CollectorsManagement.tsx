import React from "react";
import { Badge, Button, Card } from "../ui";
import { EnterpriseCollector } from "../../lib/api/enterpriseTaskApi";
import { Users, UserCheck, UserX } from "lucide-react";

interface CollectorsManagementProps {
  collectors: EnterpriseCollector[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
}

export const CollectorsManagement: React.FC<CollectorsManagementProps> = ({
  collectors,
  loading,
  error,
  onRefresh,
}) => {
  const availableCount = collectors.filter((collector) => collector.isAvailable).length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Collectors</h3>
            <p className="mt-1 text-sm text-gray-600">
              Track collector status and task workload in real time.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Add Collector
            </Button>
            <Button onClick={onRefresh} isLoading={loading}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Add/Edit/Delete collector actions are shown in UI, but backend endpoints for those actions are not implemented yet.
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-sky-600" />
            <div>
              <p className="text-sm text-gray-500">Total Collectors</p>
              <p className="text-2xl font-bold text-gray-900">{collectors.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-emerald-700">{availableCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <UserX className="h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm text-gray-500">Busy / Offline</p>
              <p className="text-2xl font-bold text-rose-700">{collectors.length - availableCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h4 className="font-semibold text-gray-900">Collector Directory</h4>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {collectors.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            No collectors found for this enterprise.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3">Collector</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Active Tasks</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {collectors.map((collector) => (
                  <tr key={collector.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{collector.name}</p>
                      <p className="text-xs text-gray-500">Joined {new Date(collector.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{collector.email}</p>
                      <p className="text-xs text-gray-500">{collector.phone || "No phone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={collector.isAvailable ? "success" : "warning"} size="sm">
                        {collector.isAvailable ? "Available" : "Busy"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{collector.taskCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" disabled>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
