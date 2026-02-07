import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { path: "/member-dashboard", label: "Dashboard" },
    { path: "/member-tasks", label: "TaskDetails" },
    { path: "/team", label: "Team" },
    { path: "/chat", label: "Chat"},
    { path: "/whiteboard", label: "Whiteboard"},
    { path: "/admin-dashboard", label: "Create-Project"}
  ];

  return (
    <div className="sidebar w-40 bg-emerald-950 text-emerald-200 min-h-screen p-2 py-15 rounded-r-2xl border-2 border-emerald-900 transition-shadow duration-300 shadow-10xl">
      <nav>
        <ul className="space-y-4">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                className="block py-2 px-2 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;