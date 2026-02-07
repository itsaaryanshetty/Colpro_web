import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {authService} from "../services/authService";
import PageTransition from "../components/PageTransition";
// adding the pie chart feature
import {PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip} from 'recharts';

const API_BASE_URL = "http://localhost:8000";

const Memberdashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  // ✅ ADDED: Missing state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const verifyMemberAccess = async () => {
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
  
      verifyMemberAccess();
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

  // Prepare data for pie chart
  const chartData = [
    { name: "To Do", value: todoTasks, color: "#3b82f6" },
    { name: "In Progress", value: inProgressTasks, color: "#f59e0b" },
    { name: "Done", value: completedTasks, color: "#10b981" }
  ].filter(item => item.value > 0); // Only show segments with tasks

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PageTransition>
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

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column - View Tasks and My Tasks */}
              <div className="space-y-6">
                {/* View Tasks Card */}
                <div className="action-card bg-emerald-200 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-emerald-900">View my tasks</h3>
                  <Link
                    to="/member-tasks"
                    className="bg-emerald-800 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 inline-block"
                  >
                    View
                  </Link>
                </div>

                {/* My Tasks List */}
                <div className="bg-emerald-200 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-emerald-900">My Tasks</h2>
                  {tasks.length === 0 ? (
                    <p className="text-gray-600">No tasks assigned yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {tasks.map((t) => (
                        <li
                          key={t.id}
                          className="border-emerald-900 rounded-2xl p-3 bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-emerald-900">{t.title}</p>
                              {t.description && (
                                <p className="text-sm text-gray-600 mt-1">{t.description}</p>
                              )}
                            </div>
                            <span className="text-xs px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 ml-2 whitespace-nowrap">
                              {t.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Column - Pie Chart */}
              <div className="bg-gray-950 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-400">Task Status Distribution</h2>
                
                {totalTasks === 0 ? (
                  <div className="flex items-center justify-center h-80 text-gray-500">
                    <p>No tasks to display</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '8px 12px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* Task Summary */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      <span className="font-medium text-gray-700">To Do</span>
                    </div>
                    <span className="font-bold text-blue-600">{todoTasks}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                      <span className="font-medium text-gray-700">In Progress</span>
                    </div>
                    <span className="font-bold text-yellow-600">{inProgressTasks}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      <span className="font-medium text-gray-700">Done</span>
                    </div>
                    <span className="font-bold text-green-600">{completedTasks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Memberdashboard;