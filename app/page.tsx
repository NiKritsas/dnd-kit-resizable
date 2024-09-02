// pages/index.tsx
"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
// import DraggableTable from "./components/DraggableTable";
// import DroppableItem from "./components/DroppableItem";

import { ResizableDemo } from "./components/Resizable";
import { AppStateProvider } from "./components/AppStateContext";

// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";

// Define the DroppableData interface
// interface DroppableData {
//   id: string;
//   color: string;
// }

export default function Home() {
  // const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  // const initialDroppables: DroppableData[] = [
  //   { id: "item-1", color: "red" },
  //   { id: "item-2", color: "green" },
  //   { id: "item-3", color: "blue" },
  //   { id: "item-4", color: "yellow" },
  //   { id: "item-5", color: "purple" },
  // ];

  // const [tableState, setTableState] = useState<(DroppableData | null)[]>(
  //   Array(6).fill(null)
  // );
  // const [droppables, setDroppables] =
  //   useState<DroppableData[]>(initialDroppables);

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;

  //   if (over) {
  //     const overId = String(over.id);
  //     const activeId = String(active.id);

  //     const overIndex = parseInt(overId.split("-")[1], 10);
  //     const newTableState = [...tableState];
  //     const newDroppables = [...droppables];

  //     const activeItem =
  //       droppables.find((item) => item.id === activeId) ||
  //       tableState.find((item) => item?.id === activeId);

  //     if (activeItem) {
  //       const currentTableIndex = tableState.findIndex(
  //         (item) => item?.id === activeId
  //       );

  //       if (overId.startsWith("table")) {
  //         if (currentTableIndex !== -1) {
  //           newTableState[currentTableIndex] = newTableState[overIndex];
  //         }

  //         newTableState[overIndex] = activeItem;
  //         setTableState(newTableState);

  //         if (currentTableIndex === -1) {
  //           setDroppables(droppables.filter((item) => item.id !== activeId));
  //         }
  //       } else {
  //         setTableState(
  //           newTableState.map((item) => (item?.id === activeId ? null : item))
  //         );
  //         if (!droppables.some((item) => item.id === activeId)) {
  //           setDroppables([...droppables, activeItem]);
  //         }
  //       }
  //     }
  //   }
  // };

  return (
    <>
      {/* <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="flex flex-col items-center space-y-4 p-4">
          <DraggableTable
            tableState={tableState}
            renderItem={(item, index) =>
              item ? (
                <DroppableItem key={item.id} id={item.id} color={item.color} />
              ) : null
            }
          />
          <div className="flex space-x-2 mt-4">
            {droppables.map((item) => (
              <DroppableItem key={item.id} id={item.id} color={item.color} />
            ))}
          </div>
        </div>
      </DndContext> */}

      <AppStateProvider>
        <ResizableDemo />
      </AppStateProvider>
    </>
  );
}
