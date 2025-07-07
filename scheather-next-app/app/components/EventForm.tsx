"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import "./Calendar.css";
import { User } from "firebase/auth";
import LocationAutocomplete from "./LocationAutocomplete";
import BudgetDropdown from "./BudgetDropdown";
import { div } from "three/tsl";

interface EventFormProps {
  start: string;
  end: string;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  currentUser: User | null;
}

type user = {
  photoURL: string;
  uid: string;
  displayName: string;
  email: string;
};

const EventForm: React.FC<EventFormProps> = ({
  start,
  end,
  onClose,
  onEventCreated,
  currentUser,
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<user[]>([]);
  const [inviteList, setInviteList] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // <-- store fetched users

  // Fetch users from Firestore on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map((doc) => doc.data());
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userQuery.trim() === "") {
      setUserResults([]);
      return;
    }
    setUserResults(
      allUsers.filter(
        (user: any) =>
          user.email &&
          user.email.toLowerCase().includes(userQuery.toLowerCase()) &&
          !inviteList.some((inv) => inv.email === user.email)
      )
    );
  }, [userQuery, inviteList, allUsers]);

  const options = [
    { label: "Kanya-Kanyang Bayad", value: "a" },
    { label: "Divide by selected participants", value: "b" },
  ];

  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    start: start,
    end: end,
    isAllDay: false,
    inviteList: [],
    budgetList: [],
    participants: [],
  });

  // i-edit ang date (newEvent.start) nga mabasa siya sa weatherapi
  const eventDateTime = newEvent.start; // e.g. "2025-07-06T14:30"
  const eventDate = newEvent.start.split("T")[0];
  const eventHour = new Date(eventDateTime).getHours();
  // for budget nga equal
  const [equalMoney, setEqualMoney] = useState("");

  const [budgetItems, setBudgetItems] = useState<
    {
      label: string;
      amount: string;
    }[]
  >([]);

  // for the lista of the bayranan or mga kagastusan
  const [newItem, setNewItem] = useState({ label: "", amount: "" });
  const addBudgetItem = () => {
    if (newItem.label && newItem.amount) {
      setBudgetItems((prev) => [...prev, newItem]);
      setNewItem({ label: "", amount: "" });
    }
  };
  //total amount of added items
  const totalAmount = budgetItems.reduce((total, item) => {
    return total + parseFloat(item.amount);
  }, 0);
  const handleDelete = (indexToDelete: number) => {
    setBudgetItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToDelete)
    );
  };
  // for toogle switch
  const [checked, setChecked] = useState(false);

  // for coordinates
  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: string;
    lon: string;
  } | null>(null);

  // Weather state
  const [weather, setWeather] = useState<any>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates || !eventDate || eventHour === undefined) return;

      try {
        const res = await fetch(
          `/api/weather/days?lat=${coordinates.lat}&lon=${coordinates.lon}&date=${eventDate}`
        );

        if (!res.ok) {
          throw new Error("No forecast available for that day.");
        }

        const data = await res.json();

        const hourData = data?.forecast?.hour?.[eventHour];
        if (!hourData) {
          throw new Error("No forecast available for that day.");
          return;
        }

        setWeather(hourData);
        setWeatherError(null);
      } catch (err: any) {
        setWeather(null);
        setWeatherError(err.message || "Weather information unavailable.");
      }
    };

    fetchWeather();
  }, [coordinates, eventDate, eventHour]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (name === "isAllDay") {
      if (checked) {
        // Set start to 00:00 and end to 23:59 of the selected start date
        const date = newEvent.start ? new Date(newEvent.start) : new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const startOfDay = `${yyyy}-${mm}-${dd}T00:00`;
        const endOfDay = `${yyyy}-${mm}-${dd}T23:59`;
        setNewEvent((prev) => ({
          ...prev,
          isAllDay: true,
          start: startOfDay,
          end: endOfDay,
        }));
      } else {
        setNewEvent((prev) => ({
          ...prev,
          isAllDay: false,
        }));
      }
    } else {
      setNewEvent((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!currentUser) {
  //     alert("You must be logged in to create an event.");
  //     return;
  //   }

  //   const eventToSave = {
  //     ...newEvent,
  //     inviteList: [
  //       ...inviteList.map((user) => ({
  //         uid: user.uid,
  //         email: user.email,
  //         displayName: user.displayName,
  //         status: "pending",
  //         amount:
  //           selectedOption === "Equal" && equalMoney && acceptedUsers.length > 0
  //             ? parseFloat(equalMoney) / acceptedUsers.length
  //             : 0,
  //       })),
  //       {
  //         uid: currentUser.uid,
  //         email: currentUser.email,
  //         displayName: currentUser.displayName,
  //         status: "accepted",
  //         amount: 0,
  //       },
  //     ],
  //     createdBy: currentUser.uid,
  //   };

  //   try {
  //     const docRef = await addDoc(collection(db, "events"), eventToSave);
  //     onEventCreated({ ...eventToSave, id: docRef.id });
  //     onClose();
  //   } catch (err) {
  //     console.error("Error adding event:", err);
  //     alert("Failed to create event.");
  //   }
  // };

  //modified to store notif
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to create an event.");
      return;
    }

    const eventToSave = {
      ...newEvent,
      inviteList: [
        ...inviteList.map((user) => ({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          status: "pending",
          amount:
            selectedOption === "Equal" && equalMoney && acceptedUsers.length > 0
              ? parseFloat(equalMoney) / acceptedUsers.length
              : 0,
        })),
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          status: "accepted",
          amount: 0,
        },
      ],
      createdBy: currentUser.uid,
    };

    try {
      // Save event
      const cleanEvent = JSON.parse(JSON.stringify(eventToSave));
      const docRef = await addDoc(collection(db, "events"), cleanEvent);
      const savedEvent = { ...eventToSave, id: docRef.id };
      onEventCreated(savedEvent);

      // Send notifications to invited users (excluding creator)
      for (const user of eventToSave.inviteList) {
        if (user?.uid && user.uid !== currentUser.uid) {
          await addDoc(collection(db, "notifications"), {
            userId: user.uid,
            type: "invite",
            eventId: docRef.id,
            message: `${currentUser.displayName} invited you to "${eventToSave.title}"`,
            status: "unread",
            timestamp: new Date(),
          });
        }
      }

      onClose();
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to create event.");
    }
  };

  const [estimatedCost, setEstimatedCost] = useState("");
  const acceptedInvitees = inviteList.filter((u) => u.status === "accepted");
  const numberOfAccepted = acceptedInvitees.length || 1; // avoid div by zero
  const perPersonCost = totalAmount / numberOfAccepted;
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleSelect = (option: { label: string; value: string | number }) => {
    setSelectedOption(option.label);

    if (option.label === "Equal") {
      setShowPopup(true);
    }
  };

  const acceptedUsers = inviteList.filter((u) => u.status === "accepted");

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] max-w-[1200px] mx-auto h-[90vh] max-h-screen overflow-y-auto transition-all duration-500 bg-white shadow-lg rounded-lg p-6 md:p-6 flex flex-col gap-4"
      >
        <div className="event-creation flex flex-col w-full">
          <div className="flex flex-row justify-between items-center">
            <p className="justify-start text-[color:#213E60] text-5xl font-bold font-['Montserrat'] p-2">
              EVENT DETAILS
            </p>
            <button
              type="button"
              onClick={onClose}
              className=" top-6 right-8 sm:hidden text-black text-2xl font-bold z-50"
            >
              X
            </button>
          </div>
          <div className="h-0  w-[97%] relative opacity-50 outline-2 outline-offset-[-1px] outline-stone-900"></div>{" "}
          <div className="w-full text-stone-900 text-xl pt-4 md:text-2xl font-bold font-['Montserrat'] px-2 md:px-4 p-2">
            <input
              name="title"
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleChange}
              required
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-full p-2"
              // style={{ minWidth: "200px", width: "420px" }}
            />
          </div>
          <p className="flex flex-start font-sm pl-4 pb-1 font-['Poppins']">
            Start Date & Time
          </p>
          <div className="w-auto text-stone-900 text-xl md:text-2xl font-bold font-['Montserrat'] px-2 md:px-4">
            <input
              name="start"
              type="datetime-local"
              value={newEvent.start}
              onChange={handleChange}
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-auto p-2"
              required
              // style={{ minWidth: "200px", width: "420px" }}
            />
          </div>
          <p className="font-sm flex flex-start pl-4 font-['Poppins'] pt-1">
            End Date & Time
          </p>
          <div className="w-auto text-stone-900 text-xl md:text-2xl font-bold font-['Montserrat'] px-2 md:px-4 p-2">
            <input
              name="end"
              type="datetime-local"
              value={newEvent.end}
              onChange={handleChange}
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-auto"
              required
              // style={{ minWidth: "200px", width: "420px" }}
            />
          </div>
          <div className="w-auto text-stone-900 text-xl md:text-sm font-['Montserrat'] px-2 md:px-4 ">
            <LocationAutocomplete
              value={newEvent.location}
              onChange={(val) => {
                setNewEvent((prev) => ({ ...prev, location: val }));

                // If mu clear sa location input, clear weather and coords
                if (val === "") {
                  setCoordinates(null);
                  setWeather(null);
                }
              }}
              onSelect={(item) => {
                setCoordinates({ lat: item.lat, lon: item.lon });
                // Weather kay mu update automatically via useEffect
              }}
            />
          </div>
          <div className="w-auto justify-start text-stone-900/75 text-lg font-semibold font-['Montserrat'] pl-4 pr-4 pt-4">
            {weatherError ? (
              <div className="text-red-500 text-sm">{weatherError}</div>
            ) : (
              weather && (
                <div className="flex items-center gap-2 text-sm text-black">
                  <img src={weather.condition.icon} alt="Weather Icon" />
                  <p>
                    {weather.condition.text}, {weather.temp_c}°C
                  </p>
                </div>
              )
            )}
          </div>
          <label className="w-auto text-stone-900 text-sm font-['Montserrat'] pl-8 pr-4 pt-2">
            <input
              name="isAllDay"
              type="checkbox"
              checked={newEvent.isAllDay}
              onChange={handleChange}
              className="font-[Montserrat]"
            />
            All Day
          </label>
        </div>
        <div className="bg-gray-200"></div>
        <div className="text-[color:#213E60] text-3xl font-bold p-2">
          Invite List
        </div>
        <div className="name-container flex flex-col items-center ">
          <div className="top flex flex-col">
            <div className="search-bar py-2 px-8 border flex flex-row justify-between rounded-4xl shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] text-center">
              <input
                type="text"
                className="w-full h-full focus:outline-none text-m "
                placeholder="Search by email"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <div className="content">
              {userQuery && (
                <div className=" z-50" style={{ minHeight: 40 }}>
                  {userResults.length > 0 ? (
                    userResults.map((user) => (
                      <div
                        key={user.email}
                        className="px-4 py-2 hover:underline cursor-pointer flex items-center"
                        onClick={() => {
                          setInviteList((prev) => [...prev, user]);
                          setUserQuery("");
                          setUserResults([]);
                        }}
                      >
                        <span className="font-bold mr-2">{user.email}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2">
                      <span className="font-bold text-gray-500">
                        No users found
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* debugging */}
            {/* <div className="text-xs text-red-500 p-2 bg-white">
              {userResults.length > 0
                ? JSON.stringify(userResults)
                : "No results"}
            </div> */}
          </div>
        </div>
        {/* Header Row
        <div className="hidden sm:flex flex-row border-b pb-2 px-4">
          <div className="text-sm flex-1 font-semibold text-gray-700 uppercase tracking-wide">
            Invited Members
          </div>
          <div className="text-sm flex-1 font-semibold text-gray-700 uppercase tracking-wide text-right">
            Status
          </div>
        </div> */}
        {/* Invite List */}
        <div className="w-full flex justify-center">
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            {inviteList.map((user) => (
              <div
                key={`${user.uid}-${user.email}`}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border rounded-xl shadow hover:bg-blue-50 transition"
              >
                {/* Left: Avatar + Name + Email */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={user.avatarPath || "/avatar/axolotl.jpg"}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold truncate text-sm sm:text-base">
                      {user.displayName}
                    </p>
                    <p className="text-sm text-gray-500 truncate hidden sm:block">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Right: Status + Remove Button */}
                <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                  <span className="text-yellow-700 text-xs sm:text-l font-medium">
                    Pending
                  </span>
                  <button
                    onClick={() =>
                      setInviteList(
                        inviteList.filter((u) => u.email !== user.email)
                      )
                    }
                    className="p-2 text-black hover:text-red-500 hover:bg-red-100 rounded-full transition"
                    type="button"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* showing of the invited people */}
        {/* <div className="space-y-2">
          {userResults.map((user) => (
            <div
              key={user.uid}
              className="flex items-center gap-4 p-4 border rounded-xl hover:bg-blue-50 cursor-pointer"
              onClick={() => {
                setInviteList(inviteList.filter((u) => u.email !== user.email));
              }}
            >
              <img
                src={user.avatarPath || "/default-avatar.png"}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div> */}
        <div className="budget-container p-4">
          <div className="button-budget flex flex-row justify-between items-center  p-1 ">
            <div className="flex flex-row gap-2 items-center">
              <div
                className={` button relative w-12 h-6 flex items-center rounded-full px-1 cursor-pointer shadow-md transition-colors duration-300 ${
                  checked ? "bg-[#dc9b54]" : "bg-[#ccc] "
                }`}
                onClick={() => setChecked(!checked)}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                    checked ? "left-[28px]" : "left-1"
                  }`}
                />
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>
              <p className="text-[color:#213E60] text-3xl font-bold">Budget</p>
            </div>
            <div
              className={`transition-all duration-500 ${
                checked ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="container-of-content pt-4">
                <div>
                  <BudgetDropdown options={options} onSelect={handleSelect} />
                  {selectedOption === "Equal" && <div></div>}
                </div>
              </div>
            </div>
          </div>

          {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
                <label className="block text-[#213E60] font-bold mb-2">
                  Enter the estimated total
                </label>
                <input
                  type="number"
                  placeholder="e.g. 250.00"
                  value={equalMoney}
                  onChange={(e) => setEqualMoney(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#213E60]"
                />
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 bg-[#213E60] text-white px-4 py-2 rounded hover:bg-[#94B6EF] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {checked && (
            <div className="container-of-content">
              <div className="list-of-bayranan space-y-4">
                {/* Input for new item */}
                <p>Enter list:</p>
                <div className="flex flex-col md:flex-row items-center gap-2 justify-center ">
                  <input
                    type="text"
                    placeholder="Item (e.g., Transportation)"
                    value={newItem.label}
                    onChange={(e) =>
                      setNewItem({ ...newItem, label: e.target.value })
                    }
                    className="border p-2 rounded w-full md:w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Amount (e.g., 90.00)"
                    value={newItem.amount}
                    onChange={(e) =>
                      setNewItem({ ...newItem, amount: e.target.value })
                    }
                    className="border p-2 rounded w-full md:w-1/3"
                  />
                  <button
                    type="button"
                    onClick={addBudgetItem}
                    className="bg-[#213E60] text-white px-4 py-2 rounded hover:bg-[#345a93]"
                  >
                    Add
                  </button>
                </div>

                {/* Render budget items */}
                <div className="p-4 space-y-2">
                  <div className="labels flex flex-row justify-between">
                    <p className=" bold text-xl text-[#213E60]">
                      List of items:
                    </p>
                    <p className=" bold text-xl text-[#213E60]">Price</p>
                  </div>
                  {budgetItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-4 pb-1"
                    >
                      {/* Right: Delete Button */}
                      <div className="flex flex-row gap-2">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:underline text-sm cursor-pointer"
                        >
                          X
                        </button>
                        <div className="font-xl text-gray-800">
                          {item.label}
                        </div>
                      </div>
                      {/* Left: Label & Amount */}
                      <div className="flex items-center gap-2">
                        <div className="text-gray-700">₱{item.amount}</div>
                      </div>
                    </div>
                  ))}

                  <div className="total-below p-2 flex flex-row justify-between border-t-2">
                    <div className="label-total">TOTAL</div>
                    <div className="total-if-equal">₱{totalAmount} </div>
                  </div>
                </div>
              </div>
              <div className="label flex flex-row justify-between pl-4 pr-4 border-b p-2">
                <div className="text-[color:#213E60] text-xl font-bold">
                  Participant List
                </div>
                <div className="text-[color:#213E60] text-xl font-bold">
                  To Pay
                </div>
              </div>
              <div className="content p-2 border-b">
                {/* Dynamically render invited users with their budget (starting at 0) */}
                {acceptedUsers.length > 0 ? (
                  acceptedUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="accepted-invites flex flex-row justify-between items-center"
                    >
                      <div className="name">
                        <p className="text-stone-900/75 text-base font-bold">
                          {user.displayName}
                        </p>
                        <p className="text-stone-900/75 text-sm">
                          {user.email}
                        </p>
                      </div>
                      <div className="bayranan text-black">
                        {/* Show equal share if there is a total, otherwise 0 */}
                        {equalMoney && acceptedUsers.length > 0
                          ? (
                              parseFloat(equalMoney) / acceptedUsers.length
                            ).toFixed(2)
                          : "0.00"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-2">
                    No invited users
                  </div>
                )}
              </div>
              <div className="total-below p-2 flex flex-row justify-between">
                <div className="label-total">TOTAL</div>
                <div className="total-if-equal">₱{equalMoney}</div>
              </div>
            </div>
          )}
        </div>
        <div className="create-event-btn flex justify-center items-center bottom-10 pt=8">
          <button
            type="submit"
            className="w-[350px] bg-[#213E60] text-white rounded-[8px] p-2 hover:bg-[#94B6EF] cursor-pointer"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
