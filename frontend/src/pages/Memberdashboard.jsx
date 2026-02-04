import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {authService} from "../services/authService";

const API_BASE_URL = "http://localhost:8000";

const Memberdashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  // ✅ ADDED: Missing state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const verifyAdminAccess = async () => {
        const token = authService.getToken();
        
        // No token at all
        if (!token) {
          navigate("/login");
          return;
        }
  
        try {
          // Verify token and get user data from backend
          const response = await authService.getProtectedData();  
          setCurrentUser(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Authentication failed:", error);
          authService.logout();
          navigate("/login");
        }
      };
  
      verifyAdminAccess();
    }, [navigate]);

    //fetch tasks
    useEffect(() => {
      if (!currentUser) return;
      const fetchTasks = async () => {
        try {
          const token = authService.getToken();
          const res = await axios.get(`${API_BASE_URL}/tasks/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTasks(res.data);
        } catch (err) {
          console.error("Error fetching tasks", err);
        }
      };

      fetchTasks();
    }, [currentUser]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      );
    }

    if (!currentUser) {
      return null;
    }
  

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN PROGRESS").length;
  const todoTasks = tasks.filter((t) => t.status === "TO DO").length;

  return (
    <div className="memberdashboard bg-gradient-to-r from-emerald-200 to-emerald-900 min-h-screen">
      <div className="flex">
        <Sidebar role="member" />

        <div className="main-content w-full p-6">
          <header className="dashboard-header mb-6">
            <h1 className="text-4xl font-bold text-emerald-900">Member Dashboard</h1>
            <p className="text-emerald-700">View tasks and their status</p>
          </header>

          <div className="overview-grid grid grid-cols-3 gap-6 mb-6">
            <div className="overview-card bg-emerald-950 p-4 rounded-lg shadow-md">
              <h2 className="text-lg text-cyan-50 font-bold">Total Tasks</h2>
              <p className="text-2xl font-bold text-emerald-600">{totalTasks}</p>
            </div>

            <div className="overview-card bg-emerald-950 p-4 rounded-lg shadow-md">
              <h2 className="text-lg text-cyan-50 font-bold">Your Completed Tasks</h2>
              <p className="text-2xl font-bold text-yellow-600">{completedTasks}</p>
            </div>

            <div className="overview-card bg-emerald-950 p-4 rounded-lg shadow-md">
              <h2 className="text-lg text-cyan-50 font-bold">Your In progress Tasks</h2>
              <p className="text-2xl font-bold text-red-600">{inProgressTasks}</p>
            </div>
          </div>

          <div className="quick-actions grid grid-cols-2 gap-6">
            <div className="action-card  p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">View my tasks</h3>
              <Link
                to="/member-tasks"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                View
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-emerald-100 rounded-lg shadow p-4 grid gap-4 max-w-3xl">
            <h2 className="text-xl font-bold mb-2 text-emerald-900">My Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-600">No tasks assigned yet.</p>
            ) : (
              <ul className="space-y-2 grid grid-cols-3 gap-4">
                {tasks.map((t) => (
                  <li
                    key={t.id}
                    className="border border-dotted border-emerald-900 rounded p-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{t.title}</p>
                      {t.title && (
                        <p className="text-sm text-gray-600">{t.title}</p>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memberdashboard;
