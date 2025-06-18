'use client'
import styles from "./auth/login/loginpage.module.css";
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
    <div className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center">
      {/* background image */}
      <img className="absolute right-0 top-0 w-auto h-full z-0" src="/bg.png" />
      {/* 📦 Scaled Container */}
      <div className="transform scale-[59%] origin-left w-full">
        {/* Your existing UI */}
        <div className="relative w-[1920px] h-[1080px]">

          <div className="w-[791px] h-full left-0 top-0 absolute bg-stone-100" />
          <div className="w-[1470px] h-full left-[600px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0" />
          <div className="w-[1036px] h-full left-[396px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0 blur-[10px]" />
          <div className="w-[1920px] h-full left-[-233px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0 backdrop-blur-lg opacity-20" />
          <div className="w-[748px] h-[574px] left-[111px] top-[283px] absolute bg-blue-200/60 rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.30)]" />

          <p className="w-[455px] h-44 left-[257px] top-[172px] absolute justify-start text-cyan-900 text-7xl font-bold font-['Montserrat']">SCHEATHER</p>
          <Link href="/auth/forgetPassword">
            <p className="left-[372px] top-[786px] absolute justify-start text-stone-900/50 text-2xl font-normal font-['Montserrat'] cursor-pointer hover:underline transition duration-200">
              Forgot Password?
            </p>
          </Link>
          <div className="w-[605px] h-20 left-[186px] top-[472px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
            />
          </div>

          <div className="w-[605px] h-20 left-[186px] top-[345px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center">
            <input
              type="email"
              placeholder="Input Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
            />
          </div>

          <div className="w-58 h-10 left-[253px] top-[586px] absolute flex items-center gap-4">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-10 h-10 scale-125 bg-stone-100 rounded-[10px] border border-stone-900 accent-stone-900"
            />
            <label className="text-stone-900/50 text-2xl font-normal font-['Montserrat'] whitespace-nowrap">
              Show Password
            </label>
          </div>

          <button
            onClick={handleLogin}
            className="w-72 h-20 absolute left-[335px] top-[666px] bg-cyan-900 hover:bg-cyan-800 transition duration-300 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-cyan-900 text-stone-100 text-3xl font-normal font-['Montserrat'] flex items-center justify-center"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
