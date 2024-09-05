import { FC, useId } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Panel, useAppState } from "../AppStateContext";
import DroppableArea from "../DroppableArea";
import { BadgeMinus, PlusIcon } from "lucide-react";
import DraggableItem from "../DraggableItem";
import SortableItem from "../SortableItem";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

interface CanvasColumnProps {
  canvasIndex: number;
  column: number;
  panels: Panel[];
  onAddPanel: (canvasIndx: number, column: number, id: string) => void;
  onDeletePanel: (canvasIndx: number, id: string, column: number) => void;
  onRemoveItem: (canvasIndx: number, id: string) => void;
}

const CanvasColumn: FC<CanvasColumnProps> = ({
  canvasIndex,
  column,
  panels,
  onDeletePanel,
  onAddPanel,
  onRemoveItem,
}) => {
  const { handleResize } = useAppState();
  const handleAddPanel = () => {
    const newPanelId = `${Math.random().toString(16).slice(2)}`;
    onAddPanel(canvasIndex, column, newPanelId);
  };

  return (
    <div className="min-h-[300px] flex flex-col items-center gap-1 flex-1">
      <ResizablePanelGroup direction="vertical" className="min-h-[300px]">
        {panels.map((panel, index) => (
          <ResizablePanel
            key={panel.id}
            id={panel.id}
            order={index}
            defaultSize={100 / panels.length}
            onResize={(size) => handleResize(canvasIndex, panel.id, size)}
            className="p-0.5"
          >
            <div className="relative h-full">
              <DroppableArea id={panel.id} canvasIndex={canvasIndex}>
                {panel.item ? (
                  <SortableItem
                    id={`${panel.id}_${panel.item.id}`}
                    canvasIndex={canvasIndex}
                    item={panel.item}
                  >
                    <div className="bg-slate-300 text-slate-500 rounded h-full w-full flex items-center justify-center z-20">
                      {panel.item.title}
                      <button
                        className="font-bold pl-2 cursor-pointer"
                        onClickCapture={() =>
                          onRemoveItem(canvasIndex, panel.id)
                        }
                      >
                        x
                      </button>
                    </div>
                  </SortableItem>
                ) : (
                  <div className="flex h-full items-center justify-center p-4">
                    <span className="font-semibold">
                      Panel {column}
                      {index}
                    </span>
                  </div>
                )}
              </DroppableArea>

              {panels.length > 1 && (
                <button
                  onClick={() => onDeletePanel(canvasIndex, panel.id, column)}
                  className="absolute top-0 right-0 m-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  <BadgeMinus />
                </button>
              )}
              <div className="absolute bottom-0 right-0 m-2 text-xs text-gray-700">
                {panel.size}%
              </div>
            </div>
            {index < panels.length - 1 && <ResizableHandle withHandle />}
          </ResizablePanel>
        ))}
      </ResizablePanelGroup>
      <button
        onClick={handleAddPanel}
        className="p-4 rounded-full border bg-white"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CanvasColumn;
