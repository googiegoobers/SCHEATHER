"use client";
import React from "react";

interface Props {
  onClose: () => void;
}

const InvitationPage: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="wrap-all-contents w-full min-w-full flex flex-col items-center justify-center h-auto px-4 sm:px-8 lg:px-20">
      <div className="text-center w-full min-w-full h-auto">
        <div className="flex flex-start">
          <a
            onClick={onClose}
            className="flex text-sm gap-2  text-center items-center flex-1 cursor-pointer hover:underline whitespace-nowrap "
          >
            <svg
              className="w-4 h-4 text-gray-800 hover:text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15 19-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline bold">Back to Dashboard</span>
          </a>
        </div>
        <div className="flex justify-center items-center ">
          <p
            className="text-xl py-2 items-center text-center"
            style={{
              fontFamily: "Poppins",
            }}
          >
            Invitations
          </p>
        </div>
      </div>
      <div className="bg-[color:#D9D9D9] w-full max-w-4xl rounded-xl p-4 text-center h-[500px] max-h-4xl">
        <div className="container-bars flex flex-row justify-between text-black  items-center text-center">
          <div className="first-bar h-[30px] bg-[#ffffff] w-[70vh] mr-4 rounded-sm flex justify-center items-center">
            <p
              style={{
                fontFamily: "Poppins",
              }}
            >
              Invites
            </p>
            {/* dri ang mga invitations */}
          </div>
          <div className="second-bar h-[30px] bg-[#ffffff] w-[40vh] rounded-sm text-black flex justify-center items-center">
            <p
              style={{
                fontFamily: "Poppins",
              }}
            >
              Status
            </p>
            {/* status */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
