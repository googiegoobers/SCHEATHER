"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const api = {
  key: "d9e6f3e3a33ef6775a81923aa351ad00",
};

//weather icons (not using the defualt)
const iconMap: { [key: string]: string } = {
  Clear: "/icons/clear/pmg",
  Clouds: "/icons/cloudy.png",
  Rain: "/icons/rain.png",
  Thunderstorm: "/icons/thunderstorm.png",
  Snow: "/icons/snowy.png",
  Mist: "/icons/mist.png",
};

export default function Dashboard() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

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

  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [iconLoaded, setIconLoaded] = useState(false);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${
            api.key
          }&_=${Date.now()}`
        );

        const data = await res.json();
        if (res.ok) {
          setWeather(data);
        } else {
          setError(data.message || "Failed to fetch weather.");
        }
      } catch (err: any) {
        setError("An error occurred while fetching the weather.");
      }
    };

    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          setError(
            "Unable to retrieve your location. Please check your browser settings."
          );
        }
      );
  }, []);

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div className="w-full h-screen relative bg-white overflow-hidden">
        <header
          className="w-full h-20 bg-white shadow-[0px_1.5px_15px_0px_rgba(0,0,0,0.20)] fixed top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-20"
          style={{
            fontFamily: "Poppins",
          }}
        >
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger - always visible */}
            <button
              className="flex flex-col justify-center items-center w-8 h-5 space-y-1 focus:outline-none"
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

            {/* Title */}
            <div
              className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-b from-white from-30% to-gray-300/80 bg-clip-text text-black"
              style={{ fontFamily: '"Cedarville Cursive", cursive' }}
            >
              Scheather
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-0 max-w-full overflow-hidden">
            <Link href="/auth/login" passHref>
              <svg
                className="w-6 h-6 shrink-0 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                viewBox="0 0 24 24"
              >
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
              </svg>
            </Link>

            {/* Profile image */}
            <img
              className="w-10 h-10 rounded-full object-cover shrink-0"
              src="https://placehold.co/65x65"
              alt="Profile"
            />

            {/* truncate cuts off the texts*/}
            <div className="hidden sm:flex flex-col min-w-0 truncate">
              <div className="text-black text-sm font-semibold truncate">
                Ann Bautista
              </div>
              <div className="text-black text-xs truncate">
                anbautista143@gmail.com
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/30  z-40"
                onClick={closeMenu}
              ></div>

              {/* Sidebar menu */}
              <aside className="fixed top-20 left-0 max-h-[calc(100vh-2rem)] w-64 bg-[color:#213E60] z-50 p-6 rounded-tr-[40px] rounded-br-[40px] overflow-auto shadow-lg items-center flex flex-col">
                <a>
                  <div className="text-white text-xl mb-6">Scheather</div>
                </a>
                <a>
                  <div className="text-white text-xl mb-6">Scheather</div>
                </a>

                <div className="flex-grow"></div>

                {/* Logout Button */}
                <div className="mt-12 bg-stone-100 rounded-[30px] px-6 py-3 text-center">
                  <div className="text-cyan-900 text-xl font-poppins">
                    Log Out
                  </div>
                </div>
              </aside>
            </>
          )}
        </header>
        {/* // Main content area/ */}
        <main className="pt-30 px-4 sm:px-6 lg:px-20 scroll-mt-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left: Welcome */}
            <div className="flex">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900"
                style={{ fontFamily: "Poppins" }}
              >
                WELCOME, ANN
              </h1>
            </div>

            {/* Right: Weather Info or Animation */}
            <div className="flex-1 flex justify-end items-start min-h-[16rem]">
              {weather ? (
                <div
                  className={`transition-transform duration-700 ease-out ${
                    fadeIn ? "translate-y-0" : "translate-y-8"
                  }`}
                >
                  {/* Weather Info Block */}
                  <div className="relative w-64 h-64 flex items-start justify-start">
                    {/* Date */}
                    <div className="absolute top-5 left-2 text-black  text-lg font-normal font-['Overpass'] [text-shadow:_-2px_3px_1px_rgb(0_0_0_/_0.10)]">
                      Today, 12 June
                    </div>
                    {/* Icon */}
                    <img
                      src={
                        iconMap[weather.weather[0].main] || "/icons/default.png"
                      }
                      alt={weather.weather[0].description}
                      className="absolute top-2 right-2 w-24 h-24"
                    />

                    {/* Temperature */}
                    <div className="absolute top-10 left-2 flex items-start">
                      <span className="text-[color:#213E60] text-8xl font-normal font-['Overpass'] [text-shadow:_-4px_8px_50px_rgb(0_0_0_/_0.10)]">
                        {Math.round(weather.main.temp)}
                      </span>
                      <span className="text-[color:#213E60] text-4xl font-normal font-['Overpass'] ml-1 mt-1">
                        °C
                      </span>
                    </div>
                    {/* Description */}
                    <div className="absolute top-32 left-2 text-cyan-900 text-2xl font-bold font-['Overpass'] [text-shadow:_-2px_3px_1px_rgb(0_0_0_/_0.10)] capitalize">
                      {weather.weather[0].description}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <DotLottieReact src="/lottie.lottie" loop autoplay />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
