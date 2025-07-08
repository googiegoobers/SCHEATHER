"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
// import {AuthContextProvider} from "@/app/context/AuthContext";

import React, { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserAuth } from "../../context/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, googleSignIn, logOut } = UserAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      if (userData?.role === "admin") {
        router.push("/dashboard-admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return; // Prevent double click
    setGoogleLoading(true);
    try {
      const result = await googleSignIn();
      // result may not return user, so get current user from auth
      const user = auth.currentUser;
      if (!user) throw new Error("No user found after Google Sign-In");
      // Check if user doc exists, if not, create with default role
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let userData = userDoc.data();
      if (!userDoc.exists()) {
        // Set default fields for new Google users
        await setDoc(userRef, {
          displayName: user.displayName || "",
          email: user.email || "",
          role: "user",
          uid: user.uid,
        });
        userData = { role: "user" };
      }
      if (userData?.role === "admin") {
        router.push("/dashboard-admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(`Google Sign-In failed: ${error.message}`);
    } finally {
      setGoogleLoading(false);
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

          {/* Desktop Navigation - right aligned */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <Link href="/" passHref>
              <h1 className="text-black text-sm xl:text-base hover:cursor-pointer after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                Back to Landing Page
              </h1>
            </Link>
          </div>
        </header>
        <div
          data-layer="Container"
          className="mt-35 lg:w-[85vw] lg:h-[80vh] bg-white rounded-[2.5vh] shadow-[0px_1vh_0.4vh_0px_rgba(34,63,97,0.25)] border-[0.4vh] border-[#223F61] flex flex-row initial=scale1.0"
        >
          {/*Left Side of the Container*/}
          <div className="hidden lg:flex relative Justify-center flex lg:top-[7vh] lg:px-[5vw] flex-col">
            <Link href="/">
              <h1
                className=" text-[#223F61] text-xl sm:text-5xl font-medium"
                style={{
                  fontFamily: '"Cedarville Cursive", cursive',
                }}
              >
                {" "}
                Scheather
              </h1>
            </Link>
            <h2
              className="text-[#223F61] lg:text-3xl sm:text-5xl"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Log in to see more
            </h2>

            <p
              className="text-[#223F61] lg:p5px my-2.5 mt-15"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Email
            </p>
            <div
              data-layer="Textbox"
              data-blank="Default"
              className="lg:w-[28vw] lg:h-[45px] relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600"
            >
              <input
                type="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"
              />
            </div>

            <p
              className="text-[#223F61] lg:p5px my-2.5"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Password
            </p>
            <div
              data-layer="Textbox"
              data-blank="Default"
              className="lg:w-[28vw] lg:h-[45px] relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600"
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1.5 focus:outline-none"
              >
                <img
                  src={showPassword ? "/eye.svg" : "/eye-closed.svg"}
                  alt="Toggle visibility"
                  className="w-[25px] h-[25px] mt-1.5"
                />
              </button>
            </div>

            <div className="flex flex-col items-center w-full mt-6 gap-4">
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full max-w-xs h-10 bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] flex items-center justify-center text-[18px] font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61] cursor-pointer"
              >
                Login
              </button>
              <Script
                src="https://accounts.google.com/gsi/client"
                strategy="lazyOnload"
              />
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex items-center justify-center gap-2 w-full max-w-xs h-10 bg-white border border-gray-300 rounded-[30px] shadow hover:bg-gray-100 transition-colors duration-200 text-[#223F61] font-medium font-['Montserrat'] cursor-pointer"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Sign in with Google</span>
              </button>
            </div>

            {/* Forgot Password / Reset Password */}
            <div className="w-full flex items-center mb-3 mt-5 text-base lg:text-lg">
              <p className="text-[#223F61] font-normal font-['Poppins'] flex-1">
                Forgot Password?
              </p>
              <Link href="/auth/forgetPassword" className="w-auto">
                <p className="text-[#223F61] font-semibold font-['Poppins'] cursor-pointer hover:underline text-right">
                  Reset Password
                </p>
              </Link>
            </div>

            {/* Don't have an account / Sign up */}
            <div className="w-full flex items-center mb-3 text-base lg:text-lg">
              <p className="text-[#223F61] font-normal font-['Poppins'] flex-1">
                Don't have an account?
              </p>
              <Link href="/auth/signup" className="w-auto">
                <p className="text-[#223F61] font-semibold font-['Poppins'] cursor-pointer hover:underline text-right">
                  Sign up
                </p>
              </Link>
            </div>
          </div>
          {/*Right side of the Container*/}
          <div className="Justify-center flex m-10 relative lg:top-[1vh]">
            <img
              //img hero logo
              src="/hero-logo.png"
              className="lg:px-10"
            />
          </div>
        </div>
      </div>

      {/*mobile*/}
      <div className="lg:hidden flex flex-col items-center w-full min-h-screen py-8 px-4">
        <div className="w-full relative flex items-center mb-8">
          <Link href="/" className="absolute left-0">
            <img
              data-layer="left arrow"
              src="/left arrow.svg"
              alt="Back"
              className="w-8 h-8"
            />
          </Link>
          <p
            data-layer="Login"
            className="text-[#223F61] text-3xl font-bold font-['Poppins'] mx-auto"
          >
            Login
          </p>
        </div>

        <h1 className="text-cyan-900 text-5xl font-normal font-['Cedarville_Cursive'] mb-4">
          Scheather
        </h1>
        <img src="/hero-logo.png" className="w-48 h-48 mb-4" alt="Hero Logo" />
        <p className="text-[#223F61] text-lg font-normal font-['Poppins'] capitalize mb-2">
          Email
        </p>
        <div className="w-full max-w-xs h-10 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center mb-4">
          <input
            type="email"
            placeholder="Input Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"
          />
        </div>
        <p className="text-[#223F61] text-lg font-normal font-['Poppins'] capitalize mb-2">
          Password
        </p>
        <div className="w-full max-w-xs h-10 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 focus:outline-none"
          >
            <img
              src={showPassword ? "/eye.svg" : "/eye-closed.svg"}
              alt="Toggle visibility"
              className="w-[25px] h-[25px]"
            />
          </button>
        </div>
        {/* Buttons below textboxes */}
        <div className="flex flex-col items-center w-full mt-6 gap-4">
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full max-w-xs h-10 bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] flex items-center justify-center text-base font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61] cursor-pointer"
          >
            Login
          </button>
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="lazyOnload"
          />
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex items-center justify-center gap-2 w-full max-w-xs h-10 bg-white border border-gray-300 rounded-[30px] shadow hover:bg-gray-100 transition-colors duration-200 text-[#223F61] font-medium font-['Montserrat']"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>

          <div>
            <p className="text-center justify-start text-[#223F61] text-s font-normal font-['Poppins']">
              Forgot Password?
            </p>
            <Link href="/auth/forgetPassword">
              <p className="text-center justify-start text-[#223F61] text-s font-normal font-['Poppins'] underline">
                Reset Password
              </p>
            </Link>
          </div>

          <div>
            <p className=" text-center justify-start text-[#223F61] text-s font-normal font-['Poppins']">
              Don't have an account?
            </p>
            <Link href="/auth/signup">
              <p className=" text-center justify-start text-[#223F61] text-s font-normal font-['Poppins'] underline">
                Sign Up
              </p>
            </Link>
          </div>
        </div>
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
