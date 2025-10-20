'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchPasswordReset } from '../hooks/usePasswordReset';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { resetPassword, isLoading, error } = useFetchPasswordReset();
  const router = useRouter();

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setSuccess(null);

    if (value === '') {
      setLocalError('Please enter a valid registered email.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setLocalError('Please enter a valid registered email.');
    } else {
      setLocalError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);

    if (!email) {
      setLocalError('Please enter a valid registered email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid registered email.');
      return;
    }

    const result = await resetPassword(email);
    if (result && !error) {
      setSuccess('Password reset link sent to your email!');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-white text-base">Sending reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-cover">
      <div className="absolute bottom-4 right-4 w-64 h-95 opacity-80 pointer-events-none">
        <Image
          src="/images/robot.png"
          alt="Robot"
          width={256}
          height={296}
          className="object-contain"
        />
      </div>

      <div className="2xl:w-250 xl:w-150 xl:px-10 2xl:px-30 2xl:h-150 rounded-2xl flex flex-col items-center px-30 py-14 bg-black/0 border border-gray-600 shadow-lg shadow-gray-600">
        <h2 className="2xl:text-[50px] lg:text-[30px] xl:text-[40px] lg:mb-10 sm:text-2xl xl:mb-10 font-bold text-cyan-200 2xl:mb-28 w-full text-left">
          Forgot Password
        </h2>
        <p className="text-white/80 mb-8 text-center">
          Enter your email so that we can send you password reset link
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
          <div className="relative flex items-center border-b border-white/60">
            <MailOutlineIcon className="text-white mr-3" />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Email"
              required
            />
          </div>
          {localError && (
            <div className="text-red-400 text-left text-base" data-testid="error-message">
              {localError}
            </div>
          )}
          <div className="flex w-full justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="border border-cyan-200 text-cyan-200 rounded-[10px] py-3 px-6 text-[20px] font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
              Back to Login
            </button>
            <button
              type="submit"
              disabled={isLoading || !!localError || !email.trim()}
              className="bg-cyan-200 text-[#0B182F] rounded-[10px] py-3 px-6 text-[20px] font-semibold transition-all flex justify-center cursor-pointer"
            >
              Send Email
            </button>
          </div>
          {error && !localError && (
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