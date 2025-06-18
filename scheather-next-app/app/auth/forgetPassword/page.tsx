'use client'
import Link from "next/link";

import { useState } from 'react';

export default function Home() {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    return (
        <div className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center">
            <img className="absolute right-0 top-0 w-auto h-full z-0" src="/bg.png" />
            <div className="transform scale-[59%] origin-left w-full">
                <div data-layer="Forget Password" className="ForgetPassword relative w-[1920px] h-[1080px]">

                    <div className="w-[791px] h-full left-0 top-0 absolute bg-stone-100" />
                    <div className="w-[1470px] h-full left-[600px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0" />
                    <div className="w-[1036px] h-full left-[396px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0 blur-[10px]" />
                    <div className="w-[1920px] h-full left-[-233px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0 backdrop-blur-lg opacity-20" />

                    <div data-layer="SignUp" className="Signup w-[750px] h-[720px] left-[114px] top-[207px] absolute bg-blue-200/60 rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.30)]" />
                    <div data-layer="SCHEATHER" className="Scheather w-[455px] h-20 left-[261px] top-[86px] absolute justify-start text-cyan-900 text-7xl font-bold font-['Montserrat']">SCHEATHER</div>

                    <Link href="/auth/login">
                        <p data-layer="Do you have an account?" className="DoYouHaveAnAccount left-[330px] top-[820px] absolute justify-start text-stone-900/50 text-2xl font-normal font-['Montserrat'] cursor-pointer hover:underline transition duration-200">Do you have an account?</p>
                    </Link>

                    <button
                        type="button"
                        onClick={() => alert('Submit clicked!')}
                        className="w-72 h-20 left-[338px] top-[690px] absolute bg-cyan-900 hover:bg-cyan-800 active:bg-cyan-700 focus:outline-none rounded-[30px] outline outline-2 outline-offset-[-2px] outline-cyan-900 text-stone-100 text-3xl font-['Montserrat'] transition duration-200 flex items-center justify-center"
                    >
                        Submit
                    </button>

                    <div className="w-[605px] h-20 left-[189px] top-[269px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center focus-within:outline-cyan-700 transition duration-300">
                        <input
                            type="email"
                            placeholder="Input Email"
                            className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
                        />
                    </div>


                    <div className="w-[605px] h-20 left-[189px] top-[401px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center justify-between focus-within:outline-cyan-700 transition duration-300">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50 pr-20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 focus:outline-none"
                        >
                            <img
                                src={showNewPassword ? '/eye.svg' : '/eye-closed.svg'}
                                alt="Toggle visibility"
                                className="w-[50px] h-[50px]"
                            />
                        </button>
                    </div>

                    <div className="w-[605px] h-20 left-[189px] top-[528px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center justify-between focus-within:outline-cyan-700 transition duration-300">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Re-Enter Password"
                            className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50 pr-20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 focus:outline-none"
                        >
                            <img
                                src={showPassword ? '/eye.svg' : '/eye-closed.svg'}
                                alt="Toggle visibility"
                                className="w-[50px] h-[50px]"
                            />
                        </button>
                    </div>

                </div>
            </div>
        </div >

    );
}
