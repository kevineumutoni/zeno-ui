import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPage from './page';
jest.mock('next/image', () => {
  const NextImage: React.FC<{ src?: string; alt?: string; [key: string]: unknown }> = ({ alt = '', ...rest }) =>
    React.createElement('img', { alt, 'data-testid': 'mock-next-image', ...(rest as Record<string, unknown>) });
  NextImage.displayName = 'NextImageMock';
  return { __esModule: true, default: NextImage };
});
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));
jest.mock('../hooks/usePasswordReset', () => ({
  useFetchPasswordReset: jest.fn(),
}));
import { useFetchPasswordReset } from '../hooks/usePasswordReset';
type UseFetchReturn = {
  resetPassword: (email: string) => Promise<boolean | null> | null;
  isLoading: boolean;
  error: string | null;
};
const mockedUseFetch = useFetchPasswordReset as unknown as jest.MockedFunction<() => UseFetchReturn>;
describe('ResetPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders form elements', () => {
    mockedUseFetch.mockReturnValue({
      resetPassword: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetPage />);
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Email/i })).toBeInTheDocument();
  });
  test('shows validation error for invalid email and disables submit', async () => {
    mockedUseFetch.mockReturnValue({
      resetPassword: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetPage />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    await userEvent.type(emailInput, 'invalid-email');
    expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter a valid registered email.');
    const submitButton = screen.getByRole('button', { name: /Send Email/i });
    expect(submitButton).toBeDisabled();
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@example.com');
    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).toBeNull();
      expect(submitButton).not.toBeDisabled();
    });
  });
  test('submits valid email and shows success message when resetPassword resolves', async () => {
    const resetPasswordMock = jest.fn().mockResolvedValue(true);
    mockedUseFetch.mockReturnValue({
      resetPassword: resetPasswordMock,
      isLoading: false,
      error: null,
    });
    render(<ResetPage />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Send Email/i });
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith('user@example.com');
      expect(screen.getByText('Password reset link sent to your email!')).toBeInTheDocument();
    });
  });
  test('shows API error message when hook provides an error and no local error', async () => {
    const resetPasswordMock = jest.fn().mockResolvedValue(null);
    mockedUseFetch.mockReturnValue({
      resetPassword: resetPasswordMock,
      isLoading: false,
      error: 'Server error occurred',
    });
    render(<ResetPage />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Send Email/i });
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith('user@example.com');
      expect(screen.getByTestId('api-error-message')).toHaveTextContent('Server error occurred');
    });
  });
  test('renders loading state while isLoading is true', () => {
    mockedUseFetch.mockReturnValue({
      resetPassword: jest.fn(),
      isLoading: true,
      error: null,
    });
    render(<ResetPage />);
    expect(screen.getByText(/Sending reset link.../i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Email/i)).toBeNull();
  });
  test('back to login button calls router.push with /signin', async () => {
    mockedUseFetch.mockReturnValue({
      resetPassword: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetPage />);
    const backButton = screen.getByRole('button', { name: /Back to Login/i });
    await userEvent.click(backButton);
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/signin');
  });
});