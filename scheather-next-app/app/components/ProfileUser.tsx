"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Props = {
  onClose: () => void;
  name: string;
  email: string;
  creationYear: number | null;
  path: string;
};

export default function UserProfileModal({
  onClose,
  name,
  email,
  creationYear,
  path,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center h-auto">
      <div
        ref={modalRef}
        className="relative w-[90%] max-w-md bg-white rounded-xl shadow-lg p-6 h-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
        >
          X
        </button>

        <div className="container">
          <div className="bg-color-prof-container">
            <div className="bg-[color:#213E60] w-full h-auto rounded">
              <div className="p-3 flex flex-col justify-center items-center">
                <img
                  src={path}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#e68c3a]"
                />
                {creationYear && (
                  <p className="text-xs text-white pt-2">
                    Joined in {creationYear}
                  </p>
                )}
              </div>
            </div>
            {/* <div className="profile"></div> */}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-center space-y-1 border-b p-2">
            <p className="text-lg font-semibold text-gray-800">{name}</p>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
          <Link href="/auth/forgetPassword" className="p-4 flex justify-center">
            <p className="absolute underline-offset-2 text-center justify-start text-[#223F61] text-sm font-normal font-['Poppins'] underline cursor-pointer">
              Change Password
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
