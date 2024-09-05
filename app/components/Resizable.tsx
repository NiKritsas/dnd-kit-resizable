import React, { useEffect, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";
import { useAppState } from "./AppStateContext";

import { cn } from "../../lib/utils";
import { arraySwap } from "@dnd-kit/sortable";
import Canvas from "./canvas/Canvas";

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
    useSensor(MouseSensor, {
      activationConstraint: { distance: 2 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 2 },
    })
  );
  const { state, dropItemToPanel, swapItemsInPanel, removeItemFromPanel } =
    useAppState();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const itemData = active.data.current?.item as Item;
    const activeId = active.data.current
      ? active.data.current.item.id
      : active.id;

    setActiveItem({ ...itemData, id: activeId });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      // No valid drop target
      setActiveItem(null);
      return;
    }

    const overCanvasIndx = over.data.current?.canvasIndex as number;
    const activeCanvasIndx = active.data.current?.canvasIndex as number;

    // Get the panel data for the "over" canvas
    const panels = state[overCanvasIndx].panels.flatMap((column) =>
      column.map((panel) => panel)
    );

    // Find active and over panel indices
    const activePanelIndex = panels.findIndex(
      (x) => `${x.id}_${x.item?.id}` === active.id
    );
    const overPopulatedPanelIndx = panels.findIndex(
      (x) => `${x.id}_${x.item?.id}` === over.id
    );
    const overEmptyPanelIndx = panels.findIndex((x) => x.id === over.id);
    const overPanelIndex =
      overPopulatedPanelIndx !== -1
        ? overPopulatedPanelIndx
        : overEmptyPanelIndx;

    if (activeCanvasIndx !== undefined && overCanvasIndx !== undefined) {
      if (activeCanvasIndx === overCanvasIndx) {
        // Same canvas, just swap the items within the same canvas
        console.log("Swapped items within the same canvas");
        const swappedArray = arraySwap(
          panels,
          activePanelIndex,
          overPanelIndex
        );
        swapItemsInPanel(overCanvasIndx, swappedArray);
      } else {
        // Different canvas, move the item to the new canvas and remove from the old one
        console.log("Moved item to a different canvas");

        // Drop the item into the new panel in the target canvas
        dropItemToPanel(overCanvasIndx, over.id, activeItem);

        // Remove the item from the original canvas panel
        removeItemFromPanel(activeCanvasIndx, active.id.toString());
      }
    } else {
      // If the item is coming from a pool (not from any specific panel) and being dropped on a new canvas
      console.log("Dropped a pool item into an empty panel");
      dropItemToPanel(overCanvasIndx, over.id, activeItem);
    }

    // Clear active item after drag end
    setActiveItem(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    // console.log(over);
  };

  // useEffect(() => {
  //   if (panels) console.log(panels);
  // }, [panels]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
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
          <Canvas index={0} />
          <Canvas index={1} />
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
