'use client'

import Image from "next/image";
import Link from "next/link";
// import {AuthContextProvider} from "@/app/context/AuthContext";

import React, { useState } from "react";
import { auth } from "@/app/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";


export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {user, googleSignIn, logOut} = UserAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful:", userCredential.user);
      // alert("Login successful! \nWelcome user!");
      router.push("/dashboard"); // Enable your redirect here
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      router.push("/dashboard");
    } catch (error: any) {
      alert(`Google Sign-In failed: ${error.message}`);
    }
};

  return (
    <div className = "bg-white flex items-center justify-center inset-0 fixed overflow-hidden">
      {/*Inside the Container for Desktop*/} 
      <div data-layer="Container" className="hidden lg:flex lg:w-[85vw] lg:h-[80vh] absolute bg-white rounded-[2.5vh] shadow-[0px_1vh_0.4vh_0px_rgba(34,63,97,0.25)] border-[0.4vh] border-[#223F61] flex-row initial=scale1.0"> 
         {/*Left Side of the Container*/}
         <div className="hidden lg:flex relative Justify-center flex lg:top-[10vh] lg:px-[5vw] flex-col">
            <Link href="/">
              <h1 
              className=" text-[#223F61] text-xl sm:text-5xl font-medium"
              style={{
              fontFamily: '"Cedarville Cursive", cursive',
              }}
              > Scheather
            </h1>
            </Link>
            <h2
              className="text-[#223F61] lg:text-3xl sm:text-5xl"
              style={{
                fontFamily: 'Poppins',
              }}
            >
              Log in to see more
            </h2>
            
            <p className="text-[#223F61] lg:p5px my-2.5"
               style={{
                fontFamily: 'Poppins',
               }}>
              Email
            </p>
            <div data-layer="Textbox" data-blank="Default" className="lg:w-[28vw] lg:h-[45px] relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
              <input
                type="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"
              />
            </div>

            <p className="text-[#223F61] lg:p5px my-2.5"
               style={{
                fontFamily: 'Poppins',
               }}>
              Password
            </p>
            <div data-layer="Textbox" data-blank="Default" className="lg:w-[28vw] lg:h-[45px] relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
              <input
                type={showPassword ? 'text' : 'password'}
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

           <button
              type="button"
              onClick={handleLogin}
              className="lg:w-[12vw] lg:h-[35px] top-10 bottom-10 left-28 relative bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] overflow-hidden flex items-center justify-center text-xl font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61]"
              >Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="lg:w-[15vw] lg:h-[35px] top-13 bottom-10 left-22 relative bg-red-500 text-white rounded-[30px] flex items-center justify-center text-lg font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-red-600 cursor-pointer"
          >
            Sign in with Google
          </button>

          <Link href="/auth/forgetPassword">

            <p data-layer="Forget Password? Reset Password Here" className="ForgetPasswordResetPasswordHere relative lg:mt-[10vh] text-center justify-start text-[#223F61] lg:text-md font-normal font-['Poppins'] lowercase cursor-pointer underline">Forget Password? Reset Password Here</p>

          </Link>
           
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
      {/*mobile*/}
      <div className="lg:hidden md:flex overflow-auto">
        <div data-layer="Login 2 - Phone" className="Login2Phone w-96 h-[812px] relative bg-white overflow-hidden">

          <p data-layer="Login" className="Login left-[146px] top-[26px] absolute text-center justify-start text-[#223F61] text-3xl font-bold font-['Poppins']">Login
          </p>
          
          <Link href="/">
          <img data-layer="left arrow"className="left-[55px] top-[30px] absolute" src="/left arrow.svg"/>
          </Link>

          <img data-layer="hero-logo 3" className="HeroLogo3 w-48 h-48 left-[90px] top-[111px] absolute" src="/hero-logo.png"/>

          <h1 data-layer="Scheather" className="Scheather left-[85px] top-[306px] absolute justify-start text-cyan-900 text-5xl font-normal font-['Cedarville_Cursive']">Scheather</h1>

          <p data-layer="Email" className="Email left-[30px] top-[421px] absolute text-center justify-start text-[#223F61] text-lg font-normal font-['Poppins'] capitalize">Email</p>
               {/* email auth */}
          <div data-layer="Textbox" data-blank="Default" className="Textbox w-80 h-10 left-[27px] top-[469px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center">
            <input
              type="email"
              placeholder="Input Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"/>
          </div>

          <p data-layer="Password" className="Password left-[27px] top-[523px] absolute text-center justify-start text-[#223F61] text-lg font-normal font-['Poppins'] capitalize">Password</p>
               {/* password auth */}
          <div data-layer="Textbox" data-blank="Default" className="Textbox w-80 h-10 left-[27px] top-[569px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-4 flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-full bg-transparent outline-none text-stone-900 text-base font-normal font-['Montserrat'] placeholder:text-stone-900/50"/>
              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1.5 focus:outline-none"
            >
              <img
                src={showPassword ? "/eye.svg" : "/eye-closed.svg"}
                alt="Toggle visibility"
                className="w-[25px] h-[25px] mt-1"
              />
            </button>
          </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-44 h-9 left-[96px] top-[685px] absolute bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] overflow-hidden text-base font-normal font-['Montserrat'] text-center justify-center items-center flex active:bg-[#94B7EF] active:text-[#223F61]">
          Login
        </button>
        
        <Link href="/auth/forgetPassword">
          <p data-layer="Forget Password? Reset Password Here" className="ForgetPasswordResetPasswordHere left-[72px] top-[739px] absolute text-center justify-start text-[#223F61] text-xs font-normal font-['Poppins'] lowercase underline">
          Forget Password? Reset Password Here
          </p>
        </Link>

      </div>

      </div>
    </div>
  );
}
