"use client";
import Link from "next/link";

import { useState } from "react";
import { auth } from "@/app/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { updatePassword } from "firebase/auth";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

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
    <div className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        {/* Desktop */}
        <div data-layer="Desktop" className="hidden lg:flex flex items-center">
          <div
            data-layer="Rectangle 44"
            className="Rectangle44 lg:w-[85vw] lg:h-[80vh] left-[100px] absolute rounded-[30px] shadow-[0px_10px_4px_0px_rgba(34,63,97,0.25)] border-[0.4vh] border-[#223F61]"
          />
          {/* LEFT SIDE */}
          <div className="flex-col">
            <Link href="/">
              <p
                data-layer="Scheather"
                className="Scheather left-[166px] top-[100px] absolute justify-start text-[#223F61] text-5xl font-normal font-['Cedarville_Cursive']"
              >
                Scheather
              </p>
            </Link>
            <p
              data-layer="Forget Password"
              className="ForgetPassword left-[170px] top-[140px] absolute text-center justify-start text-[#223F61] text-4xl font-normal font-['Poppins']"
            >
              Forgot Password
            </p>

            <p
              data-layer="Email"
              className="Email left-[168px] top-[186px] absolute text-center justify-start text-[#223F61] text-xl font-normal font-['Poppins']"
            >
              Email
            </p>
            <div className=" w-90 h-10 left-[168px] top-[221px] absolute">
              <input
                type="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-full px-6 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 text-lg font-normal font-['Montserrat'] placeholder:text-stone-900/50"
              />
            </div>

            <p
              data-layer="Password"
              className="Password left-[167px] top-[272px] absolute text-center justify-start text-[#223F61] text-xl font-normal font-['Poppins']"
            >
              Password
            </p>
            <div className=" w-90 h-10 left-[170px] top-[309px] absolute">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-full px-6 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 text-lg font-normal font-['Montserrat'] placeholder:text-stone-900/50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-5 top-1 focus:outline-none"
              >
                <img
                  src={showNewPassword ? "/eye.svg" : "/eye-closed.svg"}
                  alt="Toggle visibility"
                  className="w-[25px] h-[25px] mt-1.5"
                />
              </button>
            </div>

            <p
              data-layer="Re-New Password"
              className="ReNewPassword left-[163px] top-[355px] absolute text-center justify-start text-[#223F61] text-xl font-normal font-['Poppins']"
            >
              Re-New Password
            </p>
            <div className=" w-90 h-10 left-[168px] top-[395px] absolute">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-Enter New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-full px-6 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 text-lg font-normal font-['Montserrat'] placeholder:text-stone-900/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1 focus:outline-none"
              >
                <img
                  src={showPassword ? "/eye.svg" : "/eye-closed.svg"}
                  alt="Toggle visibility"
                  className="w-[25px] h-[25px] mt-1.5"
                />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className="w-80 h-7 left-[168px] top-[441px] absolute text-red-500 text-sm font-['Poppins']">
                {error}
              </p>
            )}

            {/* Success message */}
            {success && (
              <p className="w-80 h-7 left-[168px] top-[441px] absolute text-green-500 text-sm font-['Poppins']">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-48 h-10 left-[250px] top-[470px] absolute bg-[#223F61] hover:bg-[#94B7EF] hover:text-[#223F61] rounded-[30px] outline outline-2 outline-offset-[-2px] outline-cyan-900 overflow-hidden text-stone-100 text-xl font-normal font-['Montserrat'] text-center transition-colors duration-300"
            >
              Submit
            </button>

            <Link href="/auth/login">
              <p
                data-layer="Do you have an account? Log in here"
                className="DoYouHaveAnAccountLogInHere w-80 h-7 left-[189px] top-[525px] absolute text-center justify-start text-[#223F61] text-sm font-normal font-['Poppins'] lowercase underline cursor-pointer"
              >
                Do you have an account? Log in here
              </p>
            </Link>
          </div>
          {/* right side */}
          <div className="w-1/2 h-full flex justify-center items-center">
            <img
              data-layer="hero-logo 2"
              className="HeroLogo2 lg:w-[468px] lg:h-[468px] object-contain top-25 right-35 absolute"
              src="/hero-logo.png"
            />
          </div>
        </div>
        {/* MOBILE */}
        <div className="block lg:hidden overflow-auto">
          <div
            data-layer="Forget Password  2 - Phone"
            className="ForgetPassword2Phone w-96 h-[812px] relative bg-white overflow-hidden"
          >
            <div
              data-layer="Forget Password"
              className="ForgetPassword left-[99px] top-[33px] absolute text-center justify-start text-[#223F61] text-xl font-bold font-['Poppins']"
            >
              Forget Password
            </div>

            <Link href="/">
              <img
                data-layer="left arrow"
                className="left-[55px] top-[35px] absolute"
                src="/left arrow.svg"
              />
            </Link>

            <img
              data-layer="hero-logo 4"
              className="HeroLogo4 w-48 h-48 left-[90px] top-[78px] absolute"
              src="/hero-logo.png"
            />

            <div
              data-layer="Scheather"
              className="Scheather left-[82px] top-[278px] absolute justify-start text-[#223F61] text-5xl font-normal font-['Cedarville_Cursive']"
            >
              Scheather
            </div>

            <p
              data-layer="Email"
              className="Email left-[31px] top-[336px] absolute text-center justify-start text-[#223F61] text-lg font-normal font-['Poppins'] capitalize"
            >
              Email
            </p>
            <div
              data-layer="Textbox"
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

            <p
              data-layer="Password"
              className="Password left-[31px] top-[437px] absolute text-center justify-start text-[#223F61] text-lg font-normal font-['Poppins'] capitalize"
            >
              Password
            </p>
            <div
              data-layer="Textbox"
              data-blank="Default"
              className="Textbox w-80 h-10 left-[34px] top-[482px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center"
            >
              <input
                type={showNewPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-5 top-1 focus:outline-none"
              >
                <img
                  src={showNewPassword ? "/eye.svg" : "/eye-closed.svg"}
                  alt="Toggle visibility"
                  className="w-[20px] h-[20px] mt-1.5"
                />
              </button>
            </div>

            <p
              data-layer="Re-Enter New Password"
              className="ReEnterNewPassword left-[29px] top-[549px] absolute text-center justify-start text-[#223F61] text-lg font-normal font-['Poppins'] capitalize"
            >
              Re-Enter New Password
            </p>
            <div
              data-layer="Textbox"
              data-blank="Default"
              className="Textbox w-80 h-10 left-[34px] top-[594px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center"
            >
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-Enter New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1 focus:outline-none"
              >
                <img
                  src={showPassword ? "/eye.svg" : "/eye-closed.svg"}
                  alt="Toggle visibility"
                  className="w-[20px] h-[20px] mt-1.5"
                />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className="w-80 h-7 left-[34px] top-[645px] absolute text-red-500 text-sm font-['Poppins']">
                {error}
              </p>
            )}
            {/* Success message */}
            {success && (
              <p className="w-80 h-7 left-[34px] top-[645px] absolute text-green-500 text-sm font-['Poppins']">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-44 h-9 left-[96px] top-[685px] absolute bg-[#223F61] hover:bg-[#94B7EF] text-stone-100 hover:text-[#223F61] rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] overflow-hidden text-base font-normal font-['Montserrat'] transition-colors duration-300"
            >
              Submit
            </button>

            <p
              data-layer="Do you have an account? Log in here"
              className="DoYouHaveAnAccountLogInHere left-[78px] top-[739px] absolute text-center justify-start text-[#223F61] text-xs font-normal font-['Poppins'] lowercase underline"
            >
              Do you have an account? Log in here
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
