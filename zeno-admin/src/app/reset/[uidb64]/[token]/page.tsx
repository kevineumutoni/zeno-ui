'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFetchPasswordResetConfirm } from '../../../hooks/useFetchPasswordResetConfirm';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Image from 'next/image';

export default function ResetConfirmPage() {
  const { uidb64, token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { resetConfirm, isLoading, error } = useFetchPasswordResetConfirm();
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!hasMinLength || !hasUppercase || !hasSpecialChar) {
      return 'Password must be at least 8 characters, include a capital letter and a special character.';
    }
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setSuccess(null);

    const pwdError = validatePassword(value);
    setPasswordError(pwdError);

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else if (confirmPassword) {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setSuccess(null);

    if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    const pwdError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match.' : null;

    setPasswordError(pwdError);
    setConfirmPasswordError(confirmError);

    if (pwdError || confirmError || !password || !confirmPassword) {
      return;
    }

    const result = await resetConfirm(
      uidb64 as string,
      token as string,
      password,
      confirmPassword
    );

    if (result && !error) {
      setSuccess('Password reset successful!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-white text-base">Resetting password...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-cover">
      <div className="absolute bottom-4 right-4 w-64 h-94 opacity-80 pointer-events-none">
        <Image
          src="/images/robot.png"
          alt="Robot"
          width={256}
          height={206}
          className="object-contain"
        />
      </div>

      <div className="2xl:w-250 xl:w-150 xl:px-10 2xl:px-30 2xl:h-170 rounded-2xl flex flex-col items-center px-30 py-14 bg-black/0 border border-gray-600 shadow-lg shadow-gray-600">
        <h2 className="2xl:text-[50px] lg:text-[30px] xl:text-[40px] lg:mb-10 sm:text-2xl xl:mb-10 font-bold text-cyan-200 2xl:mb-28 w-full text-left">
          Reset Password
        </h2>
        <p className="text-white/80 mb-8 text-center">Kindly set your new password</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
          <div className="relative flex items-center border-b border-white/60">
            <LockOutlinedIcon className="text-white mr-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <VisibilityOffOutlinedIcon className="text-white cursor-pointer" />
              ) : (
                <VisibilityOutlinedIcon className="text-white cursor-pointer" />
              )}
            </button>
          </div>
          {passwordError && (
            <div className="text-red-400 text-left text-base" data-testid="password-error">
              {passwordError}
            </div>
          )}

          <div className="relative flex items-center border-b border-white/60">
            <LockOutlinedIcon className="text-white mr-3" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(v => !v)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <VisibilityOffOutlinedIcon className="text-white cursor-pointer" />
              ) : (
                <VisibilityOutlinedIcon className="text-white cursor-pointer" />
              )}
            </button>
          </div>
          {confirmPasswordError && (
            <div className="text-red-400 text-left text-base" data-testid="confirm-password-error">
              {confirmPasswordError}
            </div>
          )}

          <div className="flex w-full justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="border border-cyan-200 text-cyan-200 rounded-[10px] py-3 px-6 text-[20px] font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !!passwordError || !!confirmPasswordError || !password || !confirmPassword}
              className="bg-cyan-200 text-[#0B182F] rounded-[10px] py-3 px-6 text-[20px] font-semibold transition-all flex justify-center cursor-pointer"
            >
              Continue
            </button>
          </div>

          {error && !passwordError && !confirmPasswordError && (
            <div className="text-red-400 text-center text-base mt-2" data-testid="api-error-message">
              {typeof error === 'string' ? error : error?.message || 'An unknown error occurred.'}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-center mt-2 text-base">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}