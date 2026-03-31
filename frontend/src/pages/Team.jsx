import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageTransition from "../components/PageTransition";
import { Users, Briefcase, Mail, ShieldCheck } from "lucide-react";

const API_BASE_URL = "http://65.2.107.195:8000";

const Team = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const userById = (id) => {
    return users.find((u) => u.id === id);
  };

  // Verify authentication
  useEffect(() => {
    const verifyAccess = async () => {
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

    verifyAccess();
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const token = authService.getToken();

        const [usersRes, projectsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/users/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_BASE_URL}/projects/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUsers(usersRes.data);

        // Filter projects where current user is owner or has at least one task
        const relevant = projectsRes.data.filter((project) => {
          const isOwner = project.owner_id === currentUser?.id;
          const hasTask =
            project.tasks &&
            project.tasks.some((t) => t.assignee_id === currentUser?.id);
          return isOwner || hasTask;
        });

        setProjects(relevant);
      } catch (err) {
        console.error("Error loading team data", err);

        if (err.response?.status === 401) {
          authService.logout();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-xl font-bold text-emerald-400 animate-pulse">Loading teams...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <PageTransition>
      <div className="flex bg-slate-950 min-h-screen text-slate-50">
        <Sidebar />
        <div className="flex-1 pl-0 lg:pl-64">
          <div className="p-8 max-w-7xl mx-auto pt-24">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="text-emerald-400" size={32} />
                My Teams
              </h1>
              <p className="text-slate-400 max-w-2xl">
                View your project teams and task distributions. Collaborating with others makes work lighter.
              </p>
            </header>

            {projects.length === 0 ? (
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No projects assigned</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  You are not assigned to any teams yet. Once you're added to a project, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {projects.map((project) => {
                  // Group tasks by assignee within this project
                  const tasksByUser = {};
                  (project.tasks || []).forEach((t) => {
                    if (!tasksByUser[t.assignee_id]) {
                      tasksByUser[t.assignee_id] = [];
                    }
                    tasksByUser[t.assignee_id].push(t);
                  });

                  const owner = userById(project.owner_id);

                  return (
                    <div
                      key={project.id}
                      className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden"
                    >
                      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                              <Briefcase className="text-emerald-500" size={24} />
                              {project.title}
                            </h2>
                            {project.description && (
                              <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              {owner?.first_name?.charAt(0) || 'O'}
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Owner</p>
                              <p className="text-sm font-medium text-white">
                                {owner ? `${owner.first_name} ${owner.last_name}` : `User #${project.owner_id}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-950/30">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <Users size={20} className="text-slate-400" />
                          Team Members & Tasks
                        </h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {Object.entries(tasksByUser).map(([assigneeId, userTasks]) => {
                            const assignee = userById(Number(assigneeId));
                            const isCurrentUser = Number(assigneeId) === currentUser?.id;

                            return (
                              <div
                                key={assigneeId}
                                className={`rounded-xl p-5 border transition-all hover:shadow-lg ${isCurrentUser
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-slate-800/40 border-slate-700 hover:bg-slate-800/60"
                                  }`}
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${isCurrentUser ? 'bg-emerald-500' : 'bg-slate-700'
                                    }`}>
                                    {assignee?.first_name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className={`font-bold ${isCurrentUser ? 'text-emerald-400' : 'text-slate-200'}`}>
                                      {assignee ? `${assignee.first_name} ${assignee.last_name}` : `User #${assigneeId}`}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                      <ShieldCheck size={12} />
                                      {isCurrentUser ? "You" : "Member"}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {userTasks.map((t) => (
                                    <div key={t.id} className="text-sm bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 flex justify-between items-start gap-2">
                                      <span className="text-slate-300 line-clamp-1">{t.title}</span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${t.status === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' :
                                          t.status === 'IN PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {t.status === 'IN PROGRESS' ? 'WIP' : t.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Team;