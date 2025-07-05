import React from "react";

interface EventDetailsProps {
  event: {
    title: string;
    start: Date | string;
    end: Date | string;
    location?: string;
    isAllDay?: boolean;
    inviteList?: { name: string; email: string }[]; // adjust type as needed
    budgetList?: any[]; // adjust type as needed
    participants?: any[]; // adjust type as needed
    // add other fields if needed
  };
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#383734]/50 backdrop-blur-[1px]">
    <div className="relative w-[968.86px] h-[698px] bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-8 flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800"
        aria-label="Close"
      >
        &times;
      </button>
      <div className="text-cyan-900 text-5xl font-bold font-['Montserrat'] mb-2">
        {event.title}
      </div>
      <div className="w-[900px] h-0 opacity-50 outline outline-2 outline-offset-[-1px] outline-stone-900 mb-8"></div>
      <div className="flex flex-col gap-4 text-2xl font-['Montserrat'] text-stone-900">
        <div>
          <span className="font-bold">Start:</span>{" "}
          {new Date(event.start).toLocaleString()}
        </div>
        <div>
          <span className="font-bold">End:</span>{" "}
          {new Date(event.end).toLocaleString()}
        </div>
          <div>
            <span className="font-bold">Location:</span>{" "}
            {event.location ? event.location : "No location specified"}
          </div>
        <div>
          <span className="font-bold">All Day:</span>{" "}
          {event.isAllDay ? "Yes" : "No"}
        </div>
        
        <div>
            <span className="font-bold">Invite List:</span>
            <ul className="ml-4 list-disc">
            {event.inviteList && event.inviteList.length > 0 ? (
              event.inviteList.map((invite: any, idx: number) => (
                <li key={idx}>
                  {invite.name
                    ? `${invite.name} (${invite.email})`
                    : invite.email || JSON.stringify(invite)}
                </li>
              ))
            ) : (
              <li>No invites</li>
            )}
            </ul>
        </div>

        <div>
        <span className="font-bold">Budget List:</span>
        <pre className="ml-4 text-base">{JSON.stringify(event.budgetList, null, 2)}</pre>
        </div>
        
        <div>
            <span className="font-bold">Participants:</span>
            <pre className="ml-4 text-base">{JSON.stringify(event.participants, null, 2)}</pre>
        </div>

      </div>
    </div>
  </div>
);

export default EventDetails;