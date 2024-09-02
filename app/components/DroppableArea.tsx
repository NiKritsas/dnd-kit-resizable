import React from "react";
import { useDroppable, UniqueIdentifier } from "@dnd-kit/core";
import { useAppState } from "./AppStateContext";

interface DroppableAreaProps {
  id: UniqueIdentifier;
  children?: React.ReactNode;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ id, children }) => {
  const { droppedItems } = useAppState();
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
      {droppedItems[id] ? (
        <div className="bg-green-500 text-white p-2 rounded">
          {droppedItems[id]?.toString()}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default DroppableArea;
