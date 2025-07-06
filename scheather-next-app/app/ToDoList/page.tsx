"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";;
import { auth } from "@/app/lib/firebaseConfig";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  starred: boolean;
}

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

  const [showPopup, setShowPopup] = useState(false);
  const [checked, setChecked] = useState (false);
  const [starred, setStarred] = useState(false);

  const [tasks, setTasks]   = useState<Task[]>([]);
  const [newTitle, setNewTitle]   = useState('');

  const [activeTab, setActiveTab] = useState<'all' | 'starred'>('all');
  //para sa tasks
 const addTask = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),        // or nanoid()
      text: newTitle.trim(),
      completed: false,
      starred: false,
    };
    setTasks(t => [...t, newTask]);
    setNewTitle('');
    setShowPopup(false);

    // TODO: POST /tasks  (newTask)    <-- call your backend here
  };

const patchTask = (id: string, data: Partial<Task>) => {
    setTasks(t =>
      t.map(task => (task.id === id ? { ...task, ...data } : task))
    );

    // TODO: PATCH /tasks/{id}  (data)  <-- sync this change
  };
  
  //filter para sa starred tasks
  const visibleTasks =
    activeTab === 'starred' ? tasks.filter(t => t.starred) : tasks;

  const removeTask = (id: string) => {
    setTasks(t => t.filter(task => task.id !== id));

    // TODO: DELETE /tasks/{id}
  };

  


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
                    {/* create button */}
                    <button data-layer="Rectangle 32"
                    onClick={() => setShowPopup(true)}
                    className="Rectangle32 group relative inline-flex items-center gap-2 cursor-pointer w-38 h-15 px-3 rounded-[30px]

                          /* ─── default look ─── */
                          bg-[#E68C3A] text-white

                          /* ─── press animation ─── */
                          transition-all duration-100 ease-out
                          active:scale-95 active:duration-50 active:ease-in
                          active:bg-white">
                      <img src="/plus.png" className="star lg:w-10 lg:h-10 pointer-events-none
                          transition-opacity duration-100 ease-out
                          group-active:opacity-0"/>
                      <img src="/plus orange.png" className="star lg:w-10 lg:h-10 absolute left-3 opacity-0 pointer-events-none
                          transition-opacity duration-100 ease-in
                          group-active:opacity-100"/>
                      <span data-layer="Create" className="Create text-xl font-normal font-['Poppins'] select-none pointer-events-none
                          transition-colors duration-100 ease-out
                          group-active:text-[#E68C3A]">Create</span>
                    </button>

                    {/* Popup Modal */}
                    {showPopup && (
                      <div className="bgPopup fixed top-20 h-full inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg w-[40vw] text-center absolute top-20">
                          <div className="wrappertext flex flex-row justify-center">
                              <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
                              <h1 
                                  onClick={() => setShowPopup(false)}
                                  className="text-lg font-semibold mb-4 right-10 absolute cursor-pointer">X</h1>
                          </div>
                          
                          <div className=" p-2 mx-10 my-2 bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
                              <input
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)} 
                                placeholder="Add Title"
                                className="inputTask w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"/>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            This is where you can add your form or create content.
                          </p>
                          <button
                            onClick={addTask}
                            className="mt-2 px-4 py-2 bg-[#E68C3A] text-white rounded-[20px] hover:bg-[#d27d2c] transition-colors">
                            Add Task
                          </button>
                        </div>
                      </div>
                    )}

                    {/* All Task button */}
                   <button
                      onClick={() => setActiveTab('all')}
                      className={`
                        group relative inline-flex items-center gap-2 cursor-pointer
                        lg:w-65 h-10 px-8 rounded-[30px]
                        transition-all duration-100 ease-out active:scale-95 active:duration-50 active:ease-in
                        ${activeTab === 'all' ? 'bg-white' : 'bg-[#223F61] text-white'}`}>
                      {/* unchecked icon */}
                      <img
                        src="/circle-check-white.png"
                        alt=""
                        className={`
                          lg:w-8 lg:h-8 pointer-events-none transition-opacity duration-100
                          ${activeTab === 'all' ? 'opacity-0' : 'opacity-100'}
                          group-active:opacity-0
                        `}
                      />
                      {/* checked icon */}
                      <img
                        src="/circle-check.png"
                        alt=""
                        className={`
                          lg:w-8 lg:h-8 absolute left-8 pointer-events-none transition-opacity duration-100
                          ${activeTab === 'all' ? 'opacity-100' : 'opacity-0'}
                          group-active:opacity-100`}/>

                      <span
                        className={`
                          text-xl font-normal font-['Poppins'] select-none pointer-events-none
                          transition-colors duration-100
                          ${activeTab === 'all' ? 'text-[#94B7EF]' : 'text-white'}
                          group-active:text-[#94B7EF]'`}>
                        All tasks
                      </span>
                    </button>

                    {/* ───────────── Starred button ───────────── */}
                    <button
                      onClick={() => setActiveTab('starred')}
                      className={`
                        group relative inline-flex items-center gap-2 cursor-pointer
                        lg:w-65 h-10 px-9 rounded-[30px]
                        transition-all duration-100 ease-out active:scale-95 active:duration-50 active:ease-in
                        ${activeTab === 'starred' ? 'bg-white' : 'bg-[#223F61] text-white'}`}>
                      {/* empty star */}
                      <img
                        src="/star.png"
                        alt=""
                        className={`
                          lg:w-6 lg:h-6 pointer-events-none transition-opacity duration-100
                          ${activeTab === 'starred' ? 'opacity-0' : 'opacity-100'}
                          group-active:opacity-0`}/>
                      {/* filled star */}
                      <img
                        src="/star light blue.png"
                        alt=""
                        className={`
                          lg:w-6 lg:h-6 absolute left-9 pointer-events-none transition-opacity duration-100
                          ${activeTab === 'starred' ? 'opacity-100' : 'opacity-0'}
                          group-active:opacity-100`}/>

                      <span
                        className={`
                          text-xl font-normal font-['Poppins'] select-none pointer-events-none
                          transition-colors duration-100
                          ${activeTab === 'starred' ? 'text-[#94B7EF]' : 'text-white'}
                          group-active:text-[#94B7EF]'`}>
                        Starred
                      </span>
                    </button>
                </div>
                
                <div data-layer="lists" className="flex flex-col space-y-5 px-10">
                  <div data-layer="Line 2" className="Line2 w-65 h-0 outline outline-1 outline-offset-[-0.50px] outline-white"></div>
                    <div data-layer="listbox" className="flex flex-row items-center pl-10 space-x-5">
                      <div data-layer="bullet" className="bullet lg:w-3 lg:h-3  bg-zinc-300 rounded-full" />
                      <p data-layer="Tasks" className="Lists text-center justify-start text-white text-xl font-normal font-['Poppins']">Tasks</p>
                    </div>
                </div>

                </div>
              {/* Task box rectangle basta kana*/}
              {activeTab === 'all' && (
                <div className="relative w-[739px] h-96 bg-[#223F61] rounded-[30px] p-6 listbox mt-10 ml-100">
                {/* Title */}
                <p className="text-white text-2xl font-normal font-['Poppins'] mb-2">My Tasks</p>
                
                {/* Divider line */}
                <div className="w-full h-px bg-white my-2" />

                {/* Task Row */}
                {tasks.map(({ id, text, completed, starred }) => (
                <div 
                key={id}
                className="flex items-center gap-4 mt-6 relative">
                  <button
                    type="button"
                    onClick={() => patchTask(id, { completed: !completed })}                 //flip state on click
                    className="focus:outline-none select-none">
                      <img
                        src="/unchecked.png"
                        alt="Unchecked circle"
                        className={`w-6 h-6 transition-opacity
                                    ${completed ? 'opacity-0' : 'opacity-100'}`}/>
                      {/* checked circle */}
                      <img
                        src="/circle-check-white.png"
                        alt="Checked circle"
                        className={`w-6 h-6 absolute left-0 top-0 transition-opacity
                                    ${completed ? 'opacity-100' : 'opacity-0'}`}/>
                  </button>

                  <input
                    value={text}
                    onChange={e => patchTask(id, { text: e.target.value })}
                    placeholder="Insert Task"
                    className=" absolute left-10 text-white text-xl font-normal w-full h-full px-3 bg-transparent
                              placeholder:text-white/50 lg:text-lg sm:text-sm font-['Montserrat']
                              rounded-[30px] outline-none"/>
                  <div className="flex flex-row space-x-10 absolute right-10">
                      <button
                        type="button"
                        onClick={() => patchTask(id, { starred: !starred })}
                        className="relative w-6 h-6 flex-shrink-0 focus:outline-none cursor-pointer">
                        {/* Empty star */}
                        <img
                          src="/star.png"
                          alt="Empty star"
                          className={`w-full h-full transition-opacity
                                      ${starred ? 'opacity-0' : 'opacity-100'}`}/>

                        {/* Filled star */}
                        <img
                          src="/star white filled.png"
                          alt="Filled star"
                          className={`w-full h-full absolute left-0 top-0 transition-opacity
                                      ${starred ? 'opacity-100' : 'opacity-0'}`}/>
                      </button>
                      <button 
                        onClick={() => removeTask(id)}
                        className="text-lg text-white font-['Poppins'] leading-none">X
                        
                      </button>
                    
                  </div>
                  
                </div>
                ))}
              </div>
              )}
              
                  {/* starred tasks */}
                  {activeTab === 'starred' && (
                      <div className="items-center w-[739px] h-96 bg-[#223F61] mt-10 ml-100 text-white rounded-[30px] p-6 ">
                        <div>
                           {/* Title */}
                            <p className="text-white text-2xl font-normal font-['Poppins'] mb-2">Starred Tasks</p>
                            
                            {/* Divider line */}
                            <div className="w-full h-px bg-white my-2" />
                        </div>
                    {visibleTasks.length === 0 ? (
                      <p className="text-center text-white/70">
                        {activeTab === 'starred' ? 'No starred tasks yet.' : 'No tasks yet.'}
                      </p>
                    ) : (
                      visibleTasks.map(({ id, text, completed, starred }) => (
                        <div key={id} className="flex items-center gap-4 mt-4 relative">
                          {/* ✔ checkbox */}
                          <button
                            onClick={() => patchTask(id, { completed: !completed })}
                            className="relative w-6 h-6 focus:outline-none"
                          >
                            <img
                              src="/unchecked.png"
                              className={`w-full h-full transition-opacity ${
                                completed ? 'opacity-0' : 'opacity-100'
                              }`}
                              alt=""
                            />
                            <img
                              src="/circle-check-white.png"
                              className={`w-full h-full absolute inset-0 transition-opacity ${
                                completed ? 'opacity-100' : 'opacity-0'
                              }`}
                              alt=""
                            />
                          </button>

                          {/* starred tasks */}
                          <input
                            value={text}
                            onChange={e => patchTask(id, { text: e.target.value })}
                            placeholder="Insert Task"
                            className="flex-grow bg-transparent outline-none text-white
                                      placeholder:text-white/50 text-lg font-['Montserrat']"
                          />

                          {/* star + delete */}
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => patchTask(id, { starred: !starred })}
                              className="relative w-6 h-6 flex-shrink-0 focus:outline-none"
                            >
                              <img
                                src="/star.png"
                                className={`w-full h-full transition-opacity ${
                                  starred ? 'opacity-0' : 'opacity-100'
                                }`}
                                alt=""
                              />
                              <img
                                src="/star white filled.png"
                                className={`w-full h-full absolute inset-0 transition-opacity ${
                                  starred ? 'opacity-100' : 'opacity-0'
                                }`}
                                alt=""
                              />
                            </button>

                            <button
                              onClick={() => removeTask(id)}
                              className="text-lg font-['Poppins'] leading-none cursor-pointer">X
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  )}
                  

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