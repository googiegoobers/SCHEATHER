import "./globals.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div className="w-full h-screen relative bg-white overflow-hidden">
        {/* Header */}
        <div className="w-full h-24 relative bg-white shadow-[0px_1.5px_15px_0px_rgba(0,0,0,0.20)]">
          <div className="absolute left-[80px] top-[30px] text-[color:#213E60] text-2xl font-bold font-cedarville italic">
            Scheather
          </div>
          <div className="absolute right-[80px] top-[20px] flex items-center gap-8">
            <a
              href="#"
              className="text-black text-lg hover: cursor-pointer relative inline-block after:block after:h-[2px] after:bg-black after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </a>
            <a
              href="#"
              className="text-black text-lg hover: cursor-pointer relative inline-block after:block after:h-[2px] after:bg-black after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contacts
            </a>
            <button className="w-32 h-12 bg-neutral-200 rounded-[30px] border border-stone-100 text-black text-base hover:cursor-pointer hover:bg-neutral-300 transition-colors">
              Login
            </button>
            <Link href="/auth/signup" passHref>
              <button className="w-32 h-12 bg-[color:#213E60] rounded-[30px] text-white text-base hover: cursor-pointer hover:bg-[color:#1A314E] transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between h-[calc(100vh-96px)] px-[80px] bg-white">
          <div className="flex-1 max-w-[800px]">
            <h1 className="text-[color:#213E60] text-8xl font-bold mb-8">
              SCHEATHER
            </h1>
            <h2 className="text-black/80 text-5xl font-normal mb-12 leading-tight">
              Mini Event Planner <br />
              for Barkadas and Orgs
            </h2>
            <button
              className="group relative cursor-pointer overflow-hidden whitespace-nowrap px-6 py-4 text-black [background:var(--bg)] [border-radius:var(--radius)]  transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(120,120,120,0.7)] flex justify-center"
              style={
                {
                  "--spread": "90deg",
                  "--shimmer-color": "#FFF3E0",
                  "--radius": "100px",
                  "--speed": "1.5s",
                  "--cut": "0.2em",
                  "--bg": "#e68c3a",
                } as React.CSSProperties
              }
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-[-100%] rotate-gradient">
                  <div className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]"></div>
                </div>
              </div>
              <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"></div>
              <div className="z-10 flex items-center justify-center gap-2 w-50">
                <span className="whitespace-pre bg-gradient-to-b from-white from-30% to-gray-300/80 bg-clip-text text-sm font-semibold leading-none tracking-tight text-white">
                  Get Started
                </span>
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              className="max-w-[600px] max-h-[600px] object-contain"
              src="/art.png"
              alt="Art"
            />
          </div>
        </div>
      </div>
      <div className="w-full min-h-screen bg-white py-16 px-4 items-center">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black">
            <span className="font-['Poppins'] capitalize ml-2">
              Our Services & Features
            </span>
          </h1>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="bg-zinc-300 rounded-[30px] h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] p-4 sm:p-5 md:p-6 flex flex-col justify-center items-center">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">
                  Service 1
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base">
                  Add your service description here
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-zinc-300 rounded-[30px] h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] p-4 sm:p-5 md:p-6 flex flex-col justify-center items-center">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">
                  Service 2
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base">
                  Add your service description here
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-zinc-300 rounded-[30px] h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] p-4 sm:p-5 md:p-6 flex flex-col justify-center items-center md:col-span-2 lg:col-span-1">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">
                  Service 3
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base">
                  Add your service description here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-gray-800 text-white text-center py-6">
        <p>&copy; 2025 Scheather. All rights reserved.</p>
      </footer>
    </div>
  );
}
