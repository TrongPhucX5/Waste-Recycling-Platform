import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseSignalRProps {
  enabled: boolean;
  onTaskStatusUpdated?: (taskId: string, status: string) => void;
  onComplaintResolved?: (complaintId: string, message: string, adminResponse: string) => void;
  onError?: (error: Error) => void;
}

export const useSignalR = ({ enabled, onTaskStatusUpdated, onComplaintResolved, onError }: UseSignalRProps) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/hubs/notification`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [enabled]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR Hub');
          if (onTaskStatusUpdated) {
            connection.on('ReceiveTaskUpdate', (taskId: string, status: string) => {
              onTaskStatusUpdated(taskId, status);
            });
          }
          if (onComplaintResolved) {
            connection.on('ComplaintResolved', (payload: any) => {
              const complaintId = payload?.complaintId ?? payload?.id ?? '';
              const message = payload?.message ?? '';
              const adminResponse = payload?.adminResponse ?? '';
              try {
                onComplaintResolved(complaintId, message, adminResponse);
              } catch (e) {
                console.error('onComplaintResolved handler error', e);
              }
            });
          }
        })
        .catch((e) => {
          console.error('Connection failed: ', e);
          if (onError) onError(e);
        });
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection, onTaskStatusUpdated, onError]);

  return { connection };
};