import React from "react";
import { useDraggable } from "@dnd-kit/core";

const Taskcard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-emerald-200 p-4 shadow-md hover:shadow-lg"
      style={style}
    >
      <h3 className="font-medium text-gray-800">{task.title}</h3>
      <p className="mt-2 text-sm text-gray-500">{task.description}</p>
    </div>
  );
};

export default Taskcard;
