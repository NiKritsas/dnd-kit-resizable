import React from "react";
import { useAppState } from "../AppStateContext";
import CanvasColumn from "./CanvasColumn";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

interface Props {
  index: number;
}

const Canvas: React.FC<Props> = ({ index }) => {
  const {
    state,
    addPanel,
    deletePanel,
    removeItemFromPanel,
    deleteCanvas,
    resetCanvas,
  } = useAppState();

  const panels = state[index].panels;

  // Utility function to check if the canvas has any items
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
          <CanvasColumn
            canvasIndex={index}
            column={0}
            panels={panels[0]}
            onAddPanel={addPanel}
            onDeletePanel={deletePanel}
            onRemoveItem={removeItemFromPanel}
          />
          <CanvasColumn
            canvasIndex={index}
            column={1}
            panels={panels[1]}
            onAddPanel={addPanel}
            onDeletePanel={deletePanel}
            onRemoveItem={removeItemFromPanel}
          />
        </div>

        <button
          onClick={() => deleteCanvas(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
        >
          X
        </button>
        <button
          onClick={() => resetCanvas(index)}
          className={`absolute bottom-2 left-2 rounded-full px-3 py-1 transition ${
            hasItems
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!hasItems}
        >
          Reset
        </button>
      </SortableContext>
    </div>
  );
};

export default Canvas;
