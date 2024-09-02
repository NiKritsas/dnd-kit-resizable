import React, { useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
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

export interface Item {
  id: string | number;
  title: string;
}

const ITEMS: Item[] = [
  {
    id: 1,
    title: "Item 1",
  },
  {
    id: 2,
    title: "Item 2",
  },
  {
    id: 3,
    title: "Item 3",
  },
  {
    id: 4,
    title: "Item 4",
  },
];

export function ResizableDemo() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { panels, dropItemToPanel, addPanel, handleResize, deletePanel } =
    useAppState();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      dropItemToPanel(active.id, over.id, active.data.current);
    }
  };

  useEffect(() => {
    if (panels) console.log(panels);
  }, [panels]);

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
          {ITEMS.map((item) => (
            <DraggableItem key={item.id} id={`item-${item.id}`} item={item} />
          ))}
        </div>

        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[300px] max-w-md rounded-lg border md:min-w-[450px]"
        >
          {panels.map((panel, index) => (
            <ResizablePanel
              key={panel.id}
              id={panel.id}
              order={index}
              // defaultSize={100 / panels.length}
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
