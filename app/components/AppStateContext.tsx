import React, { createContext, useContext, useReducer } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Canvas, Item, OutfitItem, Panel } from "@/lib/types";
import {
  checkIfItemIsInCanvas,
  createNewCanvasWithItems,
  createNewEmptyCanvas,
  createPanel,
  findFirstEmptyPanelOfCanvas,
  resizeColumnPanels,
  unflattenArray,
} from "@/lib/helpers";

// Initial state
const initialState: Canvas[] = [
  createNewEmptyCanvas(Math.random().toString(16).slice(2)),
];

// action types
type StateAction =
  | { type: "ADD_ITEM_TO_CANVASES"; item: any }
  | {
      type: "DROP_ITEM";
      canvasIndx: number;
      overId: UniqueIdentifier;
      item: any;
    }
  | { type: "SWAP_ITEMS"; canvasIndx: number; flatArray: Panel[] }
  | { type: "REMOVE_ITEM"; canvasIndx: number; id: string }
  | { type: "RESIZE_PANEL"; canvasIndx: number; panelId: string; size: number }
  | { type: "ADD_PANEL"; canvasIndx: number; column: number; id: string }
  | { type: "DELETE_PANEL"; canvasIndx: number; id: string; column: number }
  | { type: "ADD_CANVAS"; newCanvas: Canvas }
  | { type: "CREATE_CANVAS_WITH_ITEMS"; newCanvas: Canvas } // New action for creating a canvas with items
  | { type: "DELETE_CANVAS"; canvasIndx: number }
  | { type: "RESET_CANVAS"; canvasIndx: number };

// Reducer function
const stateReducer = (state: Canvas[], action: StateAction): Canvas[] => {
  const copy = [...state];
  switch (action.type) {
    case "ADD_ITEM_TO_CANVASES":
      // find the first empty panel of each canvas
      let emptyPanelIds: { canvasIndex: number; panelId: string }[] = [];
      copy.map((canvas, index) => {
        const firstEmptyPanel = findFirstEmptyPanelOfCanvas(canvas.panels);
        if (firstEmptyPanel)
          emptyPanelIds.push({ canvasIndex: index, panelId: firstEmptyPanel });
      });

      // add the item in all found empty panels
      emptyPanelIds.map((el) => {
        const itemAlreadyDropped = checkIfItemIsInCanvas(
          state[el.canvasIndex].panels,
          action.item
        );
        if (!itemAlreadyDropped) {
          copy[el.canvasIndex] = {
            ...copy[el.canvasIndex],
            panels: copy[el.canvasIndex].panels.map((column) =>
              column.map((panel) =>
                panel.id === el.panelId
                  ? { ...panel, item: action.item }
                  : panel
              )
            ),
          };
        }
      });

      return copy;

    case "DROP_ITEM":
      const droppedId = action.overId.toString().split("_")[0];
      const itemAlreadyDropped = checkIfItemIsInCanvas(
        state[action.canvasIndx].panels,
        action.item
      );

      if (itemAlreadyDropped) {
        return state;
      }

      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) =>
            panel.id === droppedId ? { ...panel, item: action.item } : panel
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

    case "RESIZE_PANEL":
      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column) =>
          column.map((panel) =>
            panel.id === action.panelId
              ? { ...panel, size: action.size }
              : panel
          )
        ),
      };
      return copy;

    case "ADD_PANEL": {
      const currentColumnPanels = copy[action.canvasIndx].panels[action.column];
      let newTargetColumnPanels = [
        ...currentColumnPanels,
        createPanel(`panel-${action.id}`, 100 / currentColumnPanels.length),
      ];

      newTargetColumnPanels = resizeColumnPanels(newTargetColumnPanels);

      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column, index) =>
          index === action.column ? newTargetColumnPanels : column
        ),
      };
      return copy;
    }

    case "DELETE_PANEL":
      let newTargetColumnPanels = copy[action.canvasIndx].panels[
        action.column
      ].filter((panel) => panel.id !== action.id);

      newTargetColumnPanels = resizeColumnPanels(newTargetColumnPanels);

      copy[action.canvasIndx] = {
        ...copy[action.canvasIndx],
        panels: copy[action.canvasIndx].panels.map((column, index) =>
          index === action.column ? newTargetColumnPanels : column
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
  resizePanel: (canvasIndx: number, panelId: string, size: number) => void;
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

  const resizePanel = (canvasIndx: number, panelId: string, size: number) => {
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
    const newCanvas = createNewEmptyCanvas(Math.random().toString(16).slice(2));
    dispatch({ type: "ADD_CANVAS", newCanvas });
  };

  const createCanvasWithItems = (items: OutfitItem[]) => {
    const newCanvas = createNewCanvasWithItems(
      Math.random().toString(16).slice(2),
      items
    );
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
        resizePanel,
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
