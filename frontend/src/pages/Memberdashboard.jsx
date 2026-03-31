import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LayoutDashboard, CheckCircle2, Clock, ListTodo, ArrowRight } from "lucide-react";

const API_BASE_URL = "http://65.2.107.195:8000";

const Memberdashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyMemberAccess = async () => {
      const token = authService.getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl font-medium text-emerald-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN PROGRESS").length;
  const todoTasks = tasks.filter((t) => t.status === "TO DO").length;

  const chartData = [
    { name: "To Do", value: todoTasks, color: "#3b82f6" },
    { name: "In Progress", value: inProgressTasks, color: "#eab308" },
    { name: "Done", value: completedTasks, color: "#10b981" }
  ].filter(item => item.value > 0);

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
        className="font-bold text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex">
        <Sidebar role="member" />

        <div className="flex-1 overflow-auto pl-0 lg:pl-64">
          <div className="p-8 max-w-7xl mx-auto pt-24">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <LayoutDashboard className="text-emerald-400" />
                  Member Dashboard
                </h1>
                <p className="text-slate-400">Welcome back, <span className="text-emerald-400 font-semibold">{currentUser.full_name || 'User'}</span>. Here's your overview.</p>
              </div>
              <div className="text-sm text-slate-500 font-medium bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={<ListTodo size={24} className="text-blue-400" />}
                bg="bg-blue-500/10"
                border="border-blue-500/20"
                textColor="text-blue-400"
              />
              <StatsCard
                title="In Progress"
                value={inProgressTasks}
                icon={<Clock size={24} className="text-yellow-400" />}
                bg="bg-yellow-500/10"
                border="border-yellow-500/20"
                textColor="text-yellow-400"
              />
              <StatsCard
                title="Completed"
                value={completedTasks}
                icon={<CheckCircle2 size={24} className="text-emerald-400" />}
                bg="bg-emerald-500/10"
                border="border-emerald-500/20"
                textColor="text-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Tasks List Section */}
              <div className="flex flex-col space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 text-white">Focus on your work</h3>
                    <p className="text-slate-400 mb-6 text-sm">Review your assigned tasks and update their status.</p>
                    <Link
                      to="/member-tasks"
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition-all font-medium text-sm shadow-lg shadow-emerald-900/20 group"
                    >
                      View All Tasks
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl p-6 backdrop-blur-sm flex-1">
                  <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                    <ListTodo size={18} className="text-slate-400" />
                    Recent Tasks
                  </h2>

                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                      <p>No tasks assigned yet.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {tasks.slice(0, 5).map((t) => (
                        <li key={t.id} className="group p-4 bg-slate-950/50 hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-default">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{t.title}</p>
                              {t.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.description}</p>
                              )}
                            </div>
                            <StatusBadge status={t.status} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl p-6 backdrop-blur-sm flex flex-col">
                <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  Task Status Distribution
                </h2>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                  {totalTasks === 0 ? (
                    <div className="text-slate-500 text-center">
                      <p>No data to analyze</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #1e293b',
                            borderRadius: '12px',
                            color: '#f8fafc',
                            padding: '12px'
                          }}
                          itemStyle={{ color: '#f8fafc' }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          formatter={(value) => <span className="text-slate-300 ml-1">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Custom Legend/Summary */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <SummaryItem label="To Do" value={todoTasks} color="bg-blue-500" />
                  <SummaryItem label="In Progress" value={inProgressTasks} color="bg-yellow-500" />
                  <SummaryItem label="Done" value={completedTasks} color="bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const StatsCard = ({ title, value, icon, bg, border, textColor }) => (
  <div className={`p-6 rounded-2xl border ${border} ${bg} backdrop-blur-sm flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
    <div className={`w-12 h-12 rounded-xl bg-slate-950/30 flex items-center justify-center shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  let classes = "bg-slate-800 text-slate-400 border-slate-700";
  if (status === "DONE") classes = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  else if (status === "IN PROGRESS") classes = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  else if (status === "TO DO") classes = "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${classes}`}>
      {status}
    </span>
  );
};

const SummaryItem = ({ label, value, color }) => (
  <div className="bg-slate-950/50 rounded-lg p-3 text-center border border-slate-800">
    <div className={`w-2 h-2 ${color} rounded-full mx-auto mb-2`}></div>
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-lg font-bold text-white">{value}</p>
  </div>
);

export default Memberdashboard;