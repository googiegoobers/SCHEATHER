"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/app/components/Scene"), { ssr: false });

export default function Home() {
  const router = useRouter();

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleClick = () => {
    router.push("/auth/signup");
  };

  //for the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // makes the background still when opening the hamburger menu
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div className="w-full h-screen relative bg-white overflow-hidden">
        {/* Header*/}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#home"
              className="text-black text-base cursor-pointer relative inline-block after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-black text-base cursor-pointer relative inline-block after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </a>
            <a
              href="#services"
              className="text-black text-base cursor-pointer relative inline-block after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Services
            </a>
            <a
              href="#contacts"
              className="text-black text-base cursor-pointer relative inline-block after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contacts
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login" passHref>
              <button className="w-24 xl:w-32 h-10 xl:h-12 bg-neutral-200 rounded-[30px] border border-stone-100 text-black text-sm xl:text-base hover:cursor-pointer hover:bg-neutral-300 transition-colors">
                Login
              </button>
            </Link>
            <Link href="/auth/signup" passHref>
              <button className="w-24 xl:w-32 h-10 xl:h-12 bg-[color:#213E60] rounded-[30px] text-white text-sm xl:text-base hover:cursor-pointer hover:bg-[color:#1A314E] transition-colors">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-5 space-y-1 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div
              className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></div>
          </button>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 z-40"
              onClick={closeMenu}
            ></div>
          )}

          {/* Mobile Menu */}
          <div
            className={`lg:hidden fixed top-20 right-0 w-80 max-w-[90vw] max-h-[calc(100vh-2rem)] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 rounded-sm ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col p-6 space-y-6">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#home"
                  className="text-black text-lg py-2 border-b border-gray-100 hover:text-[#e68c3a] transition-colors "
                  onClick={closeMenu}
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-black text-lg py-2 border-b border-gray-100 hover:text-[#e68c3a] transition-colors"
                  onClick={closeMenu}
                >
                  About
                </a>
                <a
                  href="#services"
                  className="text-black text-lg py-2 border-b border-gray-100 hover:text-[#e68c3a] transition-colors"
                  onClick={closeMenu}
                >
                  Services
                </a>
                <a
                  href="#contacts"
                  className="text-black text-lg py-2 border-b border-gray-100 hover:text-[#e68c3a] transition-colors"
                  onClick={closeMenu}
                >
                  Contacts
                </a>
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-4 pt-6">
                <Link href="/auth/login" passHref>
                  <button
                    className="w-full h-12 bg-neutral-200 rounded-[30px] border border-stone-100 text-black text-base active:bg-neutral-300 transition-colors"
                    onClick={closeMenu}
                  >
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup" passHref>
                  <button
                    className="w-full h-12 bg-[color:#213E60] rounded-[30px] text-white text-base active:bg-[color:#1A314E] transition-colors"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div
          className="w-full min-h-screen px-4 sm:px-6 lg:px-8 pt-20 flex flex-col justify-center items-center text-center bg-white/80"
          id="home"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-8 lg:gap-10">
            {/* LEFT CONTENT */}
            <div className="flex-1 max-w-[600px] order-2 lg:order-1 text-left">
              <h1
                className="text-[color:#213E60] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 lg:mb-8 font-bold leading-relaxed"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                SCHEATHER
              </h1>
              <h3
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 lg:mb-8 font-bold italic text-[color:#141414] leading-relaxed"
                style={{ fontFamily: "Roboto" }}
              >
                Mini Event Planner <br />
                for Barkadas, Org, etc.
              </h3>

              <button
                onClick={handleClick}
                className="rgb-button group relative cursor-pointer overflow-hidden whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-black [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(120,120,120,0.7)] flex justify-center w-fit"
                style={
                  {
                    "--spread": "90deg",
                    "--shimmer-color": "#ffe0b2",
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
                <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)] "></div>
                <div className="px-9 z-10 flex items-center justify-center gap-2">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-b from-white from-30% to-gray-300/80 bg-clip-text text-xl sm:text-sm font-semibold leading-none tracking-tight text-white hover:"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Get Started
                    <svg
                      className="w-6 h-6 sm:w-6 sm:h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-7-7l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </button>
            </div>

            {/* RIGHT CONTENT - IMAGE */}
            <div className="flex flex-col justify-center items-center flex-1 order-1 lg:order-2 w-full">
              <Scene scrollProgress={scrollProgress} />

              {/* <img
                src="/hero-logo.png"
                alt="Art"
                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto object-contain"
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* about section */}
      <div
        id="about"
        className="w-full min-h-screen lg:h-screen py-16 sm:py-20 lg:py-0 px-4 flex flex-col items-center lg:justify-center text-center scroll-mt-10 bg-[#213E60]"
      >
        <div className="text-center mb-12">
          <h2 className="text-[color:#e68c3a] font-bold text-sm uppercase tracking-widest mb-2">
            About Us
          </h2>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Montserrat" }}
          >
            Your go to planning partner
          </h1>
          <p
            className="text-[color:#f4f2ef] max-w-xl mx-auto text-base "
            style={{ fontFamily: "Poppins" }}
          >
            Our platform helps groups effortlessly plan events by combining
            real-time weather forecasts with intuitive scheduling tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center w-full max-w-6xl">
          {/* Left side – circular image section */}
          <div className="relative w-full flex justify-center items-center">
            <div className="relative w-64 h-64 rounded-full border-dashed border-1 border-gray-300 flex items-center justify-center">
              <img
                src="/person-pic.jpg"
                alt="Central"
                className="w-60 h-60 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 text-left">
            <h3
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "Montserrat" }}
            >
              We believe in doing
            </h3>
            <p
              className="text-white font-lg"
              style={{ fontFamily: "Montserrat" }}
            >
              Eliminate the stress of planning by providing a smart,
              collaborative solution.
            </p>
            <ul className="list-disc list-inside text-white space-y-1 font-medium">
              <li>Invite you friends, groupmates, etc.</li>
              <li>Easier breakdown of budget for group events</li>
              <li>Aware of the weather if under 1 week scheduling</li>
            </ul>
          </div>
        </div>
      </div>
      {/* services section */}
      <div
        id="services"
        className="w-full min-h-screen lg:h-screen py-16 sm:py-20 lg:py-0 bg-white/70 px-4 flex flex-col items-center lg:justify-center text-center"
      >
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-3xl lg:text-5xl font-medium text-[color:#213E60]">
            <span
              className="ml-2"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Our Services & Features
            </span>
          </h1>
        </div>

        <div className="cards max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm-gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="bg-zinc-300 rounded-[30px] h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] p-4 sm:p-5 md:p-6 flex flex-col justify-center items-center cursor-pointer card">
              <img src="/schedule-logo.png" alt="calendar" className="mb-4" />
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-black font-mono">
                  Scheduling
                </h3>
                <p
                  className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  Schedule group events.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-zinc-300 rounded-[30px] h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] p-4 sm:p-5 md:p-6 flex flex-col justify-center items-center cursor-pointer card">
              <img src="/wether-logo.png" alt="weather" className="mb-4" />
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-black font-mono">
                  Weather Aware
                </h3>
                <p
                  className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  Have weather alerts within a span of one week.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-zinc-300 rounded-[30px] h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] p-4 sm:p-5 md:p-6 flex flex-col justify-center items-center md:col-span-2 lg:col-span-1 cursor-pointer card">
              <img src="/group-logo.png" alt="group" className="mb-4" />
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-black font-mono">
                  Group Events
                </h3>
                <p
                  className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  Group events, invites and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer
        className="w-full bg-[color:#213E60] text-white px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
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
              fontSize: "clamp(1rem, 3vw, 2.5rem)",
              color: "#e68c3a",
            }}
          >
            You go to planning partner
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
}
