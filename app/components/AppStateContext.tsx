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

// Panel interface
export interface Panel {
  id: string;
  size: number;
  item?: Item | null;
}

// Initial state
const initialPanelsState: Panel[][] = [
  [createEmptyPanel("1"), createEmptyPanel("2")],
  [createEmptyPanel("3"), createEmptyPanel("4"), createEmptyPanel("5")],
];

// action types
type PanelAction =
  | { type: "DROP_ITEM"; overId: UniqueIdentifier; item: any }
  | { type: "RESIZE_PANEL"; panelId: string; size: number }
  | { type: "ADD_PANEL"; column: number; id: string }
  | { type: "DELETE_PANEL"; id: string; column: number }
  | { type: "REMOVE_ITEM"; id: string };

// Reducer function
const panelsReducer = (state: Panel[][], action: PanelAction): Panel[][] => {
  switch (action.type) {
    case "DROP_ITEM":
      const itemAlreadyDropped = state.some((column) =>
        column.some((panel) => panel.item && panel.item.id === action.item.id)
      );

      if (itemAlreadyDropped) {
        return state;
      }
      return state.map((column) =>
        column.map((panel) =>
          panel.id === action.overId ? { ...panel, item: action.item } : panel
        )
      );
    case "RESIZE_PANEL":
      return state.map((column) =>
        column.map((panel) =>
          panel.id === action.panelId
            ? { ...panel, size: Math.round(action.size) }
            : panel
        )
      );
    case "ADD_PANEL":
      return state.map((column, index) =>
        index === action.column
          ? [...column, createEmptyPanel(action.id)]
          : column
      );
    case "DELETE_PANEL":
      return state.map((column, index) =>
        index === action.column
          ? column.filter((panel) => panel.id !== action.id)
          : column
      );
    case "REMOVE_ITEM":
      return state.map((column) =>
        column.map((panel) =>
          panel.id === action.id ? { ...panel, item: null } : panel
        )
      );
    default:
      return state;
  }
};

// AppStateContext type
interface AppStateContextType {
  panels: Panel[][];
  dropItemToPanel: (overId: UniqueIdentifier, item: any) => void;
  removeItemFromPanel: (id: string) => void;
  handleResize: (panelId: string, size: number) => void;
  addPanel: (column: number, id: string) => void;
  deletePanel: (id: string, column: number) => void;
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
  const [panels, dispatch] = useReducer(panelsReducer, initialPanelsState);

  const dropItemToPanel = (overId: UniqueIdentifier, item: any) => {
    dispatch({ type: "DROP_ITEM", overId, item });
  };

  const handleResize = useCallback((panelId: string, size: number) => {
    dispatch({ type: "RESIZE_PANEL", panelId, size });
  }, []);

  const addPanel = (column: number, id: string) => {
    dispatch({ type: "ADD_PANEL", column, id });
  };

  const deletePanel = (id: string, column: number) => {
    dispatch({ type: "DELETE_PANEL", id, column });
  };

  const removeItemFromPanel = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
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
