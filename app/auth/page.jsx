"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Logo from "@/components/Logo";
import Image from "next/image";
import OTP from "@/components/OTP";
import { useSelector, useDispatch } from "react-redux";
import { setEmail, setLoading, setStep, setPassword, setFlow } from "@/lib/features/user/authSlice";
import { userData as setUserData } from "@/lib/features/user/userSlice";
import ResendOTP from "@/components/ResendOTP";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const step = useSelector((state) => state.auth.step);
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!email && step !== 'EMAIL') {
        dispatch(setStep('EMAIL'));
    }
  }, [email, step, dispatch]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white px-4'>
      {/* Container */}
      <div className='w-full max-w-md text-center'>
        {/* Logo */}
        <div className='mb-8 flex flex-col items-center '>
          <Image src={assets.logo} className='w-20 mb-2' />
          <h1 className='text-xl font-semibold text-gray-900'>
            Welcome to AddedValue Store
          </h1>
            <p className='mt-2 text-sm text-gray-600'>
            {step == 'OTP' ? 'Check Email for OTP' : 'Use your email to log in or sign up.'}
          </p>
        </div>

        {/* Form */}
        <form className='space-y-6'>
          {step == "EMAIL" && <EmailInput />}
          {step == "OTP" && <OtpInput />}
          {step == "SET_PASSWORD" && <SetPasswordInput callbackUrl={callbackUrl} />}
          {step == "PASSWORD" && <PasswordInput callbackUrl={callbackUrl} />}
        </form>

        {/* Help */}
        <p className='mt-10 text-xs text-gray-500'>
          Need help? contact{"  "}
          <span className='font-medium underline text-red-500'>Help</span>.
        </p>

        {/* Footer Logo */}
        <div className='mt-6 flex justify-center'>
          {/* <span className='text-lg font-bold tracking-wide'>
            AddedValue<span className='text-orange-500'>+</span>
          </span> */}
          <Logo />
        </div>
      </div>
    </div>
  );
}




function PasswordInput({ callbackUrl }) {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch();
  const router = useRouter();
  const { email, password } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);
  const [resetLoading, setResetLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      dispatch(setLoading(true));

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Login successful!");
          dispatch(setUserData(data.user));
          router.push(callbackUrl);
        } else {
          toast.error(data.error || "Login failed");
        }
      } catch (error) {
        toast.error("An error occurred during login");
      } finally {
        dispatch(setLoading(false));
      }
    };

    const handleForgotPassword = async () => {
        setResetLoading(true);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, purpose: 'RESET_PASSWORD' }),
            });
            
            const data = await res.json();

            if (res.ok) {
                dispatch(setFlow("RESET"));
                dispatch(setStep("OTP"));
                toast.success("OTP sent to your email");
            } else {
                console.log("FORGOT_PASSWORD_ERROR", res.status, data);
                toast.error(data.error || "Failed to send OTP");
            }
        } catch (error) {
            toast.error("Failed to send OTP");
        } finally {
             setResetLoading(false);
        }
    }

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <label
            htmlFor='identifier'
            className='block text-left text-sm font-semibold text-gray-700'>
            Password
            <span className='text-red-500'>*</span>
        </label>
        <button 
            type="button" 
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
            {resetLoading && <Loader2 size={12} className="animate-spin" />}
            Forgot Password?
        </button>
      </div>

      <div className='flex relative items-center'>
        <input
          id='identifier'
          type={showPassword ? "text" : "password"}
          placeholder=''
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          className='w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
        />
        {showPassword ? (
          <Eye
            strokeWidth={1.5}
            className='absolute right-3 text-gray-600 cursor-pointer'
            width={20}
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeOff
            strokeWidth={1.5}
            className='absolute right-3 text-gray-600 cursor-pointer'
            width={20}
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>

      <button
        type='button'
        disabled={loading}
        className='w-full rounded-md bg-primary py-3 text-white font-semibold hover:bg-orange-600 transition'
        onClick={handleLogin}>
        {loading ? (
          <Loader2 className='h-5 w-5 animate-spin text-white' />
        ) : (
          "Continue"
        )}
      </button>
    </>
  );
}

function SetPasswordInput({ callbackUrl }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { email, password, flow } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
        let res;
        if (flow === 'RESET') {
             res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              });
        } else {
            // SIGNUP
            res = await fetch("/api/auth/set-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              });
        }
      
      const data = await res.json();

      if (res.ok) {
        toast.success(flow === 'RESET' ? "Password reset successfully! Please login." : "Profile created successfully!");
        
        if (flow === 'RESET') {
             dispatch(setStep("PASSWORD"));
             dispatch(setFlow("LOGIN"));
        } else {
             dispatch(setUserData(data.user));
             router.push(callbackUrl);
        }
       
      } else {
        toast.error(data.error || "Failed to set password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <label
        htmlFor='identifier'
        className='block text-left text-sm font-semibold text-gray-700 mb-1'>
        {flow === 'RESET' ? 'New Password' : 'Create Password'}
        <span className='text-red-500'>*</span>
      </label>

      <div className='flex relative items-center'>
        <input
          id='identifier'
          type={showPassword ? "text" : "password"}
          placeholder=''
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          className='w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
        />
        {showPassword ? (
          <Eye
            strokeWidth={1.5}
            className='absolute right-3 text-gray-600 cursor-pointer'
            width={20}
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeOff
            strokeWidth={1.5}
            className='absolute right-3 text-gray-600 cursor-pointer'
            width={20}
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>

      <button
        type='button'
        disabled={loading}
        className='w-full rounded-md bg-primary py-3 flex justify-center text-white font-semibold hover:bg-orange-600 transition'
        onClick={handleSetPassword}>
        {loading ? (
          <Loader2 className='h-5 w-5 animate-spin text-white' />
        ) : (
          "Continue"
        )}
      </button>
    </>
  );
}

function EmailInput() {
 const dispatch = useDispatch();
 const userEmail = useSelector((state) => state.auth.email);
 const loading = useSelector((state) => state.auth.loading);

 const handleSubmit = async () => {
    dispatch(setLoading(true));

    try {
        const res = await fetch("/api/auth/confirm-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email : userEmail}),
        });

        const data = await res.json();

        if (data.exists) {
            dispatch(setFlow("LOGIN"));
            dispatch(setStep("PASSWORD"));
        } else {
            dispatch(setFlow("SIGNUP"));
            await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email : userEmail, purpose: 'SIGNUP' }),
            });
            dispatch(setStep("OTP"));
        } 
    } catch(error) {
        console.log('From Confirm Email', error)
        toast.error("Something went wrong");
    } finally {
        dispatch(setLoading(false));
    }
 };


  return (
    <>
      <div>
        <label
          htmlFor='identifier'
          className='block text-left text-sm font-semibold text-gray-700 mb-1'>
          Email
          <span className='text-red-500'>*</span>
        </label>
        <input
          id='identifier'
          type='email'
          placeholder='xyz30@gmail.com'
          value={userEmail}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          className='w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
        />
      </div>

      <button
        type='button'
        disabled={loading}
        className='w-full rounded-md bg-primary py-3 text-white font-semibold hover:bg-orange-600 transition flex justify-center'
        onClick={handleSubmit}>
        {loading ? (
          <Loader2 className='h-5 w-5 animate-spin text-white' />
        ) : (
          "Continue"
        )}
      </button>

      {/* Terms */}
      <p className='mt-4 text-xs text-gray-600'>
        By continuing you agree to AddedValue’s{" "}
        <a href='#' className='text-red-500 hover:underline'>
          Terms and Conditions
        </a>{" "}
        and{" "}
        <a href='#' className='text-red-500 hover:underline'>
          Privacy Policy
        </a>
        .
      </p>
    </>
  );
}

function OtpInput() {
  const { email, otp } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const verifyOtp = async () => {
    await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code: otp }),
    });

    dispatch(setStep("SET_PASSWORD"));
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold">Enter OTP</h2>

      <OTP length={4} onComplete={verifyOtp} />
      
      <ResendOTP userEmail={email}/>
    </div>
  );
}


