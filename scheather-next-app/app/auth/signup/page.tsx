"use client";
import Link from "next/link";
import Image from "next/image";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

import React, { useState } from "react";

const SignUpCard: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your submit logic here (e.g., API call)
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <div className="flex flex-col gap-4 bg-white p-8 rounded shadow-md min-w-[350px]">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            First Name:
            <input
              type="text"
              name="firstName"
              className="border border-blue-300 rounded p-2 bg-white mt-1"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Last Name:
            <input
              className="border border-blue-300 rounded p-2 bg-white mt-1"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Email:
            <input
              type="email"
              name="email"
              className="border border-blue-300 rounded p-2 bg-white mt-1"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Password:
            <input
              type="password"
              name="password"
              className="border border-blue-300 rounded p-2 bg-white mt-1"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className="mt-4 bg-[color:#1A314E] rounded-[30px] cursor-pointer rounded p-2 text-white font-semibold hover:bg-[color:#1A314E] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpCard;
