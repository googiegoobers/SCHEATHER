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
  const router = useRouter();

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
      // setSuccess("User created successfully!");
      router.push("/dashboard");
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
        <div className="blue-form-bg">
          <form className="vertical-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input-box"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input-box"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Input Email"
              className="input-box"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className="input-box"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="w-48 h-10 left-[105px] top-[323px] absolute flex items-center gap-1">
              <input
                type="checkbox"
                className="w-10 h-10 scale-50 bg-stone-100 rounded-[20px] border border-stone-900 accent-stone-900"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label
                htmlFor="show-password"
                className="text-stone-900/50 text-1xl font-normal font-['Montserrat'] whitespace-nowrap"
              >
                Show Password
              </label>
            </div>

            <button type="submit" className="submit-btn">
              Sign Up
            </button>

            <div className="left-[130px] bottom-[30px] relative  justify-start text-stone-900/50 text-1xl font-normal font-['Montserrat']">
              <Link href="/auth/login" passHref>
                Do you have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="w-[625px] h-25 left-[200px] top-[52px] absolute justify-start text-cyan-900 text-5xl font-bold font-['Montserrat']">
        SCHEATHER
      </div>
    </div>
  );
};

export default SignUpCard;
