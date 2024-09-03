// "use client";

// import React from "react";
// import { useDroppable } from "@dnd-kit/core";

// interface TableAreaProps {
//   id: string;
//   children?: React.ReactNode;
// }

// interface DroppableData {
//   id: string;
//   color: string;
// }

// const TableArea: React.FC<TableAreaProps> = ({ id, children }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`w-24 h-24 border border-gray-300 flex items-center justify-center ${
//         isOver ? "bg-blue-100" : "bg-white"
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// interface DraggableTableProps {
//   tableState: (DroppableData | null)[];
//   renderItem: (item: DroppableData | null, index: number) => React.ReactNode;
// }

// const DraggableTable: React.FC<DraggableTableProps> = ({
//   tableState,
//   renderItem,
// }) => {
//   return (
//     <div className="grid grid-cols-2 gap-2">
//       {tableState.map((item, index) => (
//         <TableArea key={index} id={`table-${index}`}>
//           {renderItem(item, index)}
//         </TableArea>
//       ))}
//     </div>
//   );
// };

// export default DraggableTable;
