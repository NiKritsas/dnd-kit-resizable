import React, { useEffect } from "react";
import { useDroppable, UniqueIdentifier } from "@dnd-kit/core";

interface DroppableAreaProps {
  id: UniqueIdentifier;
  canvasIndex: number;
  children?: React.ReactNode;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  canvasIndex,
  children,
}) => {
  const { setNodeRef, isOver, over } = useDroppable({
    id,
    data: { canvasIndex },
  });
  // custom isOver check that combines the canvasIndex and the droppable area id
  const isOverDroppableNode =
    (over?.data.current?.canvasIndex === canvasIndex &&
      over?.id.toString().split("_")[0] === id) ||
    isOver;

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full flex items-center justify-center ${
        isOverDroppableNode ? "bg-green-100" : "bg-white"
      } border border-dashed ${
        isOverDroppableNode ? "border-green-500" : "border-gray-300"
      } p-1`}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
