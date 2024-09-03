import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import DroppableArea from "./DroppableArea";
import { BadgeMinus, PlusIcon } from "lucide-react";
import { useAppState } from "./AppStateContext";

export function Canvas() {
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
  return (
    <div className="flex w-[400px]">
      {/* ResizablePanelGroup for the First Array */}
      <div className="min-h-[300px] flex flex-col items-center gap-1 flex-1">
        <ResizablePanelGroup direction="vertical" className="min-h-[300px]">
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
                    <div className="bg-slate-300 text-slate-500 p-2 rounded h-full w-full flex items-center justify-center">
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
                      <span className="font-semibold">Panel 0{index}</span>
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
        <button
          onClick={() => addPanelToFirstArray(1)}
          className="p-4 rounded-full border"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* ResizablePanelGroup for the Second Array */}
      <div className="min-h-[300px] flex flex-col items-center gap-1 flex-1">
        <ResizablePanelGroup direction="vertical" className="min-h-[300px]">
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
                    <div className="bg-slate-300 text-slate-500 p-2 rounded">
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
                      <span className="font-semibold">Panel 1{index}</span>
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
        <button
          onClick={() => addPanelToSecondArray(2)}
          className="p-4 rounded-full border"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
