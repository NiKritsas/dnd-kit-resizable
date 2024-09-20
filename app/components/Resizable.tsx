import React, { useEffect, useId, useState } from "react";
import { PlusIcon, ArrowLeftRight } from "lucide-react";
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

export const ITEMS = Array(25)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`,
    isactive: index % 5 !== 0,
  }));

const OUTFITS: OutfitItem[] = [
  {
    id: ITEMS[0].id,
    title: "Item 1",
    isactive: ITEMS[0].isactive,
    col: 0,
    row: 2,
    heightPercentage: 20,
  },
  {
    id: ITEMS[1].id,
    title: "Item 3",
    isactive: ITEMS[1].isactive,
    col: 0,
    row: 1,
    heightPercentage: 50,
  },
  {
    id: ITEMS[2].id,
    title: "Item 2",
    isactive: ITEMS[2].isactive,
    col: 1,
    row: 0,
    heightPercentage: 20,
  },
  {
    id: ITEMS[3].id,
    title: "Item 5",
    isactive: ITEMS[3].isactive,
    col: 1,
    row: 1,
    heightPercentage: 60,
  },
  {
    id: ITEMS[4].id,
    title: "Item 4",
    isactive: ITEMS[4].isactive,
    col: 1,
    row: 2,
    heightPercentage: 20,
  },
];

export function ResizableDemo() {
  const startingNewCanvasId = useId();
  const [randomNewCanvasId, setRandomNewCanvasId] =
    useState(startingNewCanvasId);

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
    replaceFirstInactiveItem,
    addCanvas,
    createCanvasWithItems,
  } = useAppState();

  const addCanvasWithItems = () => {
    createCanvasWithItems(`canvas-${randomNewCanvasId}`, OUTFITS);
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
        // const swappedArray = panels.map((panel, index) => {
        //   if (index === activePanelIndex) {
        //     return {
        //       ...panel,
        //       item: panels[overPanelIndex].item,
        //     };
        //   } else if (index === overPanelIndex) {
        //     return {
        //       ...panel,
        //       item: panels[activePanelIndex].item,
        //     };
        //   }
        //   return panel;
        // });
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

  useEffect(() => {
    setRandomNewCanvasId(
      `${Math.random().toString(16).slice(2)}${state.length}`
    );
  }, [state.length]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <DndContext
      id="visual-builder-dnd"
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
                <div
                  className={cn(
                    " text-white p-2 rounded flex  gap-2",
                    item.isactive ? "bg-blue-500" : "bg-blue-500/50"
                  )}
                >
                  <div className="font-semibold">{item.title}</div>
                  <button onClick={() => addItemToCanvases(item)}>
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => replaceFirstInactiveItem(item)}>
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>
              </DraggableItem>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center">
          {/* Button add a new canvas */}
          <button
            className="p-2 rounded-md bg-slate-200"
            onClick={() => addCanvas(`${randomNewCanvasId}`)}
          >
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
