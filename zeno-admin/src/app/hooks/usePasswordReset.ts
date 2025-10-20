import { useState } from 'react';
import { fetchPasswordReset } from '../utils/fetchPasswordReset';

export function useFetchPasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function resetPassword(email: string) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPasswordReset(email);
      setIsLoading(false);
      return data;
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
      return null;
    }
  }

  return { resetPassword, isLoading, error };
}