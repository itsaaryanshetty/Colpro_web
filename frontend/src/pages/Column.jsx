import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Taskcard from "../components/Taskcard";

const Column = ({ column, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex w-80 flex-col rounded-lg bg-emerald-950 p-4 shadow">
      <h2 className="mb-4 font-semibold text-emerald-200">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <Taskcard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;