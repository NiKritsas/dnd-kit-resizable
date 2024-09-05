import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";

// Utility to create a new empty panel with a unique id
const createEmptyPanel = (id: string): Panel => ({
  id: id,
  size: 50,
  item: null,
});

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

export type Canvas = {
  id?: string;
  panels: Panel[][];
};

// Initial state
const initialState: Canvas[] = [
  {
    panels: [
      [createEmptyPanel("panel-1"), createEmptyPanel("panel-2")],
      [
        createEmptyPanel("panel-3"),
        createEmptyPanel("panel-4"),
        createEmptyPanel("panel-5"),
      ],
    ],
  },
  {
    panels: [
      [createEmptyPanel("panel-1.1"), createEmptyPanel("panel-1.2")],
      [
        createEmptyPanel("panel-1.3"),
        createEmptyPanel("panel-1.4"),
        createEmptyPanel("panel-1.5"),
      ],
    ],
  },
];

// action types
type PanelAction =
  | {
      type: "DROP_ITEM";
      canvasIndx: number;
      overId: UniqueIdentifier;
      item: any;
    }
  | {
      type: "SWAP_ITEMS";
      canvasIndx: number;
      flatArray: Panel[];
    }
  | { type: "RESIZE_PANEL"; canvasIndx: number; panelId: string; size: number }
  | { type: "ADD_PANEL"; canvasIndx: number; column: number; id: string }
  | { type: "DELETE_PANEL"; canvasIndx: number; id: string; column: number }
  | { type: "REMOVE_ITEM"; canvasIndx: number; id: string };

// Reducer function
const stateReducer = (state: Canvas[], action: PanelAction): Canvas[] => {
  const copy = [...state];
  switch (action.type) {
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
            ? [...column, createEmptyPanel(`panel-${action.id}`)]
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
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) =>
            panel.id === action.id ? { ...panel, item: null } : panel
          )
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
  // panels: Panel[][];
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
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

//use the AppStateContext
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

// AppStateProvider now :
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  // const [panels, dispatch] = useReducer(panelsReducer, initialPanelsState);

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

  return (
    <AppStateContext.Provider
      value={{
        // panels,
        state,
        dropItemToPanel,
        swapItemsInPanel,
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
