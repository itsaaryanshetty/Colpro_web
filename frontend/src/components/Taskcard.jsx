import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

const Taskcard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: 999,
      scale: 1.05
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative group rounded-xl p-4 shadow-md transition-all duration-200 border cursor-grab active:cursor-grabbing
        ${isDragging
          ? "bg-emerald-900/40 border-emerald-500/50 shadow-2xl opacity-90 ring-2 ring-emerald-500/20 rotate-2"
          : "bg-slate-800 border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:bg-slate-800/80"
        }
      `}
      style={style}
    >
      <div className="flex justify-between items-start mb-2">
        {/* Tag or Priority could go here */}
        <div className="w-8 h-1 rounded-full bg-emerald-500/30"></div>
        <GripVertical size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h3 className="font-semibold text-slate-100 mb-1 leading-snug">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-3">
         <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800"></div>
         </div>
      </div> */}
    </div>
  );
};

export default Taskcard;
