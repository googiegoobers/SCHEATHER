"use client";
import React from "react";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { auth, db } from "@/lib/firebaseConfig";
import CalendarComponent from "../components/Calendar";
import EventForm from "../components/EventForm";
import HamburgerCal from "../components/HamburgerCal";
import ProfileUser from "../components/ProfileUser";
import InvitationPage from "../components/InvitationPage";
import path from "path";
import { getAuth, onAuthStateChanged } from "firebase/auth"; //para kuha sa creation date sa user for the profile ako ra ipasa
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// import { getAnalytics, logEvent } from "firebase/analytics";
import Notifications from "../components/Notifications";
import { useAuthState } from "react-firebase-hooks/auth";

//for the default icons kay blurry ang icons nga gikan sa API
const iconMap: Record<string, { day: string; night: string }> = {
  sunny: { day: "/icons/clear-day.png", night: "/icons/clear-night.png" },
  clear: { day: "/icons/clear-day.png", night: "/icons/clear-night.png" },

  "partly cloudy": {
    day: "/icons/cloudy-day.png",
    night: "/icons/cloudy-night.png",
  },
  cloudy: { day: "/icons/cloudy-day.png", night: "/icons/cloudy-night.png" },
  overcast: {
    day: "/icons/overcast-cloud-day.png",
    night: "/icons/overcast-cloud-night.png",
  },

  "patchy rain possible": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "patchy rain nearby": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "light rain shower": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "light rain": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "moderate rain": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "heavy rain": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "moderate or heavy rain shower": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "torrential rain shower": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "patchy light drizzle": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },
  "light drizzle": {
    day: "/icons/rain-day.png",
    night: "/icons/rain-night.png",
  },

  snow: { day: "/icons/snow-day.png", night: "/icons/snow-night.png" },
  "light snow": { day: "/icons/snow-day.png", night: "/icons/snow-night.png" },
  "moderate snow": {
    day: "/icons/snow-day.png",
    night: "/icons/snow-night.png",
  },
  "heavy snow": { day: "/icons/snow-day.png", night: "/icons/snow-night.png" },
  "patchy light snow": {
    day: "/icons/snow-day.png",
    night: "/icons/snow-night.png",
  },

  fog: { day: "/icons/fog-day.png", night: "/icons/fog-night.png" },
  mist: { day: "/icons/fog-day.png", night: "/icons/fog-night.png" },
  "freezing fog": { day: "/icons/fog-day.png", night: "/icons/fog-night.png" },

  "thundery outbreaks possible": {
    day: "/icons/thunderstorm-day.png",
    night: "/icons/thunderstorm-night.png",
  },
  "patchy light rain with thunder": {
    day: "/icons/thunderstorm-day.png",
    night: "/icons/thunderstorm-night.png",
  },
  "moderate or heavy rain with thunder": {
    day: "/icons/thunderstorm-day.png",
    night: "/icons/thunderstorm-night.png",
  },
  // Default fallback, if wala sa pilianan, siyaro naman sad wla sa?
  default: { day: "/icons/clear-day.png", night: "/icons/clear-night.png" },
};

export default function Dashboard() {
  const router = useRouter();
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  //for the name and email address in the header
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // for getting the year (user creation) from db
  const [creationYear, setCreationYear] = useState<number | null>(null);
  //for notifications
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  //for pofile
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openInvitePage, setOpenInvitePage] = useState("");
  //for bell notif
  const [unreadCount, setUnreadCount] = useState(0);

  // debugging
  useEffect(() => {
    console.log("openInvitePage changed:", openInvitePage);
  }, [openInvitePage]);
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unread = snapshot.docs.filter(
        (doc) => doc.data().status === "unread"
      ).length;

      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [user]);

  //creation year for profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const yearOnly = new Date(creationTime).getFullYear();
          setCreationYear(yearOnly);
        }
      }
    });

    return () => unsubscribe();
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //for saving the path of the avatar into the database
  const handleAvatarChange = async (path: string) => {
    //mu select ang user sa iyahang ginahan nga avatart
    localStorage.setItem("selectedAvatar", path);
    const savedAvatar = localStorage.getItem("selectedAvatar");
    //kuhaon ang path
    if (savedAvatar) setAvatar(path);
    setIsAvatarDropdownOpen(false);

    //the process
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        //ang setDoc mu make sa documet didto sa db if wala pa siya nahimo
        await setDoc(userDocRef, { avatarPath: path }, { merge: true });
      } catch (error) {
        console.error("Error updating avatar in Firestore:", error);
      }
    }
  };

  const [avatar, setAvatar] = useState("/avatar/cat1.jpg");

  // setting the selected avatar from localStorage if available
  // fetching the avatar path from the database
  useEffect(() => {
    const fetchAvatarFromFirestore = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.avatarPath) {
            setAvatar(data.avatarPath);
            localStorage.setItem("selectedAvatar", data.avatarPath); // keep localStorage in sync
            return;
          }
        }
      }

      // fallback to localStorage only if no avatar in Firestore
      const savedAvatar = localStorage.getItem("selectedAvatar");
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    };

    fetchAvatarFromFirestore();
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

  // fetching weather
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const firstName = name ? name.split(" ")[0] : "there";

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`/api/weather/today?lat=${lat}&lon=${lon}`);
        if (!res.ok) {
          const text = await res.text();
          setError(text || "Failed to fetch weather data.");
          return;
        }
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
        setError("An error occurred.");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Location permission denied.");
        }
      );
    }
  }, []);

  const isDayTime = () => weather?.current?.is_day === 1;

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest('button[aria-label="Toggle profile dropdown"]')
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //getting the time since lahi ang time sa weatherAPI, refresh every second aron ma update and time
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeStr);
    };

    updateTime(); // initialize dayun

    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const analytics = getAnalytics();
  //   // Log when the component is mounted
  //   logEvent(analytics, "dashboard_viewed");
  // }, []);

  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   fetch("/api/analytics") // Your API that queries BigQuery
  //     .then((res) => res.json())
  //     .then(setData);
  // }, []);

  // if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
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
                className={`w-6 h-6 shrink-0 cursor-pointer transition-colors ${
                  unreadCount > 0 ? "text-orange-500" : "text-gray-800"
                }`}
                aria-label={`Notifications${
                  unreadCount > 0 ? ` (${unreadCount} unread)` : ""
                }`}
                role="button"
                tabIndex={0}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsNotificationOpen(!isNotificationOpen);
                  }
                }}
              >
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-0 transform translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full z-10" />
              )}

              {isNotificationOpen && user && (
                <div className="notification-dropdown absolute top-full mt-2 z-20 ml-2">
                  {/* Mobile: center aligned */}
                  <div className="block sm:hidden left-1/2 -translate-x-1/2 w-[90vw] max-w-sm absolute px-4">
                    <Notifications
                      currentUser={user}
                      onShowInvitations={() => {
                        setOpenInvitePage("invitation");
                        setIsNotificationOpen(false);
                      }}
                    />
                  </div>

                  {/* Desktop: right aligned */}
                  <div className="hidden sm:block right-1 w-96 absolute">
                    <Notifications
                      currentUser={user}
                      onShowInvitations={() => {
                        setOpenInvitePage("invitation");
                      }}
                    />
                  </div>
                </div>
              )}
              {openInvitePage == "invitation" && (
                <div className="call-the-component absolute inset-0 top-30 bg-white z-30 overflow-auto flex items-center justify-center">
                  <InvitationPage onClose={() => setOpenInvitePage("")} />
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
                    {[
                      "cat1",
                      "cat2",
                      "capy1",
                      "axolotl",
                      "blackCat",
                      "greyCat",
                      "pungen",
                    ].map((name) => (
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setIsMobileDropdownOpen(!isMobileDropdownOpen);
                }}
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
                  className="absolute right-0 top-12 bg-white rounded-md shadow-md p-4 w-48 z-50"
                >
                  {/* Name and Email - Mobile Only */}
                  <div className="sm:hidden mb-3 border-b pb-3 text-center">
                    <div className="text-black text-sm font-semibold truncate">
                      {name}
                    </div>
                    <div className="text-black text-xs truncate">{email}</div>
                  </div>

                  {/* User Profile Section */}
                  <div className="flex flex-col items-center mb-3 border-b pb-3">
                    <div className="flex items-center gap-1 w-full justify-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        className="text-gray-600"
                      >
                        <path
                          fill="currentColor"
                          d="M17 9c0-1.381-.56-2.631-1.464-3.535C14.631 4.56 13.381 4 12 4s-2.631.56-3.536 1.465C7.56 6.369 7 7.619 7 9s.56 2.631 1.464 3.535C9.369 13.44 10.619 14 12 14s2.631-.56 3.536-1.465A4.984 4.984 0 0 0 17 9zM6 19c0 1 2.25 2 6 2c3.518 0 6-1 6-2c0-2-2.354-4-6-4c-3.75 0-6 2-6 4z"
                        />
                      </svg>
                      <span
                        className="text-sm text-gray-700"
                        onClick={() => setIsProfileOpen(true)}
                      >
                        User Profile
                      </span>
                      {isProfileOpen && (
                        <ProfileUser
                          onClose={() => setIsProfileOpen(false)}
                          name={name}
                          email={email}
                          creationYear={creationYear}
                          path={avatar}
                        />
                      )}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    className="w-full flex items-center justify-center gap-1 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors duration-300 active:scale-95"
                    onClick={handleClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="text-red-900"
                    >
                      <path
                        fill="currentColor"
                        d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z"
                      />
                    </svg>
                    <span className="text-sm text-red-900 font-medium">
                      Log Out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* hamburger menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/30  z-40"
                onClick={closeMenu}
              ></div>
              {/* Sidebar menu */}
              <aside className="fixed top-20 left-0 max-h-[calc(100vh-2rem)] w-64 bg-[color:#213E60] z-50 lg:px-2 lg:py-6 xl:p-6 rounded-tr-[10px] rounded-br-[10px] overflow-hidden shadow-lg items-center flex flex-col">
                <div data-layer="Hamburger calendar">
                  <HamburgerCal />
                </div>

                <div className="text-white text-xl mb-6 mt-6">
                  <a
                    onClick={() => {
                      setOpenInvitePage("invitation");
                    }}
                    className="cursor-pointer"
                  >
                    Invitations
                  </a>
                </div>

                <Link href="/ToDoList">
                  <div className="text-white text-xl mb-6 cursor pointer">
                    To-do list
                  </div>
                </Link>

                <div className="flex-grow"></div>
              </aside>
            </>
          )}
        </header>

        {openInvitePage == "invitation" && (
          <div className="call-the-component absolute  inset-0 top-30 bg-white z-30 overflow-auto">
            <InvitationPage onClose={() => setOpenInvitePage("")} />
          </div>
        )}

        {openInvitePage != "invitation" && (
          <div>
            {/* // Main content area/ */}
            <main className="pt-20 scroll-mt-50">
              {/* Full-width blue background */}
              <div className="w-full bg-[color:#213E60] backdrop-blur-2xl">
                {/* div inside of the blue background */}
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-4 sm:px-6 lg:px-20 py-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left w-full">
                    <h1
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Welcome, {firstName}!
                    </h1>
                  </div>

                  <div className="flex justify-center items-start min-h-[16rem] px-2 sm:px-6 scale-95 sm:scale-100">
                    {weather?.localtime ? (
                      // transition div
                      <div
                        className={`transition-transform duration-700 ease-out ${
                          fadeIn ? "translate-y-0" : "translate-y-8"
                        }`}
                      >
                        {/*  container of the city, temp, and description */}
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="philTime flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="text-[color:#e68c3a]  text-xl font-normal font-['Overpass'] [text-shadow:_-2px_3px_1px_rgb(0_0_0_/_0.10)]">
                              {weather?.city}
                            </div>
                            <div className="text-white text-lg font-normal font-['Overpass'] [text-shadow:_-2px_3px_1px_rgb(0_0_0_/_0.10)]">
                              {currentTime}
                            </div>
                          </div>
                          {/* weather forcast container */}
                          <div className="forcast flex items-center justify-center">
                            {/* Temperature block */}
                            <div>
                              <div className="flex items-start">
                                <span className="text-white text-8xl font-normal font-['Overpass'] [text-shadow:_-4px_8px_50px_rgb(0_0_0_/_0.10)]">
                                  {weather.current.temp_c.toFixed(1)}
                                </span>
                                <span className="text-white text-4xl font-normal font-['Overpass'] ml-1 mt-1">
                                  °C
                                </span>
                                <img
                                  src={
                                    // i toLowerCase siya aron mabasa niya tong naa sa iconMap for the icons assigned
                                    (iconMap[
                                      weather?.current?.condition?.text.toLowerCase()
                                    ] || iconMap["default"])[
                                      isDayTime() ? "day" : "night"
                                    ]
                                  }
                                  alt={weather?.current?.condition?.text}
                                  className="w-28 sm:w-30 h-28"
                                />
                              </div>
                              <div className="text-white text-xl font-normal font-['Overpass'] capitalize">
                                {weather?.current?.condition?.text.toLowerCase()}
                              </div>
                            </div>
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
            <footer className="w-full bg-[color:#213E60] p-5 text-center text-white">
              &copy; 2025 Scheather. All rights reserved.
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
