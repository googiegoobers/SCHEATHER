"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";;
import { auth } from "@/app/lib/firebaseConfig";
import { useRouter } from "next/navigation";

function ToDoList()
{
  const router = useRouter();
  //fetching name and email from firebase auth
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setName(user.displayName || "No name");
          setEmail(user.email || "No email");
        } else {
          router.push("/auth/login"); // redirect if not logged in
        }
      });
  
      return () => unsubscribe(); // cleanup
    }, []);
  
    //para sa pfp avatar
  const [avatar, setAvatar] = useState("/avatar/cat1.jpg");
  // setting the selected avatar from localStorage if available
    useEffect(() => {
      const savedAvatar = localStorage.getItem("selectedAvatar");
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    }, []);
  //for the name and email address in the header
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

    return(
        <div className="bg-white flex items-center justify-center inset-0 fixed overflow-hidden">
            {/* Desktop */}
            <div data-layer="To-Do List" className="ToDoList w-full h-full relative bg-white overflow-hidden">
              <div data-layer="Frame 63" className="Frame63 w-full h-20 left-0 top-0 absolute relative shadow-[0px_4px_8px_0px_rgba(0,0,0,0.30)] overflow-hidden">
                <div data-layer="notifications" className="Notifications w-16 h-16 left-[1175px] top-[15px] absolute overflow-hidden">
                  <div data-layer="icon" className="Icon w-11 h-14 left-[10.83px] top-[5.42px] absolute bg-Schemes-On-Surface" />
                </div>

                <Link href="/dashboard" passHref>
                  <span className="Scheather w-48 h-14 left-30 top-6 z-10 absolute justify-start text-black text-3xl font-normal font-['Cedarville_Cursive'] cursor-pointer">
                    Scheather
                  </span>
                </Link>
                
                <div data-layer="Rectangle 29" className="Rectangle29 lg:w-full lg:h-20 absolute opacity-20 bg-zinc-300" />
                {/* pfp */}
                <div className="relative absolute avatar-wrapper">
                  <img
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-[#e68c3a] absolute left-250 top-5"
                  src={avatar}
                  alt="Profile"
                  />
                  <div className="hidden sm:flex flex-col min-w-0 truncate absolute right-20 top-5">
                    <div className="text-black text-sm font-semibold truncate">
                      {name}
                    </div>
                    <div className="text-black text-xs truncate">{email}</div>
                  </div>

                </div>
              </div>
              
              <div data-layer="Rectangle 30" className="Rectangle30 lg:w-80 h-full left-[-5px] top-[80px] absolute bg-[#223F61]" />

              <div data-layer="Rectangle 32" className="Rectangle32 w-38 h-15 left-[23px] top-[110px] absolute bg-[#E68C3A] rounded-[30px] flex items-center px-3 gap-2">
                <p data-layer="Create" className="Create lg:left-[60px] lg:top-[15px] absolute text-center justify-start text-white text-xl font-normal font-['Poppins']">Create</p>
                <img src="/plus.png" className="star lg:w-10 lg:h-10"/>
              </div>

              <div data-layer="Rectangle 33" className="Rectangle33 lg:w-65 h-10 lg:left-[23px] lg:top-[210px] absolute bg-white rounded-[30px] flex items-center px-8 gap-2">
                <p data-layer="All tasks" className="AllTasks lg:left-[80px] absolute text-center justify-start text-blue-300 text-xl font-normal font-['Poppins']">All tasks</p>
                <img src="/circle-check.png" className="circle-Checked lg:w-8 lg:h-8" />
              </div>
 
              <div data-layer="Rectangle 34" className="Rectangle34 lg:w-65 h-10 lg:left-[23px] lg:top-[270px] absolute bg-orange-400 rounded-[30px] flex items-center px-9 gap-2">
                <p data-layer="Starred" className="Starred lg:left-[80px] lg:top-[5px] absolute text-center justify-start text-white text-xl font-normal font-['Poppins']">Starred</p>
                <img src="/star.png" className="circle-Checked lg:w-6 lg:h-6" />
              </div>
            
              <div data-layer="Line 2" className="Line2 w-65 h-0 left-[36px] top-[340px] absolute outline outline-1 outline-offset-[-0.50px] outline-white"></div>
  
              <p data-layer="Lists" className="Lists left-[109px] top-[360px] absolute text-center justify-start text-white text-xl font-normal font-['Poppins']">Lists</p>
              <div data-layer="bullet" className="bullet lg:w-3 lg:h-3 left-[62px] top-[368px] absolute bg-zinc-300 rounded-full" />

              {/* Task/list box rectangle basta kana*/}
              <div data-layer="Rectangle 31" className="listbox w-[739px] h-96 left-110 top-10 absolute bg-[#223F61] rounded-[30px] absolute relative">
                  <img src="/dots-vertical.png"className="absolute left-[670px] top-[15px]"/>
                  <p data-layer="Title" className="Title left-[50px] top-[30px] absolute text-center justify-start text-white text-2xl font-normal font-['Poppins']">Title</p>
                  <div data-layer="Line 3" className="Line3 w-[688.01px] h-0 left-[30px] top-[70px] absolute outline outline-1 outline-offset-[-0.50px] outline-white"/>
                  <div data-layer="Add a task button">
                    <img src="/circle-check-white.png" className="circle-checked-white w-6 h-6 absolute left-[40px] top-[90px] "/>
                    <p data-layer="Add a task" className="AddATask left-[80px] top-[90px] absolute text-center justify-start text-white text-xl font-normal font-['Poppins']">Add a task</p>
                  </div>
                  <div data-layer="Check List">
                    <img src="/circle-white.png" className="w-5 h-5 absolute left-[40px] top-[134px]"/>
                    <p data-layer="Insert task here" className="InsertTextHere left-[80px] top-[130px] absolute text-center justify-start text-white text-xl font-normal font-['Poppins']">Insert Task Here</p>
                  </div>
              </div>

            </div>
        </div>
    );
};

export default ToDoList;