// AuthForm.tsx
// Authentication form: handles OTP-based login/signup with country code selection, validation, and theme toggle

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import ThemeToggle from '../../components/ThemeToggle';

// --- Validation Schemas ---
// Zod schema for phone input validation
const phoneSchema = z.object({
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .min(6, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\d+$/, "Phone number must be digits only"),
});

// Zod schema for OTP input validation
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be digits only"),
});

// --- Type Definitions ---
type PhoneForm = z.infer<typeof phoneSchema>; // Type for phone form
type OtpForm = z.infer<typeof otpSchema>;     // Type for OTP form

// Country type for country data fetched from API
// - name: country name
// - idd: international dialing data
// - cca2: country code
// - flags: flag image
//
type Country = {
  name: { common: string };
  idd: { root: string; suffixes?: string[] };
  cca2: string;
  flags: { svg: string };
};

const OTP_CODE = "123456"; // Simulated OTP code for demo
const OTP_RESEND_SECONDS = 30; // Seconds before OTP can be resent

// Props for theme toggling and login callback
interface AuthFormProps {
  onLoginSuccess?: () => void; // Callback after successful login
  appearance?: 'light' | 'dark'; // Current theme mode
  toggleAppearance?: () => void; // Function to toggle theme
}

// --- Main AuthForm Component ---
const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess, appearance, toggleAppearance }) => {
  // --- State ---
  const [countries, setCountries] = useState<Country[]>([]); // List of countries for dropdown
  const [loading, setLoading] = useState(true);              // Loading state for country fetch
  const [step, setStep] = useState<"phone" | "otp">("phone"); // Current form step
  const [sendingOtp, setSendingOtp] = useState(false);       // Loading state for OTP send
  const [resendTimer, setResendTimer] = useState(0);         // Timer for OTP resend
  const [phoneData, setPhoneData] = useState<PhoneForm | null>(null); // Stores phone form data
  const [fetchError, setFetchError] = useState(false);       // Error state for country fetch

  // --- Fetch country data for dial codes ---
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // Filter and sort countries with valid dialing codes
        const filtered = data.filter((c: Country) => c.idd && c.idd.root);
        filtered.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
        setCountries(filtered);
        setLoading(false);
        setFetchError(false);
      })
      .catch((err) => {
        // Show error toast and set error state
        toast.error("Failed to load country data. Please check your connection and try again.");
        setCountries([]);
        setLoading(false);
        setFetchError(true);
      });
  }, []);

  // --- Retry country fetch on error ---
  const handleRetryFetch = () => {
    setLoading(true);
    setFetchError(false);
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter((c: Country) => c.idd && c.idd.root);
        filtered.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
        setCountries(filtered);
        setLoading(false);
        setFetchError(false);
      })
      .catch((err) => {
        toast.error("Failed to load country data. Please check your connection and try again.");
        setCountries([]);
        setLoading(false);
        setFetchError(true);
      });
  };

  // --- React Hook Form for phone step ---
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: "", phone: "" },
  });

  // --- React Hook Form for OTP step ---
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // --- Handle phone form submit (simulate OTP send) ---
  const onPhoneSubmit = (data: PhoneForm) => {
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      setStep("otp");
      setPhoneData(data);
      setResendTimer(OTP_RESEND_SECONDS);
      toast.success("OTP sent!");
    }, 1200); // Simulate network delay
  };

  // --- Handle OTP form submit (simulate OTP validation) ---
  const onOtpSubmit = (data: OtpForm) => {
    if (data.otp === OTP_CODE) {
      // Success: store auth in localStorage and call callback
      toast.success("Logged in successfully!");
      localStorage.setItem(
        "auth",
        JSON.stringify({
          country: phoneData?.country,
          phone: phoneData?.phone,
          loggedIn: true,
        })
      );
      if (onLoginSuccess) onLoginSuccess();
    } else {
      // Failure: show error and reset OTP form
      toast.error("Invalid OTP. Please try again.");
      resetOtpForm();
    }
  };

  // --- OTP resend timer logic ---
  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  // --- Handle resend OTP ---
  const handleResendOtp = () => {
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      setResendTimer(OTP_RESEND_SECONDS);
      toast.success("OTP resent!");
    }, 1200); // Simulate network delay
  };

  // --- UI ---
  return (
    // Outer container with gradient background
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-lemon via-mint to-white dark:from-dark-ebony dark:via-dark-mulberry dark:to-dark-rose">
      {/* Card container for the form */}
      <div className="w-full max-w-md mx-auto p-8 bg-white/95 dark:bg-dark-cocoa rounded-3xl shadow-2xl border border-mint dark:border-dark-tan relative">
        {/* Theme toggle in top-right */}
        {appearance && toggleAppearance && (
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle appearance={appearance} toggleAppearance={toggleAppearance} />
          </div>
        )}
        {/* Headings and divider */}
        <h1 className="text-3xl font-extrabold text-mint dark:text-dark-tan mb-2">Authentication</h1>
        <div className="mb-6 border-b border-mint dark:border-dark-tan" />
        <h2 className="text-2xl font-bold text-center mb-4 text-mint dark:text-dark-tan">Sign In / Sign Up</h2>
        {/* Fallback for country fetch error */}
        {fetchError && (
          <div className="mb-4 text-center">
            <p className="text-red-600 mb-2">Failed to load country data. Please check your connection and try again.</p>
            <button onClick={handleRetryFetch} className="bg-mint text-gray-900 px-4 py-2 rounded shadow hover:bg-aqua focus:outline-none focus:ring-2 focus:ring-mint focus:ring-opacity-50 dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa">Retry</button>
          </div>
        )}
        {/* Phone step: country and phone input */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-mint dark:text-dark-tan">
                Country
              </label>
              <select
                id="country"
                className="mt-1 block w-full rounded-md border-mint dark:border-dark-tan shadow-sm focus:border-mint focus:ring focus:ring-mint/40 focus:ring-opacity-50 bg-lemon/40 dark:bg-dark-cocoa/40 text-gray-900 dark:text-dark-tan"
                disabled={loading || sendingOtp || fetchError}
                {...registerPhone("country")}
              >
                {loading ? (
                  <option value="">Loading...</option>
                ) : countries.length === 0 ? (
                  <option value="">No countries found</option>
                ) : (
                  countries.map((country) => {
                    // Compose dial code from root and first suffix
                    const dial = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "");
                    return (
                      <option key={dial} value={dial}>
                        {country.name.common} ({dial})
                      </option>
                    );
                  })
                )}
              </select>
              {/* Country validation error */}
              {phoneErrors.country && <p className="mt-1 text-sm text-red-600">{phoneErrors.country.message}</p>}
              {/* Helper text */}
              {!phoneErrors.country && <p className="mt-1 text-xs text-gray-500">Select your country code</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-mint dark:text-dark-tan">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-md border-mint dark:border-dark-tan shadow-sm focus:border-mint focus:ring focus:ring-mint/40 focus:ring-opacity-50 bg-lemon/40 dark:bg-dark-cocoa/40 text-gray-900 dark:text-dark-tan"
                disabled={sendingOtp}
                {...registerPhone("phone")}
              />
              {/* Phone validation error */}
              {phoneErrors.phone && <p className="mt-1 text-sm text-red-600">{phoneErrors.phone.message}</p>}
              {/* Helper text */}
              {!phoneErrors.phone && <p className="mt-1 text-xs text-gray-500">Enter your phone number (digits only)</p>}
            </div>
            {/* Submit button for phone step */}
            <button
              type="submit"
              className="w-full bg-mint text-gray-900 py-2 px-4 rounded-md shadow hover:bg-aqua focus:outline-none focus:ring-2 focus:ring-mint focus:ring-opacity-50 dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa"
              disabled={loading || sendingOtp}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  {/* Loading spinner */}
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}
        {/* OTP step: OTP input and resend */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
            <p className="text-center text-gray-600 dark:text-dark-tan">
              Enter the 6-digit OTP sent to <b>{phoneData?.country} {phoneData?.phone}</b>
            </p>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-mint dark:text-dark-tan">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="mt-1 block w-full rounded-md border-mint dark:border-dark-tan shadow-sm focus:border-mint focus:ring focus:ring-mint/40 focus:ring-opacity-50 bg-lemon/40 dark:bg-dark-cocoa/40 text-gray-900 dark:text-dark-tan"
                disabled={sendingOtp}
                {...registerOtp("otp")}
              />
              {/* OTP validation error */}
              {otpErrors.otp && <p className="mt-1 text-sm text-red-600">{otpErrors.otp.message}</p>}
              {/* Helper text */}
              {!otpErrors.otp && <p className="mt-1 text-xs text-gray-500">Enter the 6-digit code sent to your phone</p>}
            </div>
            {/* Submit button for OTP step */}
            <button
              type="submit"
              className="w-full bg-mint text-gray-900 py-2 px-4 rounded-md shadow hover:bg-aqua focus:outline-none focus:ring-2 focus:ring-mint focus:ring-opacity-50 dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa"
              disabled={sendingOtp}
            >
              Verify OTP
            </button>
            {/* Resend OTP button and timer */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-mint text-sm underline hover:text-aqua focus:outline-none dark:text-dark-tan dark:hover:text-dark-cocoa"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || sendingOtp}
              >
                Resend OTP{resendTimer > 0 ? ` (${resendTimer}s)` : ""}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm; // Export the component for use in other files 