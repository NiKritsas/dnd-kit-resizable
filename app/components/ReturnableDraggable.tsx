// // components/ReturnableDraggable.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { useDraggable } from "@dnd-kit/core";

// interface ReturnableDraggableProps {
//   id: string;
//   children: React.ReactNode;
// }

// const ReturnableDraggable: React.FC<ReturnableDraggableProps> = ({
//   id,
//   children,
// }) => {
//   const [isDropped, setIsDropped] = useState(false);
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//   });

//   const style: React.CSSProperties = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//   };

//   useEffect(() => {
//     if (!transform && isDropped) {
//       setIsDropped(false);
//     }
//   }, [transform, isDropped]);

//   const handleDragEnd = () => {
//     if (!isDropped) {
//       setIsDropped(true);
//     }
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`flex items-center justify-center ${isDropped ? "" : ""}`}
//       onDragEnd={handleDragEnd}
//       {...listeners}
//       {...attributes}
//     >
//       {children}
//     </div>
//   );
// };

// export default ReturnableDraggable;
