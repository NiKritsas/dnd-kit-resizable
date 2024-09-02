import React, { createContext, useContext, useState, useCallback } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";

export interface Panel {
  id: string;
  size: number;
  item?: Item;
}

interface AppStateContextType {
  panels: { id: string; size: number }[];
  droppedItems: { [key: string]: UniqueIdentifier | null };
  dropItemToPanel: (
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    item: any
  ) => void;
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

  const [panels, setPanels] = useState<Panel[]>([
    { id: "panel1", size: 50 },
    { id: "panel2", size: 50 },
  ]);

  const [lastPanelId, setLastPanelId] = useState<number>(2);

  const dropItemToPanel = (
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    item: any
  ) => {
    console.log(item);
    setDroppedItems((prev) => ({
      ...prev,
      [overId]: activeId,
    }));
    setPanels((prev) => {
      let newPanels: Panel[] = [];
      prev.map((panel) => {
        if (panel.id === overId) {
          panel.item = item;
        }

        newPanels.push(panel);
      });

      return newPanels;
    });
  };

  // const handleGetSize = (panelId: string) => {
  //   const panel = panelId;
  //   if (panel) {
  //     const size = panel.getSize();
  //     console.log('Panel Size:', size);
  //   }
  // };

  const handleResize = useCallback((panelId: string, size: number) => {
    // console.log(`Resizing panel ${panelId} to size: ${size}`);
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
        dropItemToPanel,
        handleResize,
        addPanel,
        deletePanel,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
