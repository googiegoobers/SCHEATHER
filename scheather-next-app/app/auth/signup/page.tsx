"use client";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import "./signup.css";
import { useState, ChangeEvent, FormEvent } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
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
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

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
      console.log("Passwords do not match! Try Again.");
      // alert("Signup failed! \nPasswords do not match.");
      setError("Passwords do not match.");
      return;
    }

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

      // Step 3: Create user document in Firestore with role 'user'
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: "user",
      });

      console.log(
        "✅ User created, profile updated, and Firestore doc set!",
        user
      );
      // setSuccess("User created successfully!");
      router.push("/dashboard");
      // Optional: redirect or show success message here
    } catch (err: any) {
      console.error("❌ Error during signup:", err.message);
      // alert(`Login failed: ${err.message}`);
      setError(err.message || "Signup failed");
      // Optional: show error message to user
    }
  };

  return (
    <div className="bg-white flex flex-col min-h-screen overflow-auto">
      {/* Header*/}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-QMVC5BR2W3"
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());

          gtag("config", "G-QMVC5BR2W3");`}
      </Script>
      {/*Inside the Container for Desktop*/}
      <div className="hidden lg:flex flex-1 justify-center items-center">
        <header
          className="w-full h-20 bg-white shadow-[0px_1.5px_15px_0px_rgba(0,0,0,0.20)] fixed top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-20"
          style={{
            fontFamily: "Poppins",
          }}
        >
          {/* Brand Logo */}
          <div
            className="text-black text-xl sm:text-2xl font-medium"
            style={{
              fontFamily: '"Cedarville Cursive", cursive',
            }}
          >
            Scheather
          </div>

          {/* Desktop Navigation - right aligned */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <Link href="/" passHref>
              <h1 className="text-black text-sm xl:text-base hover:cursor-pointer after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                Back to Landing Page
              </h1>
            </Link>
          </div>
        </header>
        <div className="mt-30 lg:w-[85vw] lg:h-[90vh] bg-white rounded-[2.5vh] shadow-[0px_1vh_0.4vh_0px_rgba(34,63,97,0.25)] border-[0.4vh] border-[#223F61] flex flex-row initial=scale1.0">
          {/*Left Side of the Container*/}
          <div className="hidden lg:flex relative Justify-center flex lg:top-[5vh] lg:px-[9vw] flex-col">
            <form onSubmit={handleSubmit}>
              <Link href="/">
                <h1
                  className=" text-[#223F61] text-xl sm:text-5xl font-medium"
                  style={{
                    fontFamily: '"Cedarville Cursive", cursive',
                  }}
                >
                  {" "}
                  Scheather
                </h1>
              </Link>

              <h2
                className="text-[#223F61] lg:text-3xl sm:text-2xl"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Create an Account
              </h2>
              {/* Inputs */}
              <p
                className="text-[#223F61] lg:p5px my-1.5"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                First Name
              </p>
              <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600">
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

              <p
                className="text-[#223F61] lg:p5px my-1.5"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Last Name
              </p>
              <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600">
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

              <p
                className="text-[#223F61] lg:p5px my-1.5"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Email
              </p>
              <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600">
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

              <p
                className="text-[#223F61] lg:p5px my-1.5"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Password
              </p>
              <div className="lg:w-90 lg:h-10 relative bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600">
                <input
                  type={showPassword ? "text" : "password"}
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

              <p
                className="text-[#223F61] lg:p5px my-1.5"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Re-enter Password
              </p>
              <div
                data-blank="Default"
                className="lg:w-90 lg:h-10  relative bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600"
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
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

              <div className="flex items-left w-full mt-2 gap-4">
                {/* Error message */}
                {error && (
                  <p className=" text-red-500 text-sm font-['Poppins']">
                    {error}
                  </p>
                )}
                {/* Success message */}
                {success && (
                  <p className=" text-green-500 text-sm font-['Poppins']">
                    {success}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center w-full mt-4 gap-4">
                <button
                  type="submit"
                  className="w-full max-w-xs h-10 bg-[#223F61] text-stone-100 rounded-[30px] outline-2 
                    outline-offset-[-2px] outline-[#223F61] flex items-center justify-center text-xl font-normal
                    font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61] cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div className="w-full flex items-center mb-3 mt-5 text-base lg:text-lg">
              <p className="text-[#223F61] font-normal font-['Poppins'] flex-1">
                Already Have an Account?
              </p>
              <Link href="/auth/login" className="w-auto">
                <p className="text-[#223F61] font-semibold font-['Poppins'] cursor-pointer hover:underline text-right">
                  Log in
                </p>
              </Link>
            </div>
          </div>

          {/*Right side of the Container*/}
          <div className="Justify-center flex m-10 relative">
            <img src="/hero-logo.png" className="" alt="Hero Logo" />
          </div>
        </div>
      </div>
      {/* mobile */}
      <div className="lg:hidden flex flex-col flex-1 w-full overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md mx-auto px-4 py-8"
        >
          <div className="flex items-center mb-4">
            <Link href="/">
              <img src="/left arrow.svg" alt="Back" className="w-6 h-6 mr-2" />
            </Link>
            <h2 className="text-cyan-900 text-3xl font-bold font-['Poppins'] ml-2">
              Sign up
            </h2>
          </div>

          <label className="text-cyan-900 text-lg font-normal font-['Poppins'] capitalize">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full h-10 px-6 bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 placeholder:text-stone-900/50 text-base font-normal font-['Montserrat']"
          />

          <label className="text-cyan-900 text-lg font-normal font-['Poppins'] capitalize">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full h-10 px-6 bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 placeholder:text-stone-900/50 text-base font-normal font-['Montserrat']"
          />

          <label className="text-cyan-900 text-lg font-normal font-['Poppins'] capitalize">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Input Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full h-10 px-6 bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 placeholder:text-stone-900/50 text-base font-normal font-['Montserrat']"
          />

          <label className="text-cyan-900 text-lg font-normal font-['Poppins'] capitalize">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-10 px-6 bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 placeholder:text-stone-900/50 text-base font-normal font-['Montserrat']"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none"
            >
              <img
                src={showPassword ? "/eye.svg" : "/eye-closed.svg"}
                alt="Toggle visibility"
                className="w-[25px] h-[25px] cursor-pointer"
              />
            </button>
          </div>

          <label className="text-cyan-900 text-lg font-normal font-['Poppins'] capitalize">
            Re-Enter Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full h-10 px-6 bg-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-zinc-600 text-stone-900 placeholder:text-stone-900/50 text-base font-normal font-['Montserrat']"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none"
            >
              <img
                src={showConfirmPassword ? "/eye.svg" : "/eye-closed.svg"}
                alt="Toggle visibility"
                className="w-[25px] h-[25px] cursor-pointer"
              />
            </button>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
            {error && (
              <p className=" text-red-500 text-sm font-['Poppins']">{error}</p>
            )}

            {/* Success message */}
            {success && (
              <p className=" text-green-500 text-sm font-['Poppins']">
                {success}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-2 bg-cyan-900 text-stone-100 rounded-[30px] outline-2 outline-offset-[-2px] outline-cyan-900 flex items-center justify-center text-lg font-normal font-['Montserrat'] transition-colors duration-300 hover:bg-[#94B7EF] hover:text-[#223F61] cursor-pointer"
          >
            Sign up
          </button>

          <div>
            <p className="text-center justify-start text-[#223F61] text-s font-normal font-['Poppins']">
              Already Have an Account?
            </p>
            <Link href="/auth/login">
              <p className="text-center justify-start text-[#223F61] text-s font-normal font-['Poppins'] underline">
                Log in
              </p>
            </Link>
          </div>
        </form>
      </div>
      <footer
        className="mt-20 w-full bg-gray-800 text-white px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
        id="contacts"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
          <div
            className="text-white text-center lg:text-left order-1 lg:order-1"
            style={{
              fontFamily: '"Cedarville Cursive", cursive',
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "white",
            }}
          >
            Scheather
          </div>
          <div
            className="text-white text-center lg:text-left order-1 lg:order-1 pt-5"
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(0.75rem, 2vw, 1.5rem)",
              color: "#e68c3a",
            }}
          >
            Schedule together according to the weather.
          </div>

          <div className="text-center lg:text-left w-full lg:w-fit order-2 lg:order-2">
            <p className="text-lg sm:text-xl font-semibold mb-4">Contact Us</p>

            {/* Phone */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <p className="text-base sm:text-lg">0977966554</p>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <p className="text-base sm:text-lg break-all sm:break-normal">
                scheather@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 lg:mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm sm:text-base">
            &copy; 2025 Scheather. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignUpCard;
