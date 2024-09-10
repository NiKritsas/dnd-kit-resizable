import { BadgeMinus } from "lucide-react";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Panel } from "@/lib/types";
import { useAppState } from "../AppStateContext";
import DroppableArea from "../DroppableArea";
import SortableItem from "../SortableItem";

interface CanvasPanelProps {
  panel: Panel;
  canvasIndex: number;
  panelIndex: number;
  column: number;
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({
  panel,
  panelIndex,
  canvasIndex,
  column,
}) => {
  const { state, resizePanel, removeItemFromPanel, deletePanel } =
    useAppState();
  const panels = state[canvasIndex].panels[column];

  const handleResize = (size: number) => {
    resizePanel(canvasIndex, panel.id, size);
  };

  return (
    <ResizablePanel
      key={panel.id}
      id={panel.id}
      order={panelIndex}
      defaultSize={panel.size}
      onResize={handleResize}
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
                    removeItemFromPanel(canvasIndex, panel.id)
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
                {panelIndex}
              </span>
            </div>
          )}
        </DroppableArea>

        {panels.length > 1 && (
          <button
            onClick={() => deletePanel(canvasIndex, panel.id, column)}
            className="absolute top-0 right-0 m-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            <BadgeMinus />
          </button>
        )}
        <div className="absolute bottom-0 right-0 m-2 text-xs text-gray-700">
          {Math.round(panel.size)}%
        </div>
      </div>
      {panelIndex < panels.length - 1 && <ResizableHandle withHandle />}
    </ResizablePanel>
  );
};

export default CanvasPanel;
