import styles from "./auth/login/loginpage.module.css";
import Image from "next/image";

export default function Home() {
  return (
    /*Main Content*/
    <div className="w-full h-screen relative bg-white overflow-hidden">
      <img className="absolute inset-0 w-full h-full z-0" src="/bg.png" />
      <div className="w-[791px] h-full left-0 top-0 absolute bg-stone-100" />
      <div className="w-[1470px] h-full left-[600px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0" />
      <div className="w-[1036px] h-full left-[396px] top-0 absolute bg-gradient-to-r from-stone-100 to-stone-100/0 blur-[10px]" />
      <div className="w-[1920px] h-full left-[-233px] top-0 absolute bg-stone-100/0 backdrop-blur-lg" />
      <div className="w-[748px] h-[574px] left-[111px] top-[283px] absolute bg-blue-200/60 rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.30)]" />
      <div className="w-[455px] h-44 left-[257px] top-[172px] absolute justify-start text-cyan-900 text-7xl font-bold font-['Montserrat']">SCHEATHER</div>
      <div className="left-[372px] top-[786px] absolute justif y-start text-stone-900/50 text-2xl font-normal font-['Montserrat']">Forgot Password?</div>
      <div className="w-[605px] h-20 left-[186px] top-[472px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center">
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
        />
      </div>

      <div className="w-[605px] h-20 left-[186px] top-[345px] absolute bg-stone-100 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-zinc-600 px-8 flex items-center">
        <input
          type="email"
          placeholder="Input Email"
          className="w-full h-full bg-transparent outline-none text-stone-900 text-3xl font-['Montserrat'] placeholder-stone-900/50"
        />
      </div>
      <div className="w-58 h-10 left-[253px] top-[586px] absolute flex items-center gap-4">
        <input
          type="checkbox"
          id="show-password"
          className="w-10 h-10 scale-125 bg-stone-100 rounded-[10px] border border-stone-900 accent-stone-900"
        />
        <label
          htmlFor="show-password"
          className="text-stone-900/50 text-2xl font-normal font-['Montserrat'] whitespace-nowrap"
        >
          Show Password
        </label>
      </div>

      <button
        data-hover="Default"
        className="w-72 h-20 absolute left-[335px] top-[666px] bg-cyan-900 hover:bg-cyan-800 transition duration-300 rounded-[30px] outline outline-2 outline-offset-[-2px] outline-cyan-900 text-stone-100 text-3xl font-normal font-['Montserrat'] flex items-center justify-center"
      >
        Log In
      </button>

    </div>
  );
}
