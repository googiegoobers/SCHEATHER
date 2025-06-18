"use client";
import Link from "next/link";
import Image from "next/image";
import './signup.css';
import { useState, ChangeEvent, FormEvent } from "react";
import { auth } from "@/app/lib/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpCard: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Create user
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = result.user;

      // Step 2: Update display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      console.log("✅ User created and profile updated!", user);
      setSuccess("User created successfully!");
      alert("Signup successful! \nWelcome user!");
      // Optional: redirect or show success message here
    } catch (err: any) {
      console.error("❌ Error during signup:", err.message);
      alert(`Login failed: ${err.message}`);
      setError(err.message || "Signup failed");
      // Optional: show error message to user
    }
  };

  return (
    
    <div className="signup-background"> 
    <div className="white-left">
      <div className="blue-form-bg" >
<form
        onSubmit={handleSubmit}
        className="relative z-20 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <div className="w-[605px] h-20 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
        <input
          type="firstName"
          name="firstName"
          placeholder="First Name"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
          
          <div className="w-[605px] h-20 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
        <input
          type="lastName"
          name="lastName"
          placeholder="Last Name"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="w-[605px] h-20 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
        <input
          type="email"
          name="email"
          placeholder="Input Email"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

       <div className="w-[605px] h-20 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Input Password"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="w-58 h-10 left-[253px] top-[586px] absolute flex items-center gap-4">
        <input
          type="checkbox"
          className="w-10 h-10 scale-125 bg-stone-100 rounded-[10px] border border-stone-900 accent-stone-900"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <label
          htmlFor="show-password"
          className="text-stone-900/50 text-2xl font-normal font-['Montserrat'] whitespace-nowrap"
        >
          Show Password
        </label>
      </div>

          <button
            type="submit"
            className="w-72 h-20 absolute left-[335px] top-[666px] bg-cyan-900 hover:bg-cyan-800 transition duration-300 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-cyan-900 text-stone-100 text-3xl font-normal font-['Montserrat'] flex items-center justify-center"
          >
            Sign Up
          </button>
        {/* </div> */}

         <div className="justify-start text-stone-900/50 text-2xl font-normal font-['Montserrat']">
    <Link href="/auth/login" passHref>
      Do you have an account?
    </Link>
    </div>
      </form>
        </div>
    </div>
    
   
      
      
      <div className="w-[625px] h-25 left-[190px] top-[52px] absolute justify-start text-cyan-900 text-5xl font-bold font-['Montserrat']">SCHEATHER</div>
   
    
    </div>
  );
};

export default SignUpCard;
