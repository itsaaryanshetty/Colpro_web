import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { authService } from "../services/authService";
import axios from "axios";
import { Trophy, Medal, Award } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await axios.get(`${API_BASE_URL}/users/leaderboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaderboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-lg" />;
      case 2:
        return <Medal className="w-8 h-8 text-slate-300 drop-shadow-lg" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-700 drop-shadow-lg" />;
      default:
        return <span className="text-xl font-bold text-slate-500">#{rank}</span>;
    }
  };

  const getProgressColor = (tasksCompleted) => {
    if (tasksCompleted >= 20) return "bg-emerald-500";
    if (tasksCompleted >= 10) return "bg-blue-500";
    if (tasksCompleted >= 5) return "bg-yellow-500";
    return "bg-slate-600";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center pl-0 lg:pl-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl font-medium text-emerald-400">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex-1 overflow-auto pl-0 lg:pl-64">
        <div className="p-8 max-w-6xl mx-auto pt-24">

          {/* Header */}
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center lg:justify-start gap-4">
              <Trophy className="w-10 h-10 text-emerald-400" />
              Leaderboard
            </h1>
            <p className="text-slate-400 text-lg">Recognizing top performers for their dedication and productivity.</p>
          </header>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          {/* Stats Cards */}
          {leaderboardData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatsCard label="Total Users" value={leaderboardData.length} color="text-emerald-400" borderColor="border-emerald-500/30" />
              <StatsCard
                label="Total Tasks Completed"
                value={leaderboardData.reduce((sum, user) => sum + (user.tasksCompleted || 0), 0)}
                color="text-yellow-400"
                borderColor="border-yellow-500/30"
              />
              <StatsCard
                label="Avg Tasks / User"
                value={leaderboardData.length > 0 ? Math.round(leaderboardData.reduce((sum, user) => sum + (user.tasksCompleted || 0), 0) / leaderboardData.length) : 0}
                color="text-blue-400"
                borderColor="border-blue-500/30"
              />
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">Rank</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-8 py-5 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">Tasks Done</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-400 uppercase tracking-wider w-1/3">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leaderboardData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-12 text-center text-slate-500 text-lg">
                        No visible users found yet.
                      </td>
                    </tr>
                  ) : (
                    leaderboardData.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-800/50 transition-colors duration-200 ${index < 3 ? "bg-emerald-900/10" : ""
                          }`}
                      >
                        {/* Rank */}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-start">
                            {getMedalIcon(index + 1)}
                          </div>
                        </td>

                        {/* User Info */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg 
                                ${index < 3 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}
                            `}>
                              {user.full_name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 text-lg">
                                {user.full_name || "Unknown User"}
                                {currentUserIsMe(user) && <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">You</span>}
                              </div>
                              <div className="text-sm text-slate-500">
                                {user.email || ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Tasks Completed */}
                        <td className="px-8 py-6 text-center">
                          <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-bold text-lg min-w-[3rem] ${index < 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-300"
                            }`}>
                            {user.tasksCompleted || 0}
                          </span>
                        </td>

                        {/* Progress Bar */}
                        <td className="px-8 py-6">
                          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full ${getProgressColor(user.tasksCompleted)} shadow-[0_0_10px_rgba(0,0,0,0.3)] relative overflow-hidden`}
                              style={{ width: `${Math.min((user.tasksCompleted / 30) * 100, 100)}%` }}
                            >
                              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-slate-500 font-medium">
                            <span>0</span>
                            <span>Target: 30</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for 'StatsCard'
const StatsCard = ({ label, value, color, borderColor }) => (
  <div className={`bg-slate-900/80 p-6 rounded-2xl border ${borderColor} shadow-lg backdrop-blur-sm relative overflow-hidden group hover:bg-slate-900 transition-colors`}>
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 blur-xl ${color.replace('text-', 'bg-')}`}></div>
    <h2 className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2 z-10 relative">{label}</h2>
    <p className={`text-4xl font-extrabold ${color} z-10 relative group-hover:scale-105 transition-transform origin-left`}>
      {value}
    </p>
  </div>
);

// Helper to identify if it is current user (mock implementation as we don't have current user ID easily available without context, 
// strictly aesthetic here unless we fetch current user profile)
const currentUserIsMe = (user) => {
  return false; // placeholder
}

export default Leaderboard;