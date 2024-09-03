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
  const {
    panels,
    dropItemToPanel,
    removeItemFromPanel,
    addPanelToFirstArray,
    addPanelToSecondArray,
    handleResize,
    deletePanelFromFirstArray,
    deletePanelFromSecondArray,
  } = useAppState();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      dropItemToPanel(over.id, active.data.current);
    }
  };

  useEffect(() => {
    if (panels) console.log(panels);
  }, [panels]);

  useEffect(() => {
    if (panels[0][1]) {
      console.log(panels[0][1]);
    }
  }, [panels]);

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => addPanelToFirstArray(1)}
            className="self-start bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Panel to First Array
          </button>
          <button
            onClick={() => addPanelToSecondArray(2)}
            className="self-start bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Panel to Second Array
          </button>
        </div>

        <div className="space-y-3">
          {ITEMS.map((item) => (
            <DraggableItem key={item.id} id={`item-${item.id}`} item={item}>
              <div className="bg-blue-500 text-white p-2 rounded">
                {item.title}
              </div>
            </DraggableItem>
          ))}
        </div>

        {/* ResizablePanelGroup for the First Array */}
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[300px] max-w-md rounded-lg border md:min-w-[450px]"
        >
          {panels[0].map((panel, index) => (
            <ResizablePanel
              key={panel.id}
              id={panel.id}
              order={index}
              onResize={(size) => handleResize(panel.id, size)}
            >
              <div className="relative h-full">
                <DroppableArea id={panel.id}>
                  {panel.item ? (
                    <div className="bg-red-500 text-white p-2 rounded">
                      {panel.item.title}
                      <span
                        className="font-bold pl-2 cursor-pointer"
                        onClick={() => removeItemFromPanel(panel.id)}
                      >
                        x
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-4">
                      <span className="font-semibold">Panel {index + 1}</span>
                    </div>
                  )}
                </DroppableArea>

                <button
                  onClick={() => deletePanelFromFirstArray(panel.id, 1)}
                  className="absolute top-0 right-0 m-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  <BadgeMinus />
                </button>
                <div className="absolute bottom-0 right-0 m-2 text-xs text-gray-700">
                  {panel.size}%
                </div>
              </div>
              {index < panels[0].length - 1 && <ResizableHandle withHandle />}
            </ResizablePanel>
          ))}
        </ResizablePanelGroup>

        {/* ResizablePanelGroup for the Second Array */}
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[300px] max-w-md rounded-lg border md:min-w-[450px]"
        >
          {panels[1].map((panel, index) => (
            <ResizablePanel
              key={panel.id}
              id={panel.id}
              order={index}
              onResize={(size) => handleResize(panel.id, size)}
            >
              <div className="relative h-full">
                <DroppableArea id={panel.id}>
                  {panel.item ? (
                    <div className="bg-green-500 text-white p-2 rounded">
                      {panel.item.title}
                      <span
                        className="font-bold pl-2 cursor-pointer"
                        onClick={() => removeItemFromPanel(panel.id)}
                      >
                        x
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-4">
                      <span className="font-semibold">Panel {index + 1}</span>
                    </div>
                  )}
                </DroppableArea>

                <button
                  onClick={() => deletePanelFromSecondArray(panel.id, 2)}
                  className="absolute top-0 right-0 m-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  <BadgeMinus />
                </button>
                <div className="absolute bottom-0 right-0 m-2 text-xs text-gray-700">
                  {panel.size}%
                </div>
              </div>
              {index < panels[1].length - 1 && <ResizableHandle withHandle />}
            </ResizablePanel>
          ))}
        </ResizablePanelGroup>
      </div>
    </DndContext>
  );
}
