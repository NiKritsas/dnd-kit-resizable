import React from "react";
import { useDroppable, UniqueIdentifier } from "@dnd-kit/core";

interface DroppableAreaProps {
  id: UniqueIdentifier;
  children?: React.ReactNode;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full flex items-center justify-center ${
        isOver ? "bg-green-100" : "bg-white"
      } border border-dashed ${
        isOver ? "border-green-500" : "border-gray-300"
      } rounded p-4`}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
