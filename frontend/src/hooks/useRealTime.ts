import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8000';

export const useRealTime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to real-time server');
    });

    socket.on('data_updated', (data) => {
      console.log('Data updated, invalidating queries...', data);
      queryClient.invalidateQueries();
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
