"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { auth } from "@/app/lib/firebaseConfig";
import { db } from "@/app/lib/firebaseConfig";
import CalendarComponent from "@/app/components/Calendar";
import EventForm from "@/app/components/EventForm";

const api = {
  key: "d9e6f3e3a33ef6775a81923aa351ad00",
};

//weather icons (not using the default icons from OpenWeatherMap)
const iconMap: Record<string, { day: string; night: string }> = {
  "clear sky": {
    day: "/icons/clear-day.png",
    night: "/icons/clear-night.png",
  },
  "few clouds": {
    day: "/icons/cloudy-day.png",
    night: "/icons/cloudy-night.png",
  },
  "scattered clouds": {
    day: "/icons/scattered-clouds-day.png",
    night: "/icons/scattered-clouds-night.png",
  },
  "broken clouds": {
    day: "/icons/broken-clouds-day.png",
    night: "/icons/broken-clouds-night.png",
  },
  "shower rain": {
    day: "/icons/shower-rain-day.png",
    night: "/icons/shower-rain-night.png",
  },
  rain: {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  thunderstorm: {
    day: "/icons/thunderstorm-day.png",
    night: "/icons/thunderstorm-night.png",
  },
  snow: {
    day: "/icons/snow-day.png",
    night: "/icons/snow-night.png",
  },
  mist: {
    day: "/icons/mist-day.png",
    night: "/icons/mist-night.png",
  },

  "overcast clouds": {
    day: "/icons/overcast-clouds-day.png",
    night: "/icons/overcast-clouds-night.png",
  },

};

export default function Dashboard() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  //for the name and email address in the header
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  //for notifications
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //log-out function
  const handleClick = () => {
    router.push("/auth/login");
  };

  //for the hamburger
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
  const firstName = name ? name.split(" ")[0] : "there";

  // fetching the weather based on the user's location and finding the nearest city and read that city's weather
  useEffect(() => {
    const fetchWeatherByCity = async (lat: number, lon: number) => {
      try {
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api.key}`
        );
        const geoData = await geoRes.json();

        if (!geoRes.ok || geoData.length === 0) {
          setError("Could not find city for your location.");
          return;
        }

        const cityName = geoData[0].name;
        const countryCode = geoData[0].country;

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${api.key}&units=metric`
        );
        const weatherData = await weatherRes.json();

        if (!weatherRes.ok) {
          setError("Failed to fetch weather for city.");
          return;
        }

        setWeather({
          ...weatherData,
          city: cityName,
          country: countryCode,
        });
      } catch (err) {
        console.error(err);
        setError("An error occurred.");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCity(latitude, longitude);
        },
        () => {
          setError("Location permission denied.");
        }
      );
    }
  }, []);

  // this is to classify the icons to day and night
  const isDayTime = () => {
    if (!weather?.dt || !weather?.sys) return true; // fallback to day

    const current = weather.dt;
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;

    return current >= sunrise && current < sunset;
  };
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

  //avatars
  const [avatar, setAvatar] = useState("/avatar/cat1.jpg");
  // setting the selected avatar from localStorage if available
  useEffect(() => {
    const savedAvatar = localStorage.getItem("selectedAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  //avatar dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".avatar-dropdown") &&
        !target.closest("img[src*='/avatar/']")
      ) {
        setIsAvatarDropdownOpen(false);
      }
    };
    //mawala ang dropdown kung mag click outside sa avatar
    if (isMobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // function to handle avatar change
  const handleAvatarChange = (path: string) => {
    localStorage.setItem("selectedAvatar", path);
    setAvatar(path);
    setIsAvatarDropdownOpen(false);
  };

  //notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dropdown = document.querySelector(".notification-dropdown");
      const bellIcon = document.querySelector(".notification-icon");

      if (
        dropdown &&
        !dropdown.contains(target) &&
        bellIcon &&
        !bellIcon.contains(target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //profile dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // ONLY close if not clicking inside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div className="w-full h-screen relative bg-white">
        <header
          className="w-full h-20 bg-white shadow-[0px_1.5px_15px_0px_rgba(0,0,0,0.20)] fixed top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-20"
          style={{
            fontFamily: "Poppins",
          }}
        >
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger - always visible --dri ang transition sa hamburger to x (open or close)*/}
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
          {/* //notification and avatar section */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            <div className="relative notification-wrapper notification-icon">
              <svg
                className="w-6 h-6 shrink-0 text-gray-800 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="#e68c3a"
                viewBox="0 0 24 24"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
              </svg>

              {isNotificationOpen && (
                <div className=" notification-dropdown absolute right-0 top-10 mt-2 w-64 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 z-50 p-4">
                  <p className="text-sm text-gray-700 font-medium">
                    Notifications
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-black">
                    <li className="hover:bg-gray-100 p-2 rounded">
                      {/* dynamic ni dri */}
                      New weather alert
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded">
                      Reminder: Update profile
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded">
                      Weekly summary available
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative avatar-wrapper">
                <img
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-[#e68c3a]"
                  src={avatar}
                  alt="Profile"
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                />

                {isAvatarDropdownOpen && (
                  <div className="avatar-dropdown absolute right-0 top-14 bg-white shadow-lg rounded-md p-4 z-50 grid grid-cols-2 gap-4 w-40">
                    {["cat1", "cat2", "capy1"].map((name) => (
                      <img
                        key={name}
                        src={`/avatar/${name}.jpg`}
                        alt={name}
                        onClick={() =>
                          handleAvatarChange(`/avatar/${name}.jpg`)
                        }
                        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:scale-105 transition"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex ">
              {/* Desktop name + email */}
              <div className="hidden sm:flex flex-col min-w-0 truncate">
                <div className="text-black text-sm font-semibold truncate">
                  {name}
                </div>
                <div className="text-black text-xs truncate">{email}</div>
              </div>

              {/* toggle visible on all screens but name and email inside if mobile */}
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="ml-2"
                aria-label="Toggle profile dropdown"
              >
                <svg
                  className="w-5 h-5 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              {/* Mobile dropdown content */}
              {isMobileDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-12 bg-white rounded-md shadow-md p-3 w-48 z-50   "
                >
                  <div className="sm:hidden mb-2 border-b pb-2">
                    <div className="text-black text-sm font-semibold truncate">
                      {name}
                    </div>
                    <div className="text-black text-xs truncate">{email}</div>
                  </div>
                  {/* Logout Button */}
                  <button
                    className="mt-12 bg-stone-100 rounded-[30px] px-6 py-3 text-center cursor-pointer hover:bg-stone-200 transition-colors duration-300 w-full active:scale-95"
                    onClick={handleClick}
                  >
                    <div className="text-cyan-900 text-xl font-poppins">
                      Log Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/30  z-40"
                onClick={closeMenu}
              ></div>
              {/* Sidebar menu */}
              <aside className="fixed top-20 left-0 max-h-[calc(100vh-2rem)] w-64 bg-[color:#213E60] z-50 p-6 rounded-tr-[10px] rounded-br-[10px] overflow-auto shadow-lg items-center flex flex-col">
                <a>
                  <div className="text-white text-xl mb-6">Invitations</div>
                </a>
                <a>
                  <div className="text-white text-xl mb-6">To-do list</div>
                </a>

                <div className="flex-grow"></div>
              </aside>
            </>
          )}
        </header>
        {/* // Main content area/ */}
        <main className="pt-20 scroll-mt-50">
          {/* Full-width blue background */}
          <div className="w-full bg-[color:#213E60] backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-4 sm:px-6 lg:px-20 py-8">
              <div className="flex">
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                  style={{ fontFamily: "Poppins" }}
                >
                  Welcome, {firstName}!
                </h1>
              </div>

              {/* Weather Info */}
              <div className="flex-1 flex justify-end items-start min-h-[16rem]">
                {weather ? (
                  <div
                    className={`transition-transform duration-700 ease-out ${
                      fadeIn ? "translate-y-0" : "translate-y-8"
                    }`}
                  >
                    <div className="relative w-64 h-64 flex items-start justify-start">
                      <div className="absolute top-5 left-2 text-[#e68c3a] text-lg font-normal font-['Overpass'] [text-shadow:_-2px_3px_1px_rgb(0_0_0_/_0.10)]">
                        {weather.city}
                      </div>

                      <div className="absolute top-10 left-2 flex items-start gap-4">
                        {/* Temperature block */}
                        <div className="flex items-start">
                          <span className="text-white text-8xl font-normal font-['Overpass'] [text-shadow:_-4px_8px_50px_rgb(0_0_0_/_0.10)]">
                            {weather.main.temp.toFixed(1)}
                          </span>
                          <span className="text-white text-4xl font-normal font-['Overpass'] ml-1 mt-1">
                            °C
                          </span>
                        </div>

                        {/* Weather icon */}
                        <img
                          src={
                            iconMap[
                              weather.weather[0].description.toLowerCase()
                            ]
                              ? iconMap[
                                  weather.weather[0].description.toLowerCase()
                                ][isDayTime() ? "day" : "night"]
                              : "/icons/default.png"
                          }
                          alt={weather.weather[0].description.toLowerCase()}
                          className="w-28 sm:w-30 h-28 mt-2"
                        />
                      </div>
                      <div className="absolute top-32 left-2 text-white text-2xl font-bold font-['Overpass'] [text-shadow:_-2px_3px_1px_rgb(0_0_0_/_0.10)] capitalize">
                        {weather.weather[0].description.toLowerCase()}
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
          </div>
        </main>
        {/* for calendar */}
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-10">Your Event Calendar</h1>
          <CalendarComponent />
        </div>
      </div>
    </div>
  );
}
