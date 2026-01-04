import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <nav className="mt-4">
        <Link
          to="/profile"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Profile
        </Link>
        <Link
          to="/orders"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Orders
        </Link>
        <Link
          to="/admin"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Admin Dashboard
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
