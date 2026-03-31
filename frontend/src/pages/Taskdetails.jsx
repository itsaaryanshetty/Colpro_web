import React, { useEffect, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import Column from "./Column";
import Taskcard from "../components/Taskcard"; // Need to import this for DragOverlay if we want one
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { Layout } from "lucide-react";


const API_BASE_URL = "http://65.2.107.195:8000";

const COLUMNS = [
  { id: "TO DO", title: "To Do" },
  { id: "IN PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
  { id: "BACKLOG", title: "Backlog" } // Added optional Backlog if you want, but sticking to existing 3
];

function Taskdetails() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [activeId, setActiveId] = useState(null); // For overlay

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

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  // Handle drag and drop with backend update
  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);

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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-xl font-bold text-emerald-400 animate-pulse">Loading board...</div>
      </div>
    );
  }

  // filter only the 3 main columns or use all if dynamic
  const displayedColumns = COLUMNS.filter(c => ["TO DO", "IN PROGRESS", "DONE"].includes(c.id));

  return (
    <PageTransition>
      <div className="flex bg-slate-950 min-h-screen text-slate-100">
        <Sidebar />
        <div className="flex-1 overflow-auto pl-0 lg:pl-64">
          <div className="p-8 h-full flex flex-col pt-24">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Layout className="text-emerald-400" />
                  My Tasks Board
                </h1>
                <p className="text-slate-400 mt-2">
                  Drag and drop tasks to update their status.
                </p>
              </div>

              {/* Could add a 'New Task' button here if needed */}
            </div>

            {tasks.length === 0 ? (
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layout className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No tasks assigned yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  You're all caught up! When you have tasks assigned, they will appear here on your board.
                </p>
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-6 h-full items-start">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  {displayedColumns.map((column) => (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks.filter((task) => task.status === column.id)}
                      updatingTaskId={updatingTaskId}
                    />
                  ))}

                  {/* Add drag overlay for smoother visuals if desired, requires checking activeId */}
                </DndContext>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Taskdetails;