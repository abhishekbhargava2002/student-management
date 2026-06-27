import { useCallback } from 'react';
import { apiRequest } from '../utils/api';

export function useApi() {
  return useCallback((path, options) => apiRequest(path, options), []);
}
