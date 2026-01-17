"use client";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setOtp } from "@/lib/features/user/authSlice";

export default function OTP({ length = 4, onComplete }) {
  const [otp, setOtpLocal] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const dispatch = useDispatch();

  function handleChange(value, index) {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtpLocal(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      const finalOtp = newOtp.join("");
      dispatch(setOtp(finalOtp)); // ✅ store in redux once
      onComplete?.(finalOtp);
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("").slice(0, length);
    setOtpLocal(newOtp);

    newOtp.forEach((digit, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = digit;
      }
    });

    const finalOtp = newOtp.join("");
    dispatch(setOtp(finalOtp)); // ✅ store in redux
    onComplete?.(finalOtp);
  }

  return (
    <div className='flex gap-4' onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type='text'
          inputMode='numeric'
          maxLength={1}
          className='h-14 w-14 rounded-md border-2 border-gray-400 text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary'
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}
