"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchLogin } from "../hooks/useFetchLogin";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as gtag from "../../../lib/gtag";

function getFriendlyErrorMessage(error: unknown) {
  if (!error) return null;
  if (typeof error === "string") {
    if (error.includes("Invalid credentials")) {
      return "The email or password you entered is incorrect.";
    }
    return error;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: string }).message === "string" &&
    (error as { message?: string }).message!.includes("Invalid credentials")
  ) {
    return "The email or password you entered is incorrect.";
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    (error as { error?: unknown }).error === "Invalid credentials"
  ) {
    return "The email or password you entered is incorrect.";
  }
  return "An unknown error occurred. Please try again.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { login, isLoading, error } = useFetchLogin();
  const router = useRouter();

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    setLocalError(null);
    setSuccess(null);
  }
  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    setLocalError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }
    const result = await login(email, password);
    if (result && !error) {
      gtag.event({
        action: "user_login",
        category: "auth",
        label: `${email} (${result.role})`,
      });
      setSuccess("Login successful!");
      setTimeout(() => {
        if (result.role === "Admin") {
          router.push("/dashboard");
        } else if (result.role === "User") {
          router.push("/chat");
        }
      }, 1200);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-white text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover">
      <div className="2xl:w-250 xl:w-150 xl:px-10 2xl:px-30 2xl:h-190 rounded-2xl flex flex-col items-center px-30 py-14 bg-black/0 border border-gray-600 shadow-lg shadow-gray-600">
        <h2 className="2xl:text-[50px] lg:text-[30px] xl:text-[40px] lg:mb-10 sm:text-2xl xl:mb-10 font-bold text-cyan-200 2xl:mb-28 w-full text-left">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
          <div className="relative flex items-center border-b border-white/60">
            <MailOutlineIcon className="text-white mr-3 " />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative mb-15 flex items-center border-b border-white/60">
            <LockOutlinedIcon className="text-white mr-3" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="bg-transparent w-full py-3 pl-0 pr-3 text-white placeholder:text-white/70 text-[20px] outline-none"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              tabIndex={-1}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? (
                <VisibilityOffOutlinedIcon className="text-white cursor-pointer" />
              ) : (
                <VisibilityOutlinedIcon className="text-white cursor-pointer" />
              )}
            </button>
          </div>
          <div className="text-right w-full">
            <span
              className="text-cyan-200 text-base cursor-pointer text-[20px] hover:underline"
              onClick={() => router.push("/reset")}
            >
              Forgot password?
            </span>
          </div>
          <div className="flex w-full justify-center">
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="bg-cyan-200 w-100 text-[#0B182F] rounded-[10px] py-3 text-[22px] font-semibold mt-2 transition-all flex justify-center cursor-pointer"
            >
              Sign In
            </button>
          </div>
          {(localError || error) && (
            <div
              className="text-red-400 text-center text-base mt-2 "
              data-testid="error-message"
            >
              {localError || getFriendlyErrorMessage(error)}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-center mt-2 text-base ">
              {success}
            </div>
          )}
        </form>
        <div className="xl:mt-10 lg:mt-2">
          <span className="text-white xl:text-xl lg:text-md">
            Do not have an account?{" "}
            <span
              className="text-[#9FF8F8] cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
