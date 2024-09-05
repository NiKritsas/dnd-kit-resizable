import React, { useId } from "react";
import { useAppState } from "../AppStateContext";
import CanvasColumn from "./CanvasColumn";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

interface Props {
  index: number;
}

const Canvas: React.FC<Props> = ({ index }) => {
  const { state, addPanel, deletePanel, removeItemFromPanel } = useAppState();

  const panels = state[index].panels;
  // console.log(`canvas ${index}`);
  // console.log(panels);

  return (
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
    </SortableContext>
  );
};

export default Canvas;
