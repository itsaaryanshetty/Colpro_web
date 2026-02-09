import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Taskcard from "../components/Taskcard";
import { MoreHorizontal, Plus } from "lucide-react";

const Column = ({ column, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // Dynamic colors based on column ID
  const getColumnColor = (id) => {
    switch (id) {
      case "TO DO": return "text-blue-400 border-t-blue-500 bg-blue-500/5";
      case "IN PROGRESS": return "text-yellow-400 border-t-yellow-500 bg-yellow-500/5";
      case "DONE": return "text-emerald-400 border-t-emerald-500 bg-emerald-500/5";
      default: return "text-slate-400 border-t-slate-500 bg-slate-500/5";
    }
  };

  return (
    <div className={`flex w-80 min-w-[320px] flex-col rounded-xl bg-slate-900 border border-slate-800 shadow-xl transition-colors ${isOver ? 'ring-2 ring-emerald-500/50 bg-slate-800' : ''}`}>

      {/* Column Header */}
      <div className={`p-4 border-b border-slate-800 flex items-center justify-between rounded-t-xl border-t-4 ${getColumnColor(column.id).split(' ')[1]}`}>
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-100">{column.title}</h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-medium text-slate-400 border border-slate-700">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Column Body / Droppable Area */}
      <div ref={setNodeRef} className={`flex flex-1 flex-col gap-3 p-3 min-h-[150px] transition-colors ${getColumnColor(column.id).split(' ')[2]}`}>
        {tasks.map((task) => (
          <Taskcard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-800 md:border-slate-700/50 rounded-lg flex items-center justify-center text-slate-600 text-sm italic">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Column Footer */}
      {/* <div className="p-3 border-t border-slate-800">
        <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 text-sm font-medium w-full p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <Plus size={16} /> Add Task
        </button>
      </div> */}
    </div>
  );
};

export default Column;