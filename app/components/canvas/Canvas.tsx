import React, { useState } from "react";
import { useAppState } from "../AppStateContext";
import CanvasColumn from "./CanvasColumn";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";
import { RefreshCwIcon, XIcon, EyeIcon } from "lucide-react";
import { PreviewModal } from "../preview/CanvasPreview";

interface Props {
  index: number;
}

const Canvas: React.FC<Props> = ({ index }) => {
  const { state, deleteCanvas, resetCanvas } = useAppState();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const panels = state[index].panels;

  const hasItems = panels.some((column) =>
    column.some((panel) => panel.item !== null)
  );

  return (
    <div className="relative bg-white shadow-md p-4 rounded-md">
      <SortableContext
        id={`${index}`}
        items={panels.flatMap((column) =>
          column.map((panel) => `panel-item-${panel.item?.id}`)
        )}
        strategy={rectSwappingStrategy}
      >
        <div className="flex w-[400px]">
          <CanvasColumn canvasIndex={index} column={0} panels={panels[0]} />
          <CanvasColumn canvasIndex={index} column={1} panels={panels[1]} />
        </div>
      </SortableContext>
      <button
        onClick={() => deleteCanvas(index)}
        className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
      >
        <XIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => resetCanvas(index)}
        className={`absolute -bottom-4 -left-4 rounded-full w-8 h-8 flex items-center justify-center transition ${
          hasItems
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!hasItems}
      >
        <RefreshCwIcon className="h-5 w-5" />
      </button>
      {/* Preview button */}
      <button
        onClick={() => setIsPreviewOpen(true)}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 transition"
      >
        <EyeIcon className="h-5 w-5" />
      </button>
      {/* Render the preview modal if open */}
      {isPreviewOpen && (
        <PreviewModal index={index} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
};

export default Canvas;
