"use client";

import React, { useState, useRef } from "react";
import { useDraggable, useDndMonitor, DragEndEvent } from "@dnd-kit/core";

interface DroppableItemProps {
  id: string;
  color: string;
  children?: React.ReactNode;
}

const DroppableItem: React.FC<DroppableItemProps> = ({
  id,
  color,
  children,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    backgroundColor: color,
  };

  useDndMonitor({
    onDragEnd(event: DragEndEvent) {
      if (event.active.id === id) {
        // Reset position after dragging ends
        setPosition({ x: 0, y: 0 });
      }
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-16 h-16 rounded-md flex items-center justify-center cursor-pointer text-white"
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default DroppableItem;
