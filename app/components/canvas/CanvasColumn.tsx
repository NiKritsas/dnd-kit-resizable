import { FC, useEffect, useId, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useAppState } from "../AppStateContext";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { Panel } from "@/lib/types";
import CanvasPanel from "./CanvasPanel";

interface CanvasColumnProps {
  canvasIndex: number;
  column: number;
  panels: Panel[];
}

const CanvasColumn: FC<CanvasColumnProps> = ({
  canvasIndex,
  column,
  panels,
}) => {
  const startingNewPanelId = useId();
  const [randomNewPanelId, setRandomNewPanelId] = useState(startingNewPanelId);

  const { state, addPanel } = useAppState();

  const handleAddPanel = () => {
    const newPanelId = `${randomNewPanelId}.${state[canvasIndex].id}`;
    addPanel(canvasIndex, column, newPanelId);
  };

  // resets the random new panel id when panels are added or removed to avoid same keys
  useEffect(() => {
    setRandomNewPanelId(
      `${Math.random().toString(16).slice(2)}${panels.length}`
    );
  }, [panels]);

  return (
    <div className="min-h-[300px] flex flex-col items-center gap-1 flex-1">
      <ResizablePanelGroup direction="vertical" className="min-h-[300px]">
        {panels.map((panel, index) => (
          <CanvasPanel
            key={panel.id}
            panel={panel}
            panelIndex={index}
            canvasIndex={canvasIndex}
            column={column}
          />
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
