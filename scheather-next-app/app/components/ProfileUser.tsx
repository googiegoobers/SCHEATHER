"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  onClose: () => void;
  name: string;
  email: string;
  creationYear: number | null;
};

export default function UserProfileModal({
  onClose,
  name,
  email,
  creationYear,
}: Props) {
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPath = localStorage.getItem("selectedAvatar");
    setAvatarPath(storedPath || null);
  }, []);

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
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div
        ref={modalRef}
        className="relative w-[90%] max-w-md bg-white rounded-xl shadow-lg p-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        {/* Avatar */}
        {avatarPath && (
          <div className="flex justify-center mb-4">
            <img
              src={avatarPath}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#e68c3a]"
            />
          </div>
        )}

        {/* Info */}
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{email}</p>
          {creationYear && (
            <p className="text-xs text-gray-500">Joined in {creationYear}</p>
          )}
        </div>
      </div>
    </div>
  );
}
