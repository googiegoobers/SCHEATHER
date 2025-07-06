"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import "./Calendar.css";
import { User } from "firebase/auth";
import LocationAutocomplete from "./LocationAutocomplete";
import BudgetDropdown from "./BudgetDropdown";

interface EventFormProps {
  start: string;
  end: string;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  currentUser: User | null;
}

const EventForm: React.FC<EventFormProps> = ({
  start,
  end,
  onClose,
  onEventCreated,
  currentUser,
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates || !eventDate || eventHour === undefined) return;

      try {
        const res = await fetch(
          `/api/weather/days?lat=${coordinates.lat}&lon=${coordinates.lon}&date=${eventDate}`
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Weather API error:", errorText);
          setWeather(null);
          return;
        }

        const data = await res.json();

        const hourData = data?.forecast?.hour?.[eventHour];
        if (!hourData) {
          console.warn("No forecast for the specified hour.");
          setWeather(null);
          return;
        }

        setWeather(hourData);
      } catch (err) {
        console.error("Client fetch failed:", err);
        setWeather(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to create an event.");
      return;
    }

    const eventToSave = {
      ...newEvent,
      inviteList, // <-- ensure inviteList is saved
      createdBy: currentUser.uid,
    };

    try {
      const docRef = await addDoc(collection(db, "events"), eventToSave);
      onEventCreated({ ...eventToSave, id: docRef.id });
      onClose();
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to create event.");
    }
  };
  const [estimatedCost, setEstimatedCost] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleSelect = (option: { label: string; value: string | number }) => {
    setSelectedOption(option.label);

    if (option.label === "Equal") {
      setShowPopup(true);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-full sm:max-w-[95vw] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto h-[90vh] max-h-screen overflow-y-auto transition-all duration-500 bg-white shadow-lg rounded-lg p-6 md:p-6 flex flex-col gap-4"
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
          <div className="w-full text-stone-900 text-xl md:text-2xl font-bold font-['Montserrat'] px-2 md:px-4 p-2">
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
            {weather && (
              <div className="flex items-center gap-2 text-sm text-black">
                <img src={weather.condition.icon} alt="Weather Icon" />
                <p>
                  {weather.condition.text}, {weather.temp_c}°C
                </p>
              </div>
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

        <div className="text-[color:#213E60] text-3xl font-bold">
          Invite List
        </div>
        <div className="name-container flex flex-col items-center">          
          <div className="h-0 w-full opacity-50 outline outline-1 outline-offset-[-0.50px] outline-stone-900 my-2"></div>          
            {/* Search bar goes here */}
            <div className="w-4/5 h-16 max-w-[720px] bg-white rounded-3xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-0.50px] outline-zinc-300 inline-flex justify-start items-center gap-1 overflow-visible relative mx-auto mb-4 mt-4">
              <input
                type="text"
                className="w-full h-full px-6 rounded-3xl focus:outline-none text-lg"
                placeholder="Search by email"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />
              {/* DEBUG: Show userResults as JSON */}
              <div className="text-xs text-red-500 absolute left-0 top-full bg-white z-50">
                {userResults.length > 0 ? JSON.stringify(userResults) : 'No results'}
              </div>
              {userResults.length > 0 && userQuery && (
                <div className="absolute left-0 right-0 top-full bg-yellow-200 border-4 border-red-500 rounded-b-2xl shadow z-50" style={{ minHeight: 40 }}>
                  {userResults.map((user) => (
                    <div
                      key={user.email}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setInviteList([...inviteList, user]);
                        setUserQuery("");
                        setUserResults([]);
                      }}
                    >
                      <span className="font-bold mr-2">{user.email}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex-1 self-stretch p-1 relative flex justify-start items-center">
                <div className="flex-1 self-stretch px-5 flex justify-start items-center gap-2.5">
                  <div className="justify-center"></div>
              </div>
              <div className="left-[620px] top-[7px] absolute flex justify-end items-center">
                {/* ...icon code... */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {inviteList.map((user) => (
            <div
              key={user.email}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
            >
              {user.email}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() =>
                  setInviteList(inviteList.filter((u) => u.email !== user.email))
                }
                type="button"
              >
                &times;
              </button>
            </div>
          ))}
        </div> 
        
        <div className="invites-container p-4 space-y-4 flex flex-row justify-between">
          <div className="name-container">
            <div className="text-[color:#213E60] text-3xl font-bold">
              Invite List
            </div>
            <div className="container flex flex-row justify-between w-full">
              <div className="name">
                <p className="text-stone-900/75 text-2xl font-bold">
                  Toothless
                </p>
                <p className="text-stone-900/75 text-base">
                  toothless@gmail.com
                </p>
              </div>
            </div>
            {/* 
            <div>
              <p className="text-stone-900/75 text-2xl font-bold">Kanye West</p>
              <p className="text-stone-900/75 text-base">kanyewest@gmail.com</p>

              <p className="text-base text-stone-900/75">Declined</p>
            </div>
            <div>
              <p className="text-stone-900/75 text-2xl font-bold">
                Freddy Fazbear
              </p>
              <p className="text-stone-900/75 text-base">
                freddyfazbear@gmail.com
              </p>

              <p className="text-base text-stone-900/75">Pending</p>
            </div> */}
          </div>

          <div className="status-container">
            <p className="text-[color:#213E60] text-3xl font-bold">Status</p>
            <div className="status's items-center">
              <p className="text-base text-stone-900/75">Accepted</p>
            </div>
          </div>
        </div>
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
                  Invite List
                </div>
                <div className="text-[color:#213E60] text-xl font-bold">
                  Pay
                </div>
              </div>
              <div className="content p-2 border-b">
                <div className="accepted-invites flex flex-row justify-between items-center">
                  <div className="name">
                    <p className="text-stone-900/75 text-base font-bold">
                      Toothless
                    </p>
                    <p className="text-stone-900/75 text-sm">
                      toothless@gmail.com
                    </p>
                  </div>
                  <div className="bayranan text-black">100.00</div>
                </div>
              </div>
              <div className="total-below p-2 flex flex-row justify-between">
                <div className="label-total">TOTAL</div>
                <div className="total-if-equal">{equalMoney}</div>
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