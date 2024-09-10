import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";

import { useSortable } from "@dnd-kit/sortable";
import { Item } from "@/lib/types";

interface SortableItemProps {
  id: UniqueIdentifier;
  item: Item;
  canvasIndex: number;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  item,
  canvasIndex,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { item, canvasIndex },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : "auto", // Ensure a higher z-index when dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab z-50 h-full w-full"
    >
      {children}
    </div>
  );
};

export default SortableItem;
