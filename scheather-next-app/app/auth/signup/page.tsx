"use client";
import Link from "next/link";
import Image from "next/image";
import "./signup.css";
import { useState, ChangeEvent, FormEvent } from "react";
import { auth } from "@/app/lib/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string; 
}

const SignUpCard: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword:""
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();
  setError(null);
  setSuccess(null);

  // Check if passwords match
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    // Step 1: Create user
    const result = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password,
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

    <div className = "signup-background">
      {/*Inside the Container for Desktop*/} 
      <div className="form-bg"> 
         {/*Left Side of the Container*/}
         <div className="container-left-side">
          <form onSubmit={handleSubmit}>
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
              className="text-[#223F61] lg:text-3xl sm:text-2xl"
              style={{
                fontFamily: 'Poppins',
              }}
            >
              Create an Account
            </h2>

                {/* Inputs */}

                <p className="text-[#223F61] lg:p5px my-1.5"
                   style={{
                    fontFamily: 'Poppins',
                   }}>
                  First Name
                </p>
                <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"
                    />
                </div>

                <p className="text-[#223F61] lg:p5px my-1.5"
                  style={{
                    fontFamily: 'Poppins',
                  }}>
                  Last Name
                </p>
                <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"
                  />
                </div>
                
                <p className="text-[#223F61] lg:p5px my-1.5"
                  style={{
                    fontFamily: 'Poppins',
                  }}>
                  Email
                </p>
                <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
                  <input
                    type="text"
                    name="email"
                    placeholder="Input Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none"
                  />
                </div>

                <p className="text-[#223F61] lg:p5px my-1.5"
                  style={{
                    fontFamily: 'Poppins',
                  }}>
                  Password
                </p>
                <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
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
                    className="w-[25px] h-[25px] mt-1.5  cursor-pointer"
                  />
                  </button>
                </div>

                <p className="text-[#223F61] lg:p5px my-1.5"
                  style={{
                    fontFamily: 'Poppins',
                  }}>
                Re-enter Password
                </p>
                <div data-blank="Default" className="lg:w-90 lg:h-10  relative bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-full px-6 bg-transparent text-stone-900 placeholder:text-stone-900/50 lg:text-lg sm:text-sm font-normal font-['Montserrat'] rounded-[30px] outline-none "
                  />
                  <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 focus:outline-none"
                  >
                  <img
                    src={showConfirmPassword ? "/eye.svg" : "/eye-closed.svg"}
                    alt="Toggle visibility"
                    className="w-[25px] h-[25px] mt-1.5  cursor-pointer"
                  />
                </button>
                </div>
                  
                <button
                  type="submit"
                  className="w-50 h-11 mt-3 ml-15 bg-[#223F61] text-stone-100 rounded-[30px] outline outline-2 
                    outline-offset-[-2px] outline-[#223F61] flex items-center justify-center text-xl font-normal
                    font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61] cursor-pointer"
                >
                  Sign up
                </button>   
          </form>

            <div className="Login-link">
              <p className="text-[#223F61] font-normal font-['Poppins']">Already have an account?</p>
              <Link href="/auth/login">
                <p className="text-[#223F61] font-normal font-['Poppins'] hover:underline cursor-pointer ml-23">Log in</p>
              </Link>
            </div>

          </div>
           
            {/*Right side of the Container*/}
            <div className="Justify-center flex m-10 relative">
              <img
                src="/hero-logo.png"
                className=""
                alt="Hero Logo"
              />
            </div>
      </div>
    </div>
            

  );
};

export default SignUpCard;
