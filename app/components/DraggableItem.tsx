import React from "react";
import { useDraggable, UniqueIdentifier } from "@dnd-kit/core";

interface DraggableItemProps {
  id: UniqueIdentifier;
  label: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-blue-500 text-white p-2 rounded cursor-pointer"
    >
      {label}
    </div>
  );
};

export default DraggableItem;
