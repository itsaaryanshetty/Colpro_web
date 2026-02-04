import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-emerald-200 to-emerald-900">
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex bg-gradient-to-r from-emerald-200 to-emerald-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-emerald-950 mb-4">My Teams</h1>

        {projects.length === 0 ? (
          <p className="text-emerald-900">
            You are not assigned to any projects yet.
          </p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              // Group tasks by assignee within this project
              const tasksByUser = {};
              (project.tasks || []).forEach((t) => {
                if (!tasksByUser[t.assignee_id]) {
                  tasksByUser[t.assignee_id] = [];
                }
                tasksByUser[t.assignee_id].push(t);
              });

              return (
                <div
                  key={project.id}
                  className="bg-emerald-100 rounded-lg shadow p-4 border border-emerald-200 max-w-3xl"
                >
                  <h2 className="text-2xl font-semibold text-emerald-900">
                    {project.title}
                  </h2>
                  {project.description && (
                    <p className="text-sm text-gray-700 mb-3">
                      {project.description}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mb-2">
                    Owner:{" "}
                    <span className="font-medium">
                      {userById(project.owner_id)
                        ? `${userById(project.owner_id).first_name} ${userById(project.owner_id).last_name}`
                        : `User #${project.owner_id}`}
                    </span>
                  </p>

                  <h3 className="text-lg font-semibold text-emerald-900 mt-2 mb-1">
                    Team Members & Tasks
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(tasksByUser).map(([assigneeId, userTasks]) => {
                      const assignee = userById(Number(assigneeId));
                      return (
                        <div
                          key={assigneeId}
                          className="border rounded-md p-3 bg-emerald-50"
                        >
                          <p className="font-semibold text-emerald-900 mb-1">
                            {assignee
                              ? `${assignee.first_name} ${assignee.last_name}`
                              : `User #${assigneeId}`}
                            {Number(assigneeId) === currentUser?.id && " (You)"}
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                            {userTasks.map((t) => (
                              <li key={t.id}>
                                {t.title}{" "}
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {t.status}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;