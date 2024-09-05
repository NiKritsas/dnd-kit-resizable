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
  const { state, dropItemToPanel, swapItemsInPanel } = useAppState();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const itemData = active.data.current?.item as Item;
    const activeId = active.id;

    setActiveItem({ ...itemData, id: activeId });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const itemData = active.data.current?.item as Item;

    const activeCanvasIndx: number | null = active.id
      .toString()
      .includes("pool-item")
      ? null
      : Number(active.id.toString().split("_")[0]);

    if (over) {
      const overCanvasIndx = over.data.current?.canvasIndex as number;

      console.log(`overCanvasIndx: ${overCanvasIndx}`);
      console.log(`activeCanvasIndx: ${activeCanvasIndx}`);

      // flat 2D array to use dnd-kit/sortable arraySwap method
      const panels = state[overCanvasIndx].panels.flatMap((column) =>
        column.map((panel) => panel)
      );
      // if the active item originated from a panel find the panel index
      const activePanelIndex = panels.findIndex(
        (x) => `${overCanvasIndx}_${x.id}_${x.item?.id}` === active.id
      );
      // find over panel index
      const overPopulatedPanelIndx = panels.findIndex(
        (x) => `${overCanvasIndx}_${x.item?.id}` === over.id
      );
      const overEmptyPanelIndx = panels.findIndex((x) => x.id === over.id);
      const overPanelIndex =
        overPopulatedPanelIndx !== -1
          ? overPopulatedPanelIndx
          : overEmptyPanelIndx;

      if (activePanelIndex !== -1) {
        const swappedArray = arraySwap(
          panels,
          activePanelIndex,
          overPanelIndex
        );
        swapItemsInPanel(overCanvasIndx, swappedArray);
      } else {
        console.log(itemData);
        dropItemToPanel(overCanvasIndx, over.id, itemData);
      }
      console.log(panels);
      // console.log(canvasIndx);
      console.log(`active: ${activePanelIndex}`);
      // console.log(`over: ${overPanelIndex}`);
    } else {
      setActiveItem(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    // console.log(over);
  };

  // useEffect(() => {
  //   if (panels) console.log(panels);
  // }, [panels]);

  console.log(activeItem);

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
