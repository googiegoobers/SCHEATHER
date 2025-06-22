'use client'

import Image from "next/image";
import Link from "next/link";

import React, { useState } from 'react';
import { auth } from '@/app/lib/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';



export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      alert('Login successful! \nWelcome user!');
      // router.push('/dashboard'); // Enable your redirect here
    } catch (error: any) {
      console.error('Login error:', error.message);
      alert(`Login failed: ${error.message}`);
    }
  };


  return (
    <div className = "bg-white flex items-center justify-center inset-0 fixed overflow-hidden">
      {/*Inside the Container for Desktop*/} 
      <div data-layer="Container" className="hidden lg:flex lg:w-[85vw] lg:h-[80vh] absolute bg-white rounded-[2.5vh] shadow-[0px_1vh_0.4vh_0px_rgba(34,63,97,0.25)] border-[0.4vh] border-[#223F61] flex-row"> 
         {/*Left Side of the Container*/}
         <div className="hidden lg:flex relative Justify-center flex py-10 px-25 flex-col">
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
            <div data-layer="Textbox" data-blank="Default" className="lg:w-90 lg:h-16 my-2.5 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
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
            <div data-layer="Textbox" data-blank="Default" className="lg:w-90 lg:h-16 my-2.5 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
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
              className="absolute right-4 focus:outline-none"
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
              className="lg:w-45 lg:h-15 m-10 left-10 relative bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-[#223F61] overflow-hidden flex items-center justify-center text-xl font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61]"
              >Login
          </button>

          <Link href="/auth/forgetPassword">
            <p data-layer="Forget Password? Reset Password Here" className="ForgetPasswordResetPasswordHere  text-center justify-start text-[#223F61] lg:text-md font-normal font-['Poppins'] lowercase hover:underline cursor-pointer">Forget Password? Reset Password Here</p>
          </Link>

         </div>
         {/*Right side of the Container*/}
         <div className="Justify-center flex m-10 max-width-100% relative">
            <img
              //img hero logo
              src="/hero-logo.png"
              className=""
            />
         </div>
      </div>
      {/*mobile*/}
      <div>
        
      </div>
    </div>
  );
}
