import { Canvas, Item, Panel } from "./types";

export const unflattenArray = (
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

export const findFirstEmptyPanelOfCanvas = (panels: Panel[][]) => {
  let emptyPanelId: string | null = null;

  panels.some((column) => {
    return column.some((panel) => {
      if (panel.item === null) {
        emptyPanelId = panel.id;
        return true;
      } else {
        return false;
      }
    });
  });

  return emptyPanelId;
};

export const checkIfItemIsInCanvas = (panels: Panel[][], item: Item) => {
  const result = panels.some((column) =>
    column.some((panel) => panel.item && panel.item.id === item.id)
  );
  return result;
};

// Utility to create a new empty panel with a unique id
export const createPanel = (
  id: string,
  item?: Item | null,
  size?: number
): Panel => ({
  id: id,
  size: size ? size : 50,
  item: item ? item : null,
});

// Utility to create a new canvas with empty panels
export const createNewEmptyCanvas = (canvasId: string): Canvas => {
  const id = `canvas-${canvasId}`;
  return {
    id: id,
    panels: [
      [
        createPanel(`panel-1.${id}`, null, 50),
        createPanel(`panel-2.${id}`, null, 50),
      ],
      [
        createPanel(`panel-3.${id}`, null, 100 / 3),
        createPanel(`panel-4.${id}`, null, 100 / 3),
        createPanel(`panel-5.${id}`, null, 100 / 3),
      ],
    ],
  };
};
