import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";

const API_BASE_URL = "http://localhost:8000";

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
            status: "TODO",
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

  // Show loading while verifying authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-emerald-200 to-emerald-900">
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  // Only render if user is authenticated and is Admin
  if (!currentUser || currentUser.role !== "Admin") {
    return null;
  }

  return (<PageTransition>
    <div className="admin-dashboard bg-gradient-to-r from-emerald-200 to-emerald-900 min-h-screen">
      <div className="flex">
        <Sidebar role="admin" />
        <div className="main-content w-full p-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-2">
            Admin Dashboard
          </h1>

          <div className="bg-emerald-950 p-6 max-w-200 rounded-lg shadow-lg mb-8 flex-none">
            <h2 className="text-xl text-emerald-300 font-bold mb-4">
              Create New Project
            </h2>
            
            <button
              className="bg-emerald-400 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Hide Form" : "Show Form"}
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                showForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-4"> 
                  <div className="p-4 bg-emerald-100 rounded-lg">
                    <input
                      type="text"
                      placeholder="Project Title"
                      className="border border-dotted border-emerald-900 p-2 rounded w-full mb-2"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="Project Description"
                      className="border border-dotted border-emerald-900 p-2 rounded w-full mb-2"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                    />

                    <div className="mb-4">
                      <label className="block font-semibold text-gray-700 mb-2">
                        Assign Users & Tasks:
                      </label>
                      <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto bg-white p-2 rounded">
                        {users.map((u) => (
                          <div key={u.id} className="p-2">
                            <label className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                value={u.id}
                                checked={selectedUserIds.includes(u.id)}
                                onChange={() => handleCheckboxChange(u.id)}
                                className="mr-2"
                              />
                              <span className="font-medium">
                                {u.first_name} {u.last_name}
                              </span>
                              <span className="text-sm text-gray-600 ml-2">({u.email})</span>
                            </label>
                            {selectedUserIds.includes(u.id) && (
                              <textarea
                                className="w-full border rounded p-1 text-sm"
                                placeholder="One task per line for this user"
                                value={taskTitle[u.id] || ""}
                                onChange={(e) =>
                                  handleTaskTitleChange(u.id, e.target.value)
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                      onClick={handleCreateProject}
                    >
                      Create Project
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-4 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded shadow-md"
              >
                <h3 className="text-lg font-bold">{project.title}</h3>
                <p className="text-gray-700">{project.description} (Owner id -{'>'} {project.owner_id})</p>
                {project.tasks && project.tasks.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    {project.tasks.map((t) => (
                      <li key={t.id}>
                        {t.title} (Assignee Id #{t.assignee_id})
                        <br/> <p>Due date: {t.due_date}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="mt-4 bg-gray-300 text-red-600 px-3 py-2 rounded hover:bg-gray-400 transition-colors  max-w-40"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete Project
                </button>
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









// import React, { useState, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUserIds, setSelectedUserIds] = useState([]);
//   const [taskTitle, setTaskTitle] = useState({});

//   const [newProjectTitle, setNewProjectTitle] = useState("");
//   const [newProjectDescription, setNewProjectDescription] = useState("");
  
//   // Simple boolean state for open/close
//   const [showForm, setShowForm] = useState(false);

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token || !user || user.role !== "Admin") {
//       navigate("/login");
//     }
//   }, [navigate, token, user]);

//   // Fetch users from FastAPI backend
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/users/`);
//         setUsers(res.data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     };

//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/projects/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };

//     fetchUsers();
//     if (token) {
//       fetchProjects();
//     }
//   }, [token]);

//   const handleCheckboxChange = (userId) => {
//     setSelectedUserIds((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleTaskTitleChange = (userId, value) => {
//     setTaskTitle((prev) => ({
//       ...prev,
//       [userId]: value,
//     }));
//   };

//   const handleCreateProject = async () => {
//     if (!newProjectTitle || !newProjectDescription) {
//       alert("Project title and description are required.");
//       return;
//     }

//     if (selectedUserIds.length === 0) {
//       alert("Select at least one user to assign tasks.");
//       return;
//     }

//     const tasksPayload = [];
//     selectedUserIds.forEach((userId) => {
//       const text = taskTitle[userId];
//       if (!text) return;
//       text
//         .split("\n")
//         .map((t) => t.trim())
//         .filter(Boolean)
//         .forEach((line) => {
//           tasksPayload.push({
//             title: line,
//             assignee_id: userId,
//             status: "TODO",
//             due_date: null,
//           });
//         });
//     });

//     if (tasksPayload.length === 0) {
//       alert("Please add at least one task for the selected users.");
//       return;
//     }

//     // Create project locally without backend
//     // const newProject = {
//     //   id: Date.now(),
//     //   name: newProjectTitle,
//     //   description: newProjectDescription,
//     //   owner_id: 1,
//     //   tasks: tasksPayload.map((task, index) => ({
//     //     ...task,
//     //     id: Date.now() + index,
//     //   })),
//     // };

//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/projects/`,
//         {
//           name: newProjectTitle,
//           description: newProjectDescription,
//           owner_id: user.id,
//           tasks: tasksPayload,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     setProjects((prev) => [...prev, newProject]);
//     setNewProjectTitle("");
//     setNewProjectDescription("");
//     setSelectedUserIds([]);
//     setTaskTitle({});
//     setShowForm(false);
//     } catch (err) {
//       console.error("Error creating project:", err);
//       alert("Failed to create project. Please try again.");
//     }
//   };

//   return (
//     <div className="admin-dashboard bg-gradient-to-r from-emerald-200 to-emerald-900 min-h-screen">
//       <div className="flex">
//         <Sidebar role="admin" />
//         <div className="main-content w-full p-6">
//           <h1 className="text-4xl font-bold text-emerald-900 mb-2">
//             Admin Dashboard
//           </h1>

//           <div className="bg-emerald-950 p-6 w-200 rounded-lg shadow-lg mb-8">
//             <h2 className="text-xl text-emerald-300 font-bold mb-4">
//               Create New Project
//             </h2>
            
//             {/* Reverted to simple button, just toggles state */}
//             <button
//               className="bg-emerald-400 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "Hide Form" : "Show Form"}
//             </button>

//             {/* ANIMATION WRAPPER START */}
//             {/* We use grid-template-rows to animate from 0fr to 1fr */}
//             <div
//               className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
//                 showForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//               }`}
//             >
//               <div className="overflow-hidden">
//                 {/* Added pt-4 here inside the overflow container instead of mt-4 on the parent 
//                   to ensure smooth spacing animation 
//                 */}
//                 <div className="pt-4"> 
//                   <div className="p-4 bg-emerald-100 rounded-lg">
//                     <input
//                       type="text"
//                       placeholder="Project Title"
//                       className="border border-dotted border-emerald-900 p-2 rounded w-full mb-2"
//                       value={newProjectTitle}
//                       onChange={(e) => setNewProjectTitle(e.target.value)}
//                     />
//                     <textarea
//                       placeholder="Project Description"
//                       className="border border-dotted border-emerald-900 p-2 rounded w-full mb-2"
//                       value={newProjectDescription}
//                       onChange={(e) => setNewProjectDescription(e.target.value)}
//                     />

//                     <div className="mb-4">
//                       <label className="block font-semibold text-gray-700 mb-2">
//                         Assign Users & Tasks:
//                       </label>
//                       <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto bg-white p-2 rounded">
//                         {users.map((u) => (
//                           <div key={u.id} className="p-2">
//                             <label className="flex items-center mb-2">
//                               <input
//                                 type="checkbox"
//                                 value={u.id}
//                                 checked={selectedUserIds.includes(u.id)}
//                                 onChange={() => handleCheckboxChange(u.id)}
//                                 className="mr-2"
//                               />
//                               {u.username || u.email}
//                             </label>
//                             {selectedUserIds.includes(u.id) && (
//                               <textarea
//                                 className="w-full border rounded p-1 text-sm"
//                                 placeholder="One task per line for this user"
//                                 value={taskDescriptions[u.id] || ""}
//                                 onChange={(e) =>
//                                   handleTaskDescriptionChange(u.id, e.target.value)
//                                 }
//                               />
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <button
//                       className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
//                       onClick={handleCreateProject}
//                     >
//                       Create Project
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* ANIMATION WRAPPER END */}

//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             {projects.map((project) => (
//               <div
//                 key={project.id}
//                 className="bg-white p-4 rounded shadow-md"
//               >
//                 <h3 className="text-lg font-bold">{project.name}</h3>
//                 <p className="text-gray-700">{project.description}</p>
//                 {project.tasks && project.tasks.length > 0 && (
//                   <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
//                     {project.tasks.map((t) => (
//                       <li key={t.id}>
//                         {t.title} (assignee #{t.assignee_id})
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;