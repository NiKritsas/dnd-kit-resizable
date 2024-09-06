import React, { createContext, useContext, useReducer } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";

// Utility to create a new empty panel with a unique id
const createPanel = (id: string, item?: Item): Panel => ({
  id: id,
  size: 50,
  item: item ? item : null,
});

// Utility to create a new canvas with empty panels
const createNewCanvas = (index: number): Canvas => {
  const canvasId = `canvas-${index}`;
  return {
    id: canvasId,
    panels: [
      [createPanel(`panel-1.${index}`), createPanel(`panel-2.${index}`)],
      [
        createPanel(`panel-3.${index}`),
        createPanel(`panel-4.${index}`),
        createPanel(`panel-5.${index}`),
      ],
    ],
  };
};

const createNewCanvasWithItems = (
  index: number,
  items: OutfitItem[]
): Canvas => {
  const canvasId = `canvas-${index}`;
  let maxRowCol1 = 0;
  let maxRowCol2 = 0;

  items.forEach((item) => {
    if (item.position.col === 0 && item.position.row > maxRowCol1) {
      maxRowCol1 = item.position.row;
    }

    if (item.position.col === 1 && item.position.row > maxRowCol2) {
      maxRowCol2 = item.position.row;
    }
  });

  const panelsColumn1: Panel[] = Array.from(
    { length: maxRowCol1 + 1 },
    (_, rowIndex) => createPanel(`panel-${rowIndex}.${index}`)
  );
  const panelsColumn2: Panel[] = Array.from(
    { length: maxRowCol2 + 1 },
    (_, rowIndex) => createPanel(`panel-${rowIndex}.${index}`)
  );

  items.forEach((item) => {
    const { col, row } = item.position;

    if (col === 0 && panelsColumn1[row]) {
      panelsColumn1[row] = {
        ...panelsColumn1[row],
        item: item,
      };
    } else if (col === 1 && panelsColumn2[row]) {
      panelsColumn2[row] = {
        ...panelsColumn2[row],
        item: item,
      };
    } else {
      console.error(`Panel not found for row ${row}, column ${col}`);
    }
  });

  return {
    id: canvasId,
    panels: [panelsColumn1, panelsColumn2],
  };
};
const unflattenArray = (
  flatArray: Panel[],
  columnOneLength: number,
  columnTwoLength: number
) => {
  let columnOne: Panel[] = [];
  let columnTwo: Panel[] = [];

  flatArray.map((item, index) =>
    index < columnOneLength
      ? columnOne.push({ ...item, size: Math.round(100 / columnOneLength) })
      : columnTwo.push({ ...item, size: Math.round(100 / columnTwoLength) })
  );

  return [columnOne, columnTwo];
};

// Panel interface
export interface Panel {
  id: string;
  size: number;
  item?: Item | null;
}

export interface OutfitItem extends Item {
  position: {
    col: number;
    row: number;
  };
}

export type Canvas = {
  id?: string;
  panels: Panel[][];
};

// Initial state
const initialState: Canvas[] = [createNewCanvas(0), createNewCanvas(1)];

// action types
type PanelAction =
  | { type: "ADD_ITEM_TO_CANVASES"; item: any }
  | {
      type: "DROP_ITEM";
      canvasIndx: number;
      overId: UniqueIdentifier;
      item: any;
    }
  | { type: "SWAP_ITEMS"; canvasIndx: number; flatArray: Panel[] }
  | { type: "RESIZE_PANEL"; canvasIndx: number; panelId: string; size: number }
  | { type: "ADD_PANEL"; canvasIndx: number; column: number; id: string }
  | { type: "DELETE_PANEL"; canvasIndx: number; id: string; column: number }
  | { type: "REMOVE_ITEM"; canvasIndx: number; id: string }
  | { type: "ADD_CANVAS"; newCanvas: Canvas }
  | { type: "CREATE_CANVAS_WITH_ITEMS"; newCanvas: Canvas } // New action for creating a canvas with items
  | { type: "DELETE_CANVAS"; canvasIndx: number }
  | { type: "RESET_CANVAS"; canvasIndx: number };

// Reducer function
const stateReducer = (state: Canvas[], action: PanelAction): Canvas[] => {
  const copy = [...state];
  switch (action.type) {
    case "ADD_ITEM_TO_CANVASES":
      console.log(`Add ${action.item.title} to canvases`);
      return state;

    case "DROP_ITEM":
      const id = action.overId.toString().split("_")[0];
      const itemAlreadyDropped = state[action.canvasIndx].panels.some(
        (column) =>
          column.some((panel) => panel.item && panel.item.id === action.item.id)
      );

      if (itemAlreadyDropped) {
        return state;
      }

      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) =>
            panel.id === id ? { ...panel, item: action.item } : panel
          )
        ),
      };

      return copy;

    case "SWAP_ITEMS":
      const newPanels = unflattenArray(
        action.flatArray,
        state[action.canvasIndx].panels[0].length,
        state[action.canvasIndx].panels[1].length
      );
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: newPanels,
      };
      return copy;

    case "RESIZE_PANEL":
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) =>
            panel.id === action.panelId
              ? { ...panel, size: Math.round(action.size) }
              : panel
          )
        ),
      };
      return copy;

    case "ADD_PANEL":
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column, index) =>
          index === action.column
            ? [...column, createPanel(`panel-${action.id}`)]
            : column
        ),
      };
      return copy;

    case "DELETE_PANEL":
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column, index) =>
          index === action.column
            ? column.filter((panel) => panel.id !== action.id)
            : column
        ),
      };
      return copy;

    case "REMOVE_ITEM":
      const activeId = action.id.split("_")[0];
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) =>
            panel.id === activeId ? { ...panel, item: null } : panel
          )
        ),
      };
      return copy;

    case "ADD_CANVAS":
      return [...state, action.newCanvas];

    case "CREATE_CANVAS_WITH_ITEMS":
      return [...state, action.newCanvas];

    case "DELETE_CANVAS":
      return state.filter((_, index) => index !== action.canvasIndx);

    case "RESET_CANVAS":
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) => ({
            ...panel,
            item: null,
          }))
        ),
      };
      return copy;

    default:
      return state;
  }
};

// AppStateContext type
interface AppStateContextType {
  state: Canvas[];
  addItemToCanvases: (item: Item) => void;
  dropItemToPanel: (
    canvasIndx: number,
    overId: UniqueIdentifier,
    item: any
  ) => void;
  swapItemsInPanel: (canvasIndx: number, flatArray: Panel[]) => void;
  removeItemFromPanel: (canvasIndx: number, id: string) => void;
  handleResize: (canvasIndx: number, panelId: string, size: number) => void;
  addPanel: (canvasIndx: number, column: number, id: string) => void;
  deletePanel: (canvasIndx: number, id: string, column: number) => void;
  addCanvas: () => void;
  createCanvasWithItems: (items: OutfitItem[]) => void;
  deleteCanvas: (canvasIndx: number) => void;
  resetCanvas: (canvasIndx: number) => void;
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

// useAppState hook
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

// AppStateProvider component
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addItemToCanvases = (item: any) => {
    dispatch({ type: "ADD_ITEM_TO_CANVASES", item });
  };

  const dropItemToPanel = (
    canvasIndx: number,
    overId: UniqueIdentifier,
    item: any
  ) => {
    dispatch({ type: "DROP_ITEM", canvasIndx, overId, item });
  };

  const swapItemsInPanel = (canvasIndx: number, flatArray: Panel[]) => {
    dispatch({ type: "SWAP_ITEMS", canvasIndx, flatArray });
  };

  const handleResize = (canvasIndx: number, panelId: string, size: number) => {
    dispatch({ type: "RESIZE_PANEL", canvasIndx, panelId, size });
  };

  const addPanel = (canvasIndx: number, column: number, id: string) => {
    dispatch({ type: "ADD_PANEL", canvasIndx, column, id });
  };

  const deletePanel = (canvasIndx: number, id: string, column: number) => {
    dispatch({ type: "DELETE_PANEL", canvasIndx, id, column });
  };

  const removeItemFromPanel = (canvasIndx: number, id: string) => {
    dispatch({ type: "REMOVE_ITEM", canvasIndx, id });
  };

  const addCanvas = () => {
    const newCanvas = createNewCanvas(state.length + 1);
    dispatch({ type: "ADD_CANVAS", newCanvas });
  };

  const createCanvasWithItems = (items: OutfitItem[]) => {
    const newCanvas = createNewCanvasWithItems(state.length, items);
    dispatch({ type: "CREATE_CANVAS_WITH_ITEMS", newCanvas });
  };

  const deleteCanvas = (canvasIndx: number) => {
    dispatch({ type: "DELETE_CANVAS", canvasIndx });
  };

  const resetCanvas = (canvasIndx: number) => {
    dispatch({ type: "RESET_CANVAS", canvasIndx });
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        addItemToCanvases,
        dropItemToPanel,
        swapItemsInPanel,
        removeItemFromPanel,
        handleResize,
        addPanel,
        deletePanel,
        addCanvas,
        createCanvasWithItems,
        deleteCanvas,
        resetCanvas,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
