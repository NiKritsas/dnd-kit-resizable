import React, { createContext, useContext, useState, useCallback } from "react";
import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";

interface AppStateContextType {
  panels: { id: string; size: number }[];
  droppedItems: { [key: string]: UniqueIdentifier | null };
  handleDragEnd: (event: DragEndEvent) => void;
  handleResize: (panelId: string, size: number) => void;
  addPanel: () => void;
  deletePanel: (id: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [droppedItems, setDroppedItems] = useState<{
    [key: string]: UniqueIdentifier | null;
  }>({});
  const [panels, setPanels] = useState<{ id: string; size: number }[]>([
    { id: "panel1", size: 50 },
    { id: "panel2", size: 50 },
  ]);

  const [lastPanelId, setLastPanelId] = useState<number>(2);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      setDroppedItems((prev) => ({
        ...prev,
        [over.id]: active.id,
      }));
    }
  };

  // const handleGetSize = (panelId: string) => {
  //   const panel = panelId;
  //   if (panel) {
  //     const size = panel.getSize();
  //     console.log('Panel Size:', size);
  //   }
  // };

  const handleResize = useCallback((panelId: string, size: number) => {
    console.log(`Resizing panel ${panelId} to size: ${size}`);
    setPanels((prevPanels) =>
      prevPanels.map((panel) =>
        panel.id === panelId ? { ...panel, size: Math.round(size) } : panel
      )
    );
  }, []);

  const addPanel = () => {
    const newPanelId = `panel${lastPanelId + 1}`;
    setPanels((prevPanels) => [...prevPanels, { id: newPanelId, size: 50 }]);
    setLastPanelId(lastPanelId + 1);
  };

  const deletePanel = (id: string) => {
    setPanels((prevPanels) => prevPanels.filter((panel) => panel.id !== id));

    setDroppedItems((prevDroppedItems) => {
      const { [id]: _, ...remainingDroppedItems } = prevDroppedItems;
      return remainingDroppedItems;
    });
  };

  return (
    <AppStateContext.Provider
      value={{
        panels,
        droppedItems,
        handleDragEnd,
        handleResize,
        addPanel,
        deletePanel,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
