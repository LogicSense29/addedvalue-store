"use client";
import { useRef, useState } from "react";

export default function OTPInput({ length = 4, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  function handleChange(value, index) {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);

    newOtp.forEach((digit, i) => {
      inputsRef.current[i].value = digit;
    });

    onComplete(newOtp.join(""));
  }

  return (
    <div className='flex w-full gap-6' onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type='text'
          inputMode='numeric'
          maxLength={1}
          className='w-full h-15 text-center text-xl border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}
