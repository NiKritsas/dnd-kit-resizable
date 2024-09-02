import React, { createContext, useContext, useState, useCallback } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";

export interface Panel {
  id: string;
  size: number;
  item?: Item | null;
  position: {
    column: number;
    row: number;
  };
}

const COLUMN_ONE_PANELS = [
  { id: "panel1", size: 50, item: null, position: { column: 1, row: 0 } },
  { id: "panel2", size: 50, item: null, position: { column: 1, row: 1 } },
];

interface AppStateContextType {
  panels: Panel[];
  dropItemToPanel: (overId: UniqueIdentifier, item: any) => void;
  removeItemFromPanel: (id: string) => void;
  handleResize: (panelId: string, size: number) => void;
  addPanel: (column: number) => void;
  deletePanel: (id: string, column: number) => void;
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
  const [panels, setPanels] = useState<Panel[]>(COLUMN_ONE_PANELS);

  const [lastPanelId, setLastPanelId] = useState<number>(2);

  const dropItemToPanel = (overId: UniqueIdentifier, item: any) => {
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

  // add panel to column
  const addPanel = (column: number) => {
    const newPanelId = `panel${lastPanelId + 1}`;
    setPanels((prevPanels) => [
      ...prevPanels,
      {
        id: newPanelId,
        size: 50,
        item: null,
        position: { column: column, row: prevPanels.length },
      },
    ]);
    setLastPanelId(lastPanelId + 1);
  };

  // delete panel from column
  const deletePanel = (id: string, column: number) => {
    setPanels((prevPanels) => {
      let newPanels = prevPanels
        .filter((panel) => panel.id !== id)
        .map((p, index) => ({
          ...p,
          position: { column: column, row: index },
        }));
      return newPanels;
    });
  };

  // remove item from panel
  const removeItemFromPanel = (id: string) => {
    setPanels((prevPanels) =>
      prevPanels.map((panel) =>
        panel.id === id ? { ...panel, item: null } : { ...panel }
      )
    );
  };

  return (
    <AppStateContext.Provider
      value={{
        panels,
        dropItemToPanel,
        removeItemFromPanel,
        handleResize,
        addPanel,
        deletePanel,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
