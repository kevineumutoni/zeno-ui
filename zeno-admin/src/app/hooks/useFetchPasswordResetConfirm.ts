import { useState } from 'react';
import { fetchPasswordResetConfirm } from '../utils/fetchPasswordResetConfirm';

export function useFetchPasswordResetConfirm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function resetConfirm(uidb64: string, token: string, newPassword: string, confirmPassword: string) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPasswordResetConfirm(uidb64, token, newPassword, confirmPassword);
      setIsLoading(false);
      return data;
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
      return null;
    }
  }

  return { resetConfirm, isLoading, error };
}