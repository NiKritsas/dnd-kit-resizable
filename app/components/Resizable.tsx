import React, { useEffect, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
} from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";
import { useAppState } from "./AppStateContext";
import { Canvas } from "./canvas/Canvas";
import { cn } from "../../lib/utils";
import { arraySwap } from "@dnd-kit/sortable";

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
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 2 },
    })
  );
  const { panels, dropItemToPanel, swapItemsInPanel } = useAppState();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const itemData = active.data.current as Item;
    const activeId = active.id;

    setActiveItem({ ...itemData, id: activeId });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // flat 2D array to use dnd-kit/sortable arraySwap method
    const items = panels.flatMap((column) => column.map((panel) => panel));
    // if the active item originated from a panel find the panel index
    const activePanelIndex = items.findIndex((x) => x.item?.id === active.id);

    if (over) {
      console.log(over.id);
      // find over panel index
      const overPopulatedPanelIndx = items.findIndex(
        (x) => x.item?.id === over.id
      );
      const overEmptyPanelIndx = items.findIndex((x) => x.id === over.id);
      const overPanelIndex =
        overPopulatedPanelIndx !== -1
          ? overPopulatedPanelIndx
          : overEmptyPanelIndx;

      if (activePanelIndex !== -1) {
        const swappedArray = arraySwap(items, activePanelIndex, overPanelIndex);
        swapItemsInPanel(swappedArray);
      } else {
        dropItemToPanel(over.id, active.data.current);
      }
    }
  };

  useEffect(() => {
    if (panels) console.log(panels);
  }, [panels]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col space-y-4 p-4">
        <div className="border p-4 rounded-md">
          <div className="text-sm font-semibold text-slate-500 pb-2">
            Items pool
          </div>
          <div className="flex flex-wrap gap-2">
            {ITEMS.map((item) => (
              <DraggableItem
                key={item.id}
                id={`pool-item-${item.id}`}
                item={item}
              >
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
      <DragOverlay>
        {activeItem && (
          <div
            className={cn(
              "p-2 rounded",
              activeItem.id.toString().includes("pool-item")
                ? "bg-blue-500 text-white"
                : "bg-slate-300 text-slate-500"
            )}
          >
            {activeItem.title}
            {activeItem.id.toString().includes("panel-item") && (
              <span className="font-bold pl-2 text-slate-500/40">x</span>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
