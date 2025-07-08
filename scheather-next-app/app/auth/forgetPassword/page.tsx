"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import Script from "next/script";
import { updatePassword } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { div } from "three/tsl";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  // for changing the word Forgot to Change (I'm using this for the change password)
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode"));
  }, []);

  const isChangePassword = mode === "change";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      setSuccess("");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent!");
      setError("");
    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="bg-white flex flex-col min-h-screen overflow-auto">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-QMVC5BR2W3"
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());

          gtag("config", "G-QMVC5BR2W3");`}
      </Script>
      {/*Inside the Container for Desktop*/}
      <div className="hidden lg:flex flex-1 justify-center items-center">
        {/* Header*/}
        <header
          className="w-full h-20 bg-white shadow-[0px_1.5px_15px_0px_rgba(0,0,0,0.20)] fixed top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-20"
          style={{
            fontFamily: "Poppins",
          }}
        >
          {/* Brand Logo */}
          <div
            className="text-black text-xl sm:text-2xl font-medium"
            style={{
              fontFamily: '"Cedarville Cursive", cursive',
            }}
          >
            Scheather
          </div>

          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <Link href={isChangePassword ? "/dashboard" : "/"} passHref>
              <h1 className="text-black text-sm xl:text-base hover:cursor-pointer after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                {isChangePassword
                  ? "Back to Dashboard"
                  : "Back to Landing Page"}
              </h1>
            </Link>
          </div>
        </header>

        <div
          data-layer="Container"
          className="mt-30 lg:w-[85vw] lg:h-[70vh] bg-white rounded-[2.5vh] shadow-[0px_1vh_0.4vh_0px_rgba(34,63,97,0.25)] border-[0.4vh] border-[#223F61] flex flex-row initial=scale1.0"
        >
          {/* LEFT SIDE */}
          <div className="hidden lg:flex relative Justify-center flex lg:top-[13vh] lg:px-[10vw] flex-col">
            <form onSubmit={handleSubmit}>
              <Link href="/">
                <p className="text-[#223F61] text-5xl font-normal font-['Cedarville_Cursive']">
                  Scheather
                </p>
              </Link>
              <p className="text-[#223F61] text-4xl font-normal font-['Poppins'] text-center mt-1.5 mb-5">
                {isChangePassword ? "Change Password" : "Forgot Password"}
              </p>

              <label className="text-[#223F61] text-xl font-normal font-['Poppins'] mt-16">
                Email
              </label>
              <input
                type="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-6 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 text-lg font-normal font-['Montserrat'] placeholder:text-stone-900/50 mt-2 mb-3"
              />

              <button
                type="submit"
                className=" w-full max-w-xs h-10 bg-[#223F61] hover:bg-[#94B7EF] hover:text-[#223F61] rounded-[30px] outline outline-2 outline-offset-[-2px] outline-cyan-900 overflow-hidden text-stone-100 text-xl font-normal font-['Montserrat'] flex items-center justify-center transition-colors duration-300 cursor-pointer"
              >
                Submit
              </button>
            </form>

            <div className="flex flex-col items-left w-full mt-4">
              {error && (
                <p className=" text-red-500 text-sm font-['Poppins']">
                  {error}
                </p>
              )}

              {/* Success message */}
              {success && (
                <p className=" text-green-500 text-sm font-['Poppins']">
                  {success}
                </p>
              )}
            </div>

            {!isChangePassword && (
              <div className="w-full flex items-center mb-3 mt-7 text-base lg:text-lg">
                <p className="text-[#223F61] font-normal font-['Poppins'] flex-1 text-s">
                  Already Have an Account?
                </p>
                <Link href="/auth/login" className="w-auto">
                  <p className="text-[#223F61] font-semibold font-['Poppins'] cursor-pointer hover:underline text-right text-s">
                    Log in
                  </p>
                </Link>
              </div>
            )}
          </div>

          {/* right side */}
          <div className="Justify-center flex m-10 relative">
            <img className="lg:px-10" src="/hero-logo.png" />
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden flex flex-col flex-1 w-full overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="lg:hidden flex flex-col items-center w-full min-h-screen py-8 px-4"
        >
          <div className="ForgetPassword2Phone w-96 h-[812px] relative bg-white overflow-hidden">
            <div className="ForgetPassword left-[99px] top-[33px] absolute text-center justify-start text-[#223F61] text-xl font-bold font-['Poppins']">
              {isChangePassword ? "Change Password" : "Forgot Password"}
            </div>

            <Link href={isChangePassword ? "/dashboard" : "/"} passHref>
              <img
                src="/left arrow.svg"
                alt="Back"
                className="absolute left-[20px] top-[20px] block lg:hidden"
              />
            </Link>

            <img
              className="HeroLogo4 w-48 h-48 left-[90px] top-[78px] absolute"
              src="/hero-logo.png"
            />

            <div className="Scheather left-[82px] top-[278px] absolute justify-start text-[#223F61] text-5xl font-normal font-['Cedarville_Cursive']">
              Scheather
            </div>

            <p className="Email left-[41px] top-[346px] absolute text-center justify-start text-[#223F61] text-lg font-normal font-['Poppins'] capitalize">
              Email
            </p>
            <div
              data-blank="Default"
              className="Textbox w-80 h-10 left-[34px] top-[380px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center"
            >
              <input
                type="email"
                name="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"
              />
            </div>

            <div className="flex flex-col items-center w-full gap-4 mt-110">
              <button
                type="submit"
                className="w-full max-w-xs h-10 bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] flex items-center justify-center text-base font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61] cursor-pointer"
              >
                Submit
              </button>
            </div>

            <div className="flex flex-col items-center w-full mt-4">
              {error && (
                <p className=" text-red-500 text-sm font-['Poppins']">
                  {error}
                </p>
              )}

              {/* Success message */}
              {success && (
                <p className=" text-green-500 text-sm font-['Poppins']">
                  {success}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center w-full mt-6">
              {!isChangePassword && (
                <div>
                  <p className=" text-center justify-start text-[#223F61] text-s font-normal font-['Poppins']">
                    Already have an account?
                  </p>

                  <p className=" text-center justify-start text-[#223F61] text-s font-normal font-['Poppins'] underline">
                    Log in
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <footer
        className="mt-20 w-full bg-gray-800 text-white px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
        id="contacts"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
          <div
            className="text-white text-center lg:text-left order-1 lg:order-1"
            style={{
              fontFamily: '"Cedarville Cursive", cursive',
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "white",
            }}
          >
            Scheather
          </div>
          <div
            className="text-white text-center lg:text-left order-1 lg:order-1 pt-5"
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(0.75rem, 2vw, 1.5rem)",
              color: "#e68c3a",
            }}
          >
            Schedule together according to the weather.
          </div>

          <div className="text-center lg:text-left w-full lg:w-fit order-2 lg:order-2">
            <p className="text-lg sm:text-xl font-semibold mb-4">Contact Us</p>

            {/* Phone */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <p className="text-base sm:text-lg">0977966554</p>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p className="text-base sm:text-lg break-all sm:break-normal">
                scheather@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 lg:mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm sm:text-base">
            &copy; 2025 Scheather. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
