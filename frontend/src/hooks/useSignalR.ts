import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from '@/lib/api/config';

interface UseSignalRProps {
  enabled: boolean;
  onTaskStatusUpdated?: (taskId: string, status: string) => void;
  onError?: (error: Error) => void;
}

export const useSignalR = ({ enabled, onTaskStatusUpdated, onError }: UseSignalRProps) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_CONFIG.SERVER_URL}/hubs/notification`)
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