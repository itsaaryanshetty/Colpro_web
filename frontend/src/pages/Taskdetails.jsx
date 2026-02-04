import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

const COLUMNS = [
  { id: "TO DO", title: "To Do" },
  { id: "IN PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

function Taskdetails() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  
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
  
  // Fetch tasks
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
        
        if (err.response?.status === 401) {
          authService.logout();
          navigate("/login");
        }
      }
    };

    fetchTasks();
  }, [currentUser, navigate]);

  // Handle drag and drop with backend update
  async function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Find the task being moved
    const task = tasks.find((t) => t.id === taskId);
    
    if (!task || task.status === newStatus) {
      // Task not found or already in this column
      return;
    }

    // Set loading state
    setUpdatingTaskId(taskId);

    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    // Update backend
    try {
      const token = authService.getToken();
      await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log(`Task ${taskId} updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating task status:", err);
      
      // Revert optimistic update on error
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: task.status } : t
        )
      );
      
      alert(err.response?.data?.detail || "Failed to update task status. Please try again.");
    } finally {
      setUpdatingTaskId(null);
    }
  }

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
      <div className="p-6 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-950">My Tasks</h1>
          <p className="text-emerald-700 mt-2">
            Drag and drop tasks to update their status
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              No tasks assigned yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            <DndContext onDragEnd={handleDragEnd}>
              {COLUMNS.map((column) => (
                <Column  
                  key={column.id}
                  column={column}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  updatingTaskId={updatingTaskId}
                />
              ))}
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}

export default Taskdetails;