import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Admintasks = ({member}) => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [assignedTasks, setAssignedTasks] = useState([]);

  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      const newTask = {
        id: Date.now(),
        description: newTaskDescription,
        projectId,
        status: "Pending",
        assignedTo: selectedMember || "Unassigned",
      };
      setTasks([...tasks, newTask]);
      setAssignedTasks([...assignedTasks, { taskId: newTask.id, member: selectedMember || "Unassigned" }]);
      setNewTaskDescription(""); // Clear input field
      setSelectedMember(""); // Clear selected member
    }
  };

  const handleAssignTask = (taskId) => {
    const taskToAssign = tasks.find((task) => task.id === taskId);
    if (taskToAssign) {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, assignedTo: selectedMember || "Unassigned" }
          : task
      );
      setTasks(updatedTasks);
    }
  };

  return (
    
    <div className="admin-tasks">
    
      <h1>Tasks for Project {projectId}</h1>

      {/* Create Task */}
      <div className="create-task">
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Enter task description"
        />
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className="ml-2 p-2"
        >
          <option value="">Select Member</option>
          {members.map((member, index) => (
            <option key={index} value={member}>{member}</option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* List of Tasks */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks for this project.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Assigned to: {task.assignedTo}</p>
              <select
                onChange={(e) => handleAssignTask(task.id)}
                value={task.assignedTo}
              >
                <option value="">Unassigned</option>
                {members.map((member, index) => (
                  <option key={index} value={member}>{member}</option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admintasks;
