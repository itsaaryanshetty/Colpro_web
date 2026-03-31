import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";
import { FolderPlus, Trash2, CheckSquare, Layers, Plus, ChevronDown, ChevronUp, User } from "lucide-react";

const API_BASE_URL = "http://65.2.107.195:8000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [taskTitle, setTaskTitle] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const [showForm, setShowForm] = useState(false);

  // Verify authentication and role on mount
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

        // Check if user has Admin role
        if (response.data.role !== "Admin") {
          alert("Access denied. Admin privileges required.");
          navigate("/member-dashboard"); // Redirect non-admins to member dashboard
          return;
        }

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

  // Fetch users from FastAPI backend
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const token = authService.getToken();
        const res = await axios.get(`${API_BASE_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchProjects = async () => {
      try {
        const token = authService.getToken();
        const res = await axios.get(`${API_BASE_URL}/projects/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchUsers();
    fetchProjects();
  }, [currentUser]);

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleTaskTitleChange = (userId, value) => {
    setTaskTitle((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handleCreateProject = async () => {
    if (!newProjectTitle || !newProjectDescription) {
      alert("Project title and description are required.");
      return;
    }

    if (selectedUserIds.length === 0) {
      alert("Select at least one user to assign tasks.");
      return;
    }

    const tasksPayload = [];
    selectedUserIds.forEach((userId) => {
      const text = taskTitle[userId];
      if (!text) return;
      text
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((line) => {
          tasksPayload.push({
            title: line,
            assignee_id: userId,
            status: "TO DO", // Fixed to match backend expected enum if needed, usually TO DO
            due_date: null,
          });
        });
    });

    if (tasksPayload.length === 0) {
      alert("Please add at least one task for the selected users.");
      return;
    }

    try {
      const token = authService.getToken();
      const res = await axios.post(
        `${API_BASE_URL}/projects/`,
        {
          title: newProjectTitle,
          description: newProjectDescription,
          owner_id: currentUser.id,
          tasks: tasksPayload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProjects((prev) => [...prev, res.data]);
      setNewProjectTitle("");
      setNewProjectDescription("");
      setSelectedUserIds([]);
      setTaskTitle({});
      setShowForm(false);
      alert("Project created successsfully!");
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? All associated tasks will also be deleted.")) {
      return;
    }

    try {
      const token = authService.getToken();
      await axios.delete(
        `${API_BASE_URL}/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      alert("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-xl font-bold text-emerald-400 animate-pulse">Loading admin dashboard...</div>
      </div>
    );
  }

  // Only render if user is authenticated and is Admin
  if (!currentUser || currentUser.role !== "Admin") {
    return null;
  }

  return (<PageTransition>
    <div className="flex bg-slate-950 min-h-screen text-slate-50">
      <Sidebar role="admin" />
      <div className="flex-1 pl-0 lg:pl-64">
        <div className="p-8 max-w-7xl mx-auto pt-24">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <FolderPlus className="text-emerald-400" size={32} />
                Project Management
              </h1>
              <p className="text-slate-400">
                Create new projects and assign tasks to your team members.
              </p>
            </div>
            <button
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 font-medium"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? <ChevronUp size={20} /> : <Plus size={20} />}
              {showForm ? "Cancel Creation" : "New Project"}
            </button>
          </header>

          {/* Create Project Form */}
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out mb-8 ${showForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
          >
            <div className="overflow-hidden">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Create New Project & Assign Tasks</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Website Redesign"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                      <textarea
                        placeholder="Briefly describe the project goals..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 min-h-[120px]"
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Assign Users & Tasks
                    </label>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl h-[280px] overflow-y-auto p-4 custom-scrollbar space-y-3">
                      {users.map((u) => (
                        <div key={u.id} className={`p-3 rounded-lg border transition-all ${selectedUserIds.includes(u.id) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedUserIds.includes(u.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 bg-slate-800'}`}>
                              {selectedUserIds.includes(u.id) && <CheckSquare size={12} className="text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              value={u.id}
                              checked={selectedUserIds.includes(u.id)}
                              onChange={() => handleCheckboxChange(u.id)}
                              className="hidden"
                            />
                            <div className="flex-1">
                              <span className="font-medium text-sm text-slate-200 block">
                                {u.first_name} {u.last_name}
                              </span>
                              <span className="text-xs text-slate-500 block">{u.email}</span>
                            </div>
                          </label>

                          {selectedUserIds.includes(u.id) && (
                            <div className="mt-3 pl-8 animate-in fade-in slide-in-from-top-2">
                              <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none resize-none"
                                placeholder="Enter tasks (one per line)..."
                                rows={3}
                                value={taskTitle[u.id] || ""}
                                onChange={(e) =>
                                  handleTaskTitleChange(u.id, e.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                    onClick={handleCreateProject}
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg hover:border-slate-700 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                    <Layers size={24} />
                  </div>
                  <button
                    className="text-slate-600 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    onClick={() => handleDeleteProject(project.id)}
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{project.description}</p>

                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tasks Overview</h4>
                  {project.tasks && project.tasks.length > 0 ? (
                    <ul className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                      {project.tasks.slice(0, 5).map((t) => (
                        <li key={t.id} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                          <span className="truncate">{t.title}</span>
                        </li>
                      ))}
                      {project.tasks.length > 5 && (
                        <li className="text-xs text-slate-500 italic pl-3">
                          + {project.tasks.length - 5} more tasks...
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600 italic">No tasks assigned yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </PageTransition>
  );
};

export default AdminDashboard;