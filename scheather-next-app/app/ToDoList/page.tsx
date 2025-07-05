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
            <div data-layer="To-Do List" className="ToDoListDesktop hidden sm:block w-full h-full relative bg-white overflow-hidden">
              <div data-layer="Frame 63" className="Frame63 w-full h-20 left-0 top-0 absolute relative shadow-[0px_4px_8px_0px_rgba(0,0,0,0.30)] overflow-hidden">
                <div data-layer="notifications" className="Notifications w-16 h-16 left-[1175px] top-[15px] absolute overflow-hidden">
                  <div data-layer="icon" className="Icon w-11 h-14 left-[10.83px] top-[5.42px] absolute bg-Schemes-On-Surface" />
                </div>

                <Link href="/dashboard">
                  <div>
                      <img src="left arrow.svg" className="w-8 h-8 top-5 left-14 absolute"/>
                      <span className="Scheather w-48 h-14 left-30 top-6 z-10 absolute justify-start text-black text-3xl font-normal font-['Cedarville_Cursive'] cursor-pointer">
                        Scheather
                      </span>
                  </div>
                </Link>
                
                <div data-layer="Rectangle 29" className="Rectangle29 lg:w-full lg:h-20 absolute opacity-20 bg-zinc-300" />
                
                {/* pfp */}
                <div className="pfp right-5 flex-col">
                    <img
                    className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-[#e68c3a] absolute right-60 top-5"
                    src={avatar}
                    alt="Profile"
                    />
                  {/* the name */}
                  <div className="hidden sm:flex flex-col min-w-0 truncate absolute right-20 top-5">
                    <div className="text-black text-sm font-semibold truncate">
                      {name}
                    </div>
                    <div className="text-black text-xs truncate">{email}</div>
                  </div>

                </div>
              </div>
              {/*side bar */}
              <div data-layer="Rectangle 30" className="Rectangle30 lg:w-80 h-full left-[-5px] top-[80px] absolute bg-[#223F61]">
                
                <div data-layer="buttons" className="p-10 flex flex-col space-y-5">
                    <div data-layer="Rectangle 32" className="Rectangle32 w-38 h-15 left-[23px] bg-[#E68C3A] rounded-[30px] flex items-center px-3 gap-2">
                      <img src="/plus.png" className="star lg:w-10 lg:h-10"/>
                      <p data-layer="Create" className="Create lg:left-[60px] lg:top-[15px] text-center justify-start text-white text-xl font-normal font-['Poppins']">Create</p>
                    </div>

                    <div data-layer="Rectangle 33" className="Rectangle33 lg:w-65 h-10 lg:left-[23px] bg-white rounded-[30px] flex items-center px-8 gap-2">
                      <img src="/circle-check.png" className="circle-Checked lg:w-8 lg:h-8" />
                      <p data-layer="All tasks" className="AllTasks lg:left-[80px] text-center justify-start text-blue-300 text-xl font-normal font-['Poppins']">All tasks</p>
                    </div>

                    <div data-layer="Rectangle 34" className="Rectangle34 lg:w-65 h-10 lg:left-[23px] bg-orange-400 rounded-[30px] flex items-center px-9 gap-2">
                      <img src="/star.png" className="circle-Checked lg:w-6 lg:h-6" />
                      <p data-layer="Starred" className="Starred lg:left-[80px] lg:top-[5px] text-center justify-start text-white text-xl font-normal font-['Poppins']">Starred</p>
                    </div>
                </div>
                
                <div data-layer="lists" className="flex flex-col space-y-5 px-10">
                  <div data-layer="Line 2" className="Line2 w-65 h-0 outline outline-1 outline-offset-[-0.50px] outline-white"></div>
                    <div data-layer="listbox" className="flex flex-row items-center pl-10 space-x-5">
                      <div data-layer="bullet" className="bullet lg:w-3 lg:h-3  bg-zinc-300 rounded-full" />
                      <p data-layer="Lists" className="Lists text-center justify-start text-white text-xl font-normal font-['Poppins']">Lists</p>
                    </div>
                </div>

                </div>
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
            {/* Mobile */}
            <div data-layer="To-Do List" className="ToDoList block lg:hidden w-96 h-[812px] relative bg-white overflow-hidden">
              {/* Header */}
              <div className="Header z-50 flex top-0 p-5 items-center">
                <Link href="/dashboard">
                  <img src="/left arrow.svg" className=" mt-5 ml-5 mr-24"/>
                </Link>
                    <p data-layer="Tasks" className="Tasks text-center pt-6 text-[#223F61] text-2xl font-normal font-['Poppins']">Tasks</p>
                    <div data-layer="navigations" className="flex flex-row justify-center items-center">
                        <img src="/star filled.png" className="left-[50px] top-[115px] absolute"/>
                        <p data-layer="My Tasks" className="MyTasks w-20 h-7 left-[126px] top-[113px] absolute text-center justify-start text-blue-300 text-base font-normal font-['Poppins']">My Tasks</p>
                        <img src="/plus blue.png" className="left-[258px] top-[120px] absolute"/>
                        <p data-layer="Add Lists" className="AddLists w-20 h-7 left-[271px] top-[116px] absolute text-center justify-start text-[#223F61] text-base font-normal font-['Poppins']">Add Lists</p>
                    </div>
              </div>
              
              {/* Frame sa header */}
              <div data-layer="Frame 63" className="absolute w-96 h-36 left-0 top-0 shadow-[0px_4px_8px_rgba(0,0,0,0.30)] overflow-hidden pointer-events-none" />
              <div data-layer="Frame 64" className="Frame64 z-10 w-full p-2.5 left-[-62px] top-[-10px] absolute inline-flex flex-col justify-start items-start gap-2.5" />
              <div data-layer="Rectangle 29" className="Rectangle29 z-10 self-stretch h-36 opacity-20 bg-zinc-300" />

              {/* Task box chuchu */}
              <div data-layer="Rectangle 31" className="Rectangle31 w-72 h-72 left-[12vw] top-[22vh] flex absolute rounded-[30px] bg-[#223F61]">
                  <p data-layer="Title" className="Title left-8 top-4 absolute text-center justify-start text-white text-xl font-normal font-['Poppins']">Title</p>
                  <img src="/dots-vertical.png" className="w-6 h-6 top-5 right-6 absolute"/>
                  <div data-layer="Line 3" className="Line3 w-65 h-0 left-3 top-13 absolute outline outline-1 outline-offset-[-0.50px] outline-white"></div>
                  <div data-layer="add task button" className=" p-6 flex flex-row space-x-4 top-10 absolute">
                    <div data-layer="Ellipse 43" className="Ellipse43 w-5 h-5 rounded-full border-[1.50px] border-white" />
                    <p data-layer="Insert Task Here" className="InsertTaskHere text-center justify-start text-white text-base font-normal font-['Poppins']">Insert Task Here</p>
                  </div>
              </div>

                <div data-layer="Rectangle 54" className="Rectangle54 w-12 h-12 left-[297px] top-[728px] absolute bg-[#E68C3A] rounded-2xl">
                    <img src="/plus.png" />
                </div>
            </div>
        </div>
    );
};

export default ToDoList;