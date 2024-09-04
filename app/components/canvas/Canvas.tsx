import React, { useId } from "react";
import { useAppState } from "../AppStateContext";
import CanvasColumn from "./CanvasColumn";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

export function Canvas() {
  const { panels, addPanel, deletePanel, removeItemFromPanel } = useAppState();

  return (
    <SortableContext
      items={panels.flatMap((column) =>
        column.map((panel) => `panel-item-${panel.item?.id}`)
      )}
      strategy={rectSwappingStrategy}
    >
      <div className="flex w-[400px]">
        {/* ResizablePanelGroup for the First Array */}
        <CanvasColumn
          column={0}
          panels={panels[0]}
          onAddPanel={addPanel}
          onDeletePanel={deletePanel}
          onRemoveItem={removeItemFromPanel}
        />

        {/* ResizablePanelGroup for the Second Array */}
        <CanvasColumn
          column={1}
          panels={panels[1]}
          onAddPanel={addPanel}
          onDeletePanel={deletePanel}
          onRemoveItem={removeItemFromPanel}
        />
      </div>
    </SortableContext>
  );
}
