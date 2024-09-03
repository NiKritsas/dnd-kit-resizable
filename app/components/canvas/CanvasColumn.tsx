import { FC, useId } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Panel, useAppState } from "../AppStateContext";
import DroppableArea from "../DroppableArea";
import { BadgeMinus, PlusIcon } from "lucide-react";

interface CanvasColumnProps {
  column: number;
  panels: Panel[];
  onAddPanel: (column: number, id: string) => void;
  onDeletePanel: (id: string, column: number) => void;
  onRemoveItem: (id: string) => void;
}

const CanvasColumn: FC<CanvasColumnProps> = ({
  column,
  panels,
  onDeletePanel,
  onAddPanel,
  onRemoveItem,
}) => {
  const { handleResize } = useAppState();
  const handleAddPanel = () => {
    const newPanelId = `${Math.random().toString(16).slice(2)}`;
    onAddPanel(column, newPanelId);
  };

  return (
    <div className="min-h-[300px] flex flex-col items-center gap-1 flex-1">
      <ResizablePanelGroup direction="vertical" className="min-h-[300px]">
        {panels.map((panel, index) => (
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
                      onClick={() => onRemoveItem(panel.id)}
                    >
                      x
                    </span>
                  </div>
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
                  onClick={() => onDeletePanel(panel.id, column)}
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
