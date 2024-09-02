import React from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DraggableItem from "./DraggableItem";
import DroppableArea from "./DroppableArea";
import { useAppState } from "./AppStateContext";
import { BadgeMinus } from "lucide-react";

export function ResizableDemo() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { panels, handleDragEnd, addPanel, handleResize, deletePanel } =
    useAppState();

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col space-y-4 p-4">
        <button
          onClick={addPanel}
          className="self-start bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Panel
        </button>

        <div className="space-y-3">
          <DraggableItem id="item-1" label="Draggable 1" />
          <DraggableItem id="item-2" label="Draggable 2" />
          <DraggableItem id="item-3" label="Draggable 3" />
          <DraggableItem id="item-4" label="Draggable 4" />
        </div>

        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[300px] max-w-md rounded-lg border md:min-w-[450px]"
        >
          {panels.map((panel, index) => (
            <ResizablePanel
              key={panel.id}
              defaultSize={100 / panels.length}
              onResize={(size) => handleResize(panel.id, size)}
            >
              <div className="relative h-full">
                <DroppableArea id={panel.id}>
                  <div className="flex h-full items-center justify-center p-4">
                    <span className="font-semibold">Panel {index + 1}</span>
                  </div>
                </DroppableArea>

                <button
                  onClick={() => deletePanel(panel.id)}
                  className="absolute top-0 right-0 m-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  <BadgeMinus />
                </button>
                <div className="absolute bottom-0 right-0 m-2 text-xs text-gray-700">
                  {panel.size}%
                </div>
              </div>
              {index < panels.length - 1 && <ResizableHandle withHandle />}
            </ResizablePanel>
          ))}
        </ResizablePanelGroup>
      </div>
    </DndContext>
  );
}
