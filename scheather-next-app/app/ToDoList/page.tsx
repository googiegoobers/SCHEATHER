"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/app/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { Task, subscribeToTasks, addTask, patchTask, deleteTask } from "@/app/lib/tasksService";

interface Props {
  task: Task;
  onPatch: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
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

  // Subscribe to Firestore tasks
  useEffect(() => {
    const unsubscribe = subscribeToTasks((tasks) => {
      setTasks(tasks);
    });
    
    return () => unsubscribe();
  }, []);

  //para sa tasks
 const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    
    try {
      await addTask(newTitle.trim());
      setNewTitle('');
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding task:', error);
      // You might want to show an error message to the user here
    }
  };

const handlePatchTask = async (id: string, data: Partial<Task>) => {
    try {
      await patchTask(id, data);
    } catch (error) {
      console.error('Error updating task:', error);
      // You might want to show an error message to the user here
    }
  };
  
  //filter para sa starred tasks
  const visibleTasks =
    activeTab === 'starred' ? tasks.filter(t => t.starred) : tasks;

  const handleRemoveTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      // You might want to show an error message to the user here
    }
  };

  


    return(
        <div className="bg-white flex items-center justify-center inset-0 fixed overflow-y-auto">
            {/* DESKTOP*/}
            <div
              data-layer="To-Do List"
              className="ToDoListDesktop hidden sm:block top-30 w-full min-h-screen relative bg-white ">
              {/* ─── header bar ─── */}
              <div
                data-layer="Frame 63"
                className="fixed top-0 left-0 z-80 w-full h-20 bg-white overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.30)]">
                <div className="absolute init-0 lg:h-20 bg-zinc-300 " />


                <Link href="/dashboard">
                  <div className="absolute top-5 left-14 flex cursor-pointer items-center space-x-3">
                    <img src="left arrow.svg" className="h-8 w-8" alt="Back" />
                    <span className="font-['Cedarville_Cursive'] text-3xl font-normal text-black">
                      Scheather
                    </span>
                  </div>
                </Link>

                {/* notifications icon */}
                <div
                  data-layer="notifications"
                  className="absolute top-[15px] left-[1175px] h-16 w-16 overflow-hidden"
                >
                  <div
                    data-layer="icon"
                    className="absolute left-[10.83px] top-[5.42px] h-14 w-11 bg-Schemes-On-Surface"
                  />
                </div>

                {/* profile */}
                <div className="absolute top-5 right-20 flex items-center space-x-4">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-10 w-10 cursor-pointer rounded-full object-cover border-2 border-[#e68c3a]"
                  />
                  <div className="hidden min-w-0 flex-col truncate sm:flex">
                    <div className="truncate text-sm font-semibold text-black">{name}</div>
                    <div className="truncate text-xs text-black">{email}</div>
                  </div>
                
                </div>
              </div>

              {/* ─── sidebar ─── */}
              <div
                data-layer="Rectangle 30"
                className="fixed left-[-5px] top-[80px] h-full bg-[#223F61] lg:w-80"
              >
                {/* all sidebar buttons */}
                <div data-layer="buttons" className="p-10 flex flex-col space-y-5">
                  {/* create */}
                  <button
                    onClick={() => setShowPopup(true)}
                    className="group relative inline-flex h-15 w-38 items-center gap-2 cursor-pointer rounded-[30px] bg-[#E68C3A] px-3 text-white transition-all duration-100 active:scale-95 active:bg-white"
                  >
                    <img
                      src="/plus.png"
                      className="pointer-events-none h-10 w-10 transition-opacity duration-100 group-active:opacity-0 lg:w-10 lg:h-10"
                    />
                    <img
                      src="/plus orange.png"
                      className="absolute left-3 h-10 w-10 opacity-0 pointer-events-none transition-opacity duration-100 group-active:opacity-100 lg:w-10 lg:h-10"
                    />
                    <span className="font-['Poppins'] text-xl font-normal transition-colors duration-100 group-active:text-[#E68C3A]">
                      Create
                    </span>
                  </button>

                  {/* all‑tasks */}
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`group relative inline-flex h-10 items-center gap-2 rounded-[30px] px-8 lg:w-65 transition-all duration-100 active:scale-95 ${
                      activeTab === 'all' ? 'bg-white' : 'bg-[#223F61] text-white'
                    }`}
                  >
                    <img
                      src="/circle-check-white.png"
                      className={`pointer-events-none h-8 w-8 transition-opacity duration-100 ${
                        activeTab === 'all' ? 'opacity-0' : 'opacity-100'
                      } group-active:opacity-0`}
                    />
                    <img
                      src="/circle-check.png"
                      className={`absolute left-8 h-8 w-8 pointer-events-none transition-opacity duration-100 ${
                        activeTab === 'all' ? 'opacity-100' : 'opacity-0'
                      } group-active:opacity-100`}
                    />
                    <span
                      className={`font-['Poppins'] text-xl font-normal transition-colors duration-100 ${
                        activeTab === 'all' ? 'text-[#94B7EF]' : 'text-white'
                      } group-active:text-[#94B7EF]`}
                    >
                      All tasks
                    </span>
                  </button>

                  {/* starred */}
                  <button
                    onClick={() => setActiveTab('starred')}
                    className={`group relative inline-flex h-10 items-center gap-2 rounded-[30px] px-9 lg:w-65 transition-all duration-100 active:scale-95 ${
                      activeTab === 'starred' ? 'bg-white' : 'bg-[#223F61] text-white'
                    }`}
                  >
                    <img
                      src="/star.png"
                      className={`h-6 w-6 pointer-events-none transition-opacity duration-100 ${
                        activeTab === 'starred' ? 'opacity-0' : 'opacity-100'
                      } group-active:opacity-0`}
                    />
                    <img
                      src="/star light blue.png"
                      className={`absolute left-9 h-6 w-6 pointer-events-none transition-opacity duration-100 ${
                        activeTab === 'starred' ? 'opacity-100' : 'opacity-0'
                      } group-active:opacity-100`}
                    />
                    <span
                      className={`font-['Poppins'] text-xl font-normal transition-colors duration-100 ${
                        activeTab === 'starred' ? 'text-[#94B7EF]' : 'text-white'
                      } group-active:text-[#94B7EF]`}
                    >
                      Starred
                    </span>
                  </button>
                </div>

                {/* “Tasks” label under the buttons */}
                <div data-layer="lists" className="flex flex-col space-y-5 px-10">
                  <div className="w-65 outline-white outline outline-1 outline-offset-[-0.5px]" />
                  <div className="flex flex-row items-center pl-10 space-x-5">
                    <div className="h-3 w-3 rounded-full bg-zinc-300" />
                    <p className="font-['Poppins'] text-xl font-normal text-white">Tasks</p>
                  </div>
                </div>
              </div>

            {/* ─── TASK PANEL: BOTH TABS ─── */}
            <section className="ml-100 mt-60 w-[65%] rounded-[30px] bg-[#223F61] p-4 mb-24">
              <p className="text-white text-xl font-['Poppins']">
                {activeTab === 'starred' ? 'Starred Tasks' : 'My Tasks'}
              </p>
              <div className="my-2 h-px w-full bg-white/50" />

              {visibleTasks.length === 0 ? (
                <p className="py-8 text-center text-white/70">
                  {activeTab === 'starred' ? 'No starred tasks yet.' : 'No tasks yet.'}
                </p>
              ) : (
                visibleTasks.map((task) => {
                  if (!task.id) return null; // Skip tasks without id
                  const { id, text, completed, starred } = task;
                  return (
                  <div key={id} className="flex items-center gap-3 py-2">
                    {/* Checkbox */}
                    <button
                      onClick={() => handlePatchTask(id, { completed: !completed })}
                      className="relative h-5 w-5 focus:outline-none"
                    >
                      <img
                        src="/unchecked.png"
                        className={`h-full w-full transition-opacity ${completed ? 'opacity-0' : ''}`}
                        alt=""
                      />
                      <img
                        src="/circle-check-white.png"
                        className={`absolute inset-0 h-full w-full transition-opacity ${
                          completed ? '' : 'opacity-0'
                        }`}
                        alt=""
                      />
                    </button>

                    {/* Task Text Input */}
                    <input
                      value={text}
                      onChange={(e) => handlePatchTask(id, { text: e.target.value })}
                      placeholder="Insert Task"
                      className="flex-grow bg-transparent text-base text-white placeholder:text-white/50 outline-none font-['Montserrat']"
                    />

                    {/* Star & Delete Buttons */}
                    <div className="flex items-center gap-4">
                      <button
                      
                        onClick={() => handlePatchTask(id, { starred: !starred })}
                        className="relative h-5 w-5">
                        <img
                          src="/star.png"
                          className={`h-full w-full ${starred ? 'opacity-0' : ''}`}
                          alt=""
                        />
                        <img
                          src="/star white filled.png"
                          className={`absolute inset-0 h-full w-full ${starred ? '' : 'opacity-0'}`}
                          alt=""
                        />
                      </button>

                      <button
                        onClick={() => handleRemoveTask(id)}
                        className="text-base text-white"
                      >
                        X
                      </button>
                    </div>
                  </div>
                  );
                }).filter(Boolean)
              )}
            </section>

            </div>

              {/* Popup Modal */}
              {showPopup && (
                /* ───── overlay ───── */
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                {/* ───── dialog ───── */}
                <div
                  className="
                    relative rounded-lg bg-white p-6 shadow-lg
                    w-[90vw]  max-w-sm
                    sm:w-[75vw] sm:max-w-md
                    md:w-[60vw]
                    lg:w-[40vw]
                  "
                >
                  {/* close “X” */}
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute right-4 top-4 text-xl font-bold text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>

                  {/* title */}
                  <h2 className="mb-4 text-lg font-semibold text-center">Create New Task</h2>

                  {/* input */}
                  <div className="mx-auto mb-4 w-full rounded-[30px] bg-stone-100 px-2 outline outline-2 outline-offset-[-2px] outline-zinc-600">
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Add Title"
                      className="w-full rounded-[30px] bg-transparent px-2 py-2 font-['Montserrat'] text-stone-900 placeholder:text-stone-900/50 focus:outline-none"
                    />
                  </div>

                  {/* hint text */}
                  <div className="flex justify-center">
                    <p className="mb-4 text-sm text-gray-600 text-center">
                      This is where you can add your Tasks.
                    </p>
                  </div>

                  {/* primary action */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleAddTask}
                      className="rounded-[20px] bg-[#E68C3A] px-4 py-2 text-white transition-colors hover:bg-[#d27d2c]"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              
              </div>
              )}

           {/* Mobile */}
            <div className="block lg:hidden w-full min-h-screen bg-white overflow-y-auto">
              {/* Header */}
              <header className="flex flex-col px-6 pt-6 space-y-3">
                {/* title */}
                <div className="flex items-center m-5 space-x-4">
                  <Link href="/dashboard">
                    <img src="/left arrow.svg" className="w-6 h-6" alt="Back" />
                  </Link>
                  <p className="text-[#223F61] ml-20 text-2xl font-normal font-['Poppins']">
                    Tasks
                  </p>
                </div>

                {/* starred ug My Tasks */}
                <div className="flex items-center justify-center space-x-20">
                  <button
                    onClick={() => setActiveTab('starred')}
                    className="relative w-5 h-5 focus:outline-none"
                  >
                    <img
                      src="/star filled.png"
                      alt="star"
                      className={`w-full h-full transition-opacity duration-150
                                  ${activeTab === 'starred' ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                      src="/star filled light blue.png"
                      alt="star active"
                      className={`absolute inset-0 w-full h-full transition-opacity duration-150
                                  ${activeTab === 'starred' ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </button>

                  <button
                    onClick={() => setActiveTab('all')}
                    className={`
                      text-base font-normal font-['Poppins']
                      transition-colors duration-150
                      ${activeTab === 'all' ? 'text-blue-300' : 'text-[#223F61]'}`}>
                    My Tasks
                  </button>
                </div>
              </header>

              {/* Divider shadow */}
              <div className="w-full h-4 shadow-[0_4px_8px_-4px_rgba(0,0,0,0.30)]" />

              {/* Task box */}
              <section className="mx-auto mt-6 w-[90%] rounded-[30px] bg-[#223F61] p-4 mb-24">
                <p className="text-white text-xl font-['Poppins']">
                  {activeTab === 'starred' ? 'Starred Tasks' : 'My Tasks'}
                </p>
                <div className="h-px w-full bg-white/50 my-2" />

                {visibleTasks.length === 0 ? (
                  <p className="text-white/70 text-center py-8">
                    {activeTab === 'starred' ? 'No starred tasks yet.' : 'No tasks yet.'}
                  </p>
                ) : (
                  visibleTasks.map((task) => {
                    if (!task.id) return null; // Skip tasks without id
                    const { id, text, completed, starred } = task;
                    return (
                    <div key={id} className="flex items-center gap-3 py-2">
                      <button
                        onClick={() => handlePatchTask(id, { completed: !completed })}
                        className="relative w-5 h-5 focus:outline-none"
                      >
                        <img
                          src="/unchecked.png"
                          className={`w-full h-full transition-opacity ${completed ? 'opacity-0' : ''}`}
                        />
                        <img
                          src="/circle-check-white.png"
                          className={`absolute inset-0 w-full h-full transition-opacity ${completed ? '' : 'opacity-0'}`}
                        />
                      </button>

                      <input
                        value={text}
                        onChange={e => handlePatchTask(id, { text: e.target.value })}
                        placeholder="Insert Task"
                        className="flex-grow bg-transparent outline-none text-white placeholder:text-white/50 text-base font-['Montserrat']"
                      />

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handlePatchTask(id, { starred: !starred })}
                          className="relative w-5 h-5"
                        >
                          <img
                            src="/star.png"
                            className={`w-full h-full ${starred ? 'opacity-0' : ''}`}
                          />
                          <img
                            src="/star white filled.png"
                            className={`absolute inset-0 w-full h-full ${starred ? '' : 'opacity-0'}`}
                          />
                        </button>
                        <button
                          onClick={() => handleRemoveTask(id)}
                          className="text-white text-base"
                        >
                          X
                        </button>
                      </div>
                    </div>
                    );
                  }).filter(Boolean)
                )}
              </section>

              {/* floating “add” btn */}
              <button
                onClick={() => setShowPopup(true)}
                className="fixed bottom-6 right-6 w-12 h-12 bg-[#E68C3A] rounded-2xl flex items-center justify-center shadow-lg active:scale-95"
              >
                <img src="/plus.png" />
              </button>
            </div>

        </div>
    );
};

export default ToDoList;