import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetConfirmPage from './page';
jest.mock('next/image', () => {
  const MockImage: React.FC<Record<string, unknown>> = () => null;
  MockImage.displayName = 'NextImageMock';
  return { __esModule: true, default: MockImage };
});
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ uidb64: 'encoded-uid', token: 'reset-token' }),
}));
jest.mock('../../../hooks/useFetchPasswordResetConfirm', () => ({
  useFetchPasswordResetConfirm: jest.fn(),
}));
import { useFetchPasswordResetConfirm } from '../../../hooks/useFetchPasswordResetConfirm';
type UseFetchReturn = {
  resetConfirm: (uidb64: string, token: string, password: string, confirmPassword: string) => Promise<boolean | null> | null;
  isLoading: boolean;
  error: string | null;
};
const mockedUseFetch = useFetchPasswordResetConfirm as unknown as jest.MockedFunction<() => UseFetchReturn>;
describe('ResetConfirmPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  test('renders form elements', () => {
    mockedUseFetch.mockReturnValue({
      resetConfirm: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetConfirmPage />);
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });
  test('toggles password visibility for both fields', async () => {
    mockedUseFetch.mockReturnValue({
      resetConfirm: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetConfirmPage />);
    const pwdInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const confirmInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;
    const showButtons = screen.getAllByRole('button', { name: /Show password/i });
    expect(pwdInput.type).toBe('password');
    expect(confirmInput.type).toBe('password');
    await userEvent.click(showButtons[0]);
    expect(pwdInput.type).toBe('text');
    await userEvent.click(showButtons[1]);
    expect(confirmInput.type).toBe('text');
    const hideButtons = screen.getAllByRole('button', { name: /Hide password/i });
    await userEvent.click(hideButtons[0]);
    expect(pwdInput.type).toBe('password');
  });
  test('shows validation errors for weak password and mismatched confirm', async () => {
    mockedUseFetch.mockReturnValue({
      resetConfirm: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetConfirmPage />);
    const pwdInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(pwdInput, 'short');
    expect(screen.getByTestId('password-error')).toBeInTheDocument();
    expect(screen.getByTestId('password-error')).toHaveTextContent(
      'Password must be at least 8 characters, include a capital letter and a special character.'
    );
    await userEvent.clear(pwdInput);
    await userEvent.type(pwdInput, 'ValidPass!1');
    await userEvent.type(confirmInput, 'Different!1');
    expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Passwords do not match.');
  });
  test('continue button is disabled until valid and matching passwords are provided', async () => {
    mockedUseFetch.mockReturnValue({
      resetConfirm: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetConfirmPage />);
    const pwdInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm Password');
    const continueButton = screen.getByRole('button', { name: /Continue/i }) as HTMLButtonElement;
    expect(continueButton).toBeDisabled();
    await userEvent.type(pwdInput, 'ValidPass!1');
    expect(continueButton).toBeDisabled();
    await userEvent.type(confirmInput, 'ValidPass!1');
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
  });
  test('submits valid passwords and shows success', async () => {
    const resetConfirmMock = jest.fn().mockResolvedValue(true);
    mockedUseFetch.mockReturnValue({
      resetConfirm: resetConfirmMock,
      isLoading: false,
      error: null,
    });
    render(<ResetConfirmPage />);
    const pwdInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm Password');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await userEvent.type(pwdInput, 'ValidPass!1');
    await userEvent.type(confirmInput, 'ValidPass!1');
    await userEvent.click(continueButton);
    await waitFor(() => {
      expect(resetConfirmMock).toHaveBeenCalledWith('encoded-uid', 'reset-token', 'ValidPass!1', 'ValidPass!1');
      expect(screen.getByText('Password reset successful!')).toBeInTheDocument();
    });
  });
  test('shows API error message when hook provides an error and no validation errors', async () => {
    const resetConfirmMock = jest.fn().mockResolvedValue(null);
    mockedUseFetch.mockReturnValue({
      resetConfirm: resetConfirmMock,
      isLoading: false,
      error: 'Server failed to reset',
    });
    render(<ResetConfirmPage />);
    const pwdInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm Password');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await userEvent.type(pwdInput, 'ValidPass!1');
    await userEvent.type(confirmInput, 'ValidPass!1');
    await userEvent.click(continueButton);
    await waitFor(() => {
      expect(resetConfirmMock).toHaveBeenCalledWith('encoded-uid', 'reset-token', 'ValidPass!1', 'ValidPass!1');
      expect(screen.getByTestId('api-error-message')).toHaveTextContent('Server failed to reset');
    });
  });
  test('renders loading state when isLoading is true', () => {
    mockedUseFetch.mockReturnValue({
      resetConfirm: jest.fn(),
      isLoading: true,
      error: null,
    });
    render(<ResetConfirmPage />);
    expect(screen.getByText(/Resetting password.../i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Password')).toBeNull();
    expect(screen.queryByPlaceholderText('Confirm Password')).toBeNull();
  });
  test('cancel button calls router.push with /signin', async () => {
    mockedUseFetch.mockReturnValue({
      resetConfirm: jest.fn(),
      isLoading: false,
      error: null,
    });
    render(<ResetConfirmPage />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);
    expect(pushMock).toHaveBeenCalledWith('/signin');
  });
});