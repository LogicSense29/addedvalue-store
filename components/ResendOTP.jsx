"use client";
import { useState, useEffect } from "react";

export default function ResendOTP({userEmail}) {
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      // Decrease seconds every 1000ms
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(timer);
    }

    // Cleanup the timer if the component unmounts
    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = async () => {
    // Reset state
    setSeconds(60);
    setCanResend(false);

    // Call your API here
    console.log("Resending OTP...");
          try {
         await fetch("/api/auth/send-otp", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email : userEmail }),
         });
          } catch (error) {
            console.log("From Confirm Email", error);
          }
    // await fetch('/api/auth/resend-otp', { ... })
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        onClick={handleResend}
        disabled={!canResend}
        className={`px-4 py-2 rounded ${
          canResend
            ? "bg-primary text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}>
        Resend OTP
      </button>

      {!canResend && (
        <p className='text-sm text-gray-600'>
          Resend available in <strong>{seconds}s</strong>
        </p>
      )}
    </div>
  );
}
