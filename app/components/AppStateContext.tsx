import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Item } from "./Resizable";

// Panel interface
export interface Panel {
  id: string;
  size: number;
  item?: Item | null;
  position: {
    column: number;
    row: number;
  };
}

// Initial state
const initialPanelsState: Panel[][] = [
  [
    {
      id: Math.random().toString(16).slice(2),
      size: 50,
      item: null,
      position: { column: 1, row: 0 },
    },
    {
      id: Math.random().toString(16).slice(2),
      size: 50,
      item: null,
      position: { column: 1, row: 1 },
    },
  ],
  [
    {
      id: Math.random().toString(16).slice(2),
      size: 50,
      item: null,
      position: { column: 2, row: 0 },
    },
  ],
];

// action types
type PanelAction =
  | { type: "DROP_ITEM"; overId: UniqueIdentifier; item: any }
  | { type: "RESIZE_PANEL"; panelId: string; size: number }
  | { type: "ADD_PANEL_TO_FIRST_ARRAY"; column: number }
  | { type: "ADD_PANEL_TO_SECOND_ARRAY"; column: number }
  | { type: "DELETE_PANEL_FROM_FIRST_ARRAY"; id: string; column: number }
  | { type: "DELETE_PANEL_FROM_SECOND_ARRAY"; id: string; column: number }
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
    case "ADD_PANEL_TO_FIRST_ARRAY":
      return [
        [
          ...state[0],
          {
            id: Math.random().toString(16).slice(2),
            size: 50,
            item: null,
            position: { column: action.column, row: state[0].length },
          },
        ],
        state[1],
      ];
    case "ADD_PANEL_TO_SECOND_ARRAY":
      return [
        state[0],
        [
          ...state[1],
          {
            id: Math.random().toString(16).slice(2),
            size: 50,
            item: null,
            position: { column: action.column, row: state[1].length },
          },
        ],
      ];
    case "DELETE_PANEL_FROM_FIRST_ARRAY":
      return [
        state[0]
          .filter((panel) => panel.id !== action.id)
          .map((panel, index) => ({
            ...panel,
            position: { column: action.column, row: index },
          })),
        state[1],
      ];
    case "DELETE_PANEL_FROM_SECOND_ARRAY":
      return [
        state[0],
        state[1]
          .filter((panel) => panel.id !== action.id)
          .map((panel, index) => ({
            ...panel,
            position: { column: action.column, row: index },
          })),
      ];
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
  addPanelToFirstArray: (column: number) => void;
  addPanelToSecondArray: (column: number) => void;
  deletePanelFromFirstArray: (id: string, column: number) => void;
  deletePanelFromSecondArray: (id: string, column: number) => void;
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

  const addPanelToFirstArray = (column: number) => {
    dispatch({ type: "ADD_PANEL_TO_FIRST_ARRAY", column });
  };

  const addPanelToSecondArray = (column: number) => {
    dispatch({ type: "ADD_PANEL_TO_SECOND_ARRAY", column });
  };

  const deletePanelFromFirstArray = (id: string, column: number) => {
    dispatch({ type: "DELETE_PANEL_FROM_FIRST_ARRAY", id, column });
  };

  const deletePanelFromSecondArray = (id: string, column: number) => {
    dispatch({ type: "DELETE_PANEL_FROM_SECOND_ARRAY", id, column });
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
        addPanelToFirstArray,
        addPanelToSecondArray,
        deletePanelFromFirstArray,
        deletePanelFromSecondArray,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
