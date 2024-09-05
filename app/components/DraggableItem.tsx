import React from "react";
import { useDraggable, UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";

interface DraggableItemProps {
  id: UniqueIdentifier;
  item: Item;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  item,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { item },
  });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab z-50"
    >
      {children}
    </div>
  );
};

export default DraggableItem;
