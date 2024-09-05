import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";
import { useSortable } from "@dnd-kit/sortable";

interface SortableItemProps {
  id: UniqueIdentifier;
  item: Item;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, item, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: item,
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
      className="cursor-grab"
    >
      {children}
    </div>
  );
};

export default SortableItem;
