import React, { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import {
  DndContext,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Item, OutfitItem } from "@/lib/types";
import DraggableItem from "./DraggableItem";
import { useAppState } from "./AppStateContext";
import Canvas from "./canvas/Canvas";

const OUTFITS: OutfitItem[] = [
  { id: "3", title: "Item 3", col: 0, row: 1, heightPercentage: 50 },
  { id: "1", title: "Item 1", col: 0, row: 2, heightPercentage: 20 },
  { id: "2", title: "Item 2", col: 1, row: 0, heightPercentage: 20 },
  { id: "5", title: "Item 5", col: 1, row: 1, heightPercentage: 60 },
  { id: "4", title: "Item 4", col: 1, row: 2, heightPercentage: 20 },
];

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
  const {
    state,
    dropItemToPanel,
    swapItemsInPanel,
    addItemToCanvases,
    addCanvas,
    createCanvasWithItems,
  } = useAppState();

  const addCanvasWithItems = () => {
    createCanvasWithItems(OUTFITS);
  };

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
        const swappedArray = arraySwap(
          panels,
          activePanelIndex,
          overPanelIndex
        );
        swapItemsInPanel(overCanvasIndx, swappedArray);
      } else {
        dropItemToPanel(overCanvasIndx, over.id, activeItem);
      }
    } else {
      dropItemToPanel(overCanvasIndx, over.id, activeItem);
    }

    // Clear active item after drag end
    setActiveItem(null);
  };

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

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
                <div className="bg-blue-500 text-white p-2 rounded flex  gap-2">
                  <div className="font-semibold">{item.title}</div>
                  <button onClick={() => addItemToCanvases(item)}>
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </DraggableItem>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center">
          {/* Button add a new canvas */}
          <button className="p-2 rounded-md bg-slate-200" onClick={addCanvas}>
            Add New Canvas
          </button>
          <button
            className="p-2 rounded-md bg-slate-500 text-white"
            onClick={addCanvasWithItems}
          >
            Add Canvas with Items
          </button>
        </div>

        <div className="flex flex-wrap gap-4 border p-6 rounded-md bg-slate-100">
          {state.map((canvas, index) => (
            <Canvas key={canvas.id} index={index} />
          ))}
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
