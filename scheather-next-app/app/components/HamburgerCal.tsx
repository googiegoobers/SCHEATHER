
import { useState } from 'react';
import Calendar from 'react-calendar';
import "./HamburgerCal.css"

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

//temporary rani need to connect sa database para events
const fakeEvents = [
  { title: "Event 1", start: new Date(2025, 5, 26) },
  { title: "Event 2", start: new Date(2025, 5, 28) },
];

function HamburgerCal() {
  const [value, onChange] = useState<Value>(new Date());

  const [date, setDate] = useState(new Date());
  const today = new Date();
  
  const hasEventOnDate = (date: Date) => { //mo indicate ug naay event at a certain date
    return fakeEvents.some(
      (event) => new Date(event.start).toDateString() === date.toDateString()
    );
  };

  return (
    <div data-layer="the body" className=" bg-[#94B7EF] rounded p-4 lg:w-[18vw] lg:h-[42vh] xl:w-[18vw] xl:h-[38vh]">
      <Calendar 
      onChange={onChange} 
      value={value}
      calendarType= "gregory"
      showNeighboringCentury={false}
      showNeighboringDecade={false}
      formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, {weekday: 'narrow'})}
      
      //if naay events within that day mo gawas siya ug orange circle
      tileContent={({ date, view }) => 
            view === "month" && hasEventOnDate(date) ? (
            <div className="event-indicator" />
            ) : null
        }
      tileClassName={({ date, view }) => {
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
           ) {
          return "today-text-color";
        }
      }}
        />
    </div>
  );
};

export default HamburgerCal;