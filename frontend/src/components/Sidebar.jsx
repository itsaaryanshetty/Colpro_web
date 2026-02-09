import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, Users, MessageSquare, Trophy, PencilRuler, FolderPlus } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/member-dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/member-tasks", label: "My Tasks", icon: <ListTodo size={20} /> },
    { path: "/team", label: "Team", icon: <Users size={20} /> },
    { path: "/chat", label: "Chat", icon: <MessageSquare size={20} /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
    { path: "/whiteboard", label: "Whiteboard", icon: <PencilRuler size={20} /> },
    { path: "/admin-dashboard", label: "Create Project", icon: <FolderPlus size={20} /> }
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 border-r border-slate-800 text-slate-300 fixed left-0 top-0 pt-20 z-40 shadow-2xl">
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                      ? "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20"
                      : "hover:bg-slate-800 hover:text-white border border-transparent"
                    }`}
                >
                  <span className={`${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"}`}>
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">© 2026 Colpro Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;