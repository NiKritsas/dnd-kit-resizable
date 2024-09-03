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
import { BadgeMinus, PlusIcon } from "lucide-react";
import { Canvas } from "./canvas/Canvas";

export interface Item {
  id: string | number;
  title: string;
}

const ITEMS = Array(25)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`,
  }));

export function ResizableDemo() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { panels, dropItemToPanel } = useAppState();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      dropItemToPanel(over.id, active.data.current);
    }
  };

  useEffect(() => {
    if (panels) console.log(panels);
  }, [panels]);

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col space-y-4 p-4">
        <div className="border p-4 rounded-md">
          <div className="text-sm font-semibold text-slate-500 pb-2">
            Items pool
          </div>
          <div className="flex flex-wrap gap-2">
            {ITEMS.map((item) => (
              <DraggableItem key={item.id} id={`item-${item.id}`} item={item}>
                <div className="bg-blue-500 text-white p-2 rounded">
                  {item.title}
                </div>
              </DraggableItem>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border p-4 rounded-md bg-slate-100">
          <Canvas />
        </div>

        <div className="flex gap-2 items-center text-sm">
          <div>Position 00:</div>
          <div className="p-1 bg-slate-100">
            {panels[0][0]?.item
              ? `${panels[0][0].item.title} with size ${panels[0][0].size}%`
              : "empty"}
          </div>
        </div>

        <div className="flex gap-2 items-center text-sm">
          <div>Position 10:</div>
          <div className="p-1 bg-slate-100">
            {panels[1][0]?.item
              ? `${panels[1][0].item.title} with size ${panels[1][0].size}%`
              : "empty"}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
