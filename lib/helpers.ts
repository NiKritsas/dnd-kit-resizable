import { Canvas, Item, OutfitItem, Panel } from "./types";

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
  size: number,
  item?: Item | null
): Panel => ({
  id: id,
  size: size,
  item: item ? item : null,
});

// Utility to create a new canvas with empty panels
export const createNewEmptyCanvas = (canvasId: string): Canvas => {
  const id = `canvas-${canvasId}`;
  return {
    id: id,
    panels: [
      [createPanel(`panel-1.${id}`, 50), createPanel(`panel-2.${id}`, 50)],
      [
        createPanel(`panel-3.${id}`, 100 / 3),
        createPanel(`panel-4.${id}`, 100 / 3),
        createPanel(`panel-5.${id}`, 100 / 3),
      ],
    ],
  };
};

export const createNewCanvasWithItems = (
  canvasId: string,
  items: OutfitItem[]
): Canvas => {
  let maxRowCol1 = 0;
  let maxRowCol2 = 0;
  let unusedSizeOfCol1 = 100;
  let unusedSizeOfCol2 = 100;

  // find max rows for each column and remove their size from the unused
  items.forEach((item) => {
    if (item.col === 0 && item.row > maxRowCol1) {
      maxRowCol1 = item.row;
    }

    if (item.col === 1 && item.row > maxRowCol2) {
      maxRowCol2 = item.row;
    }
  });

  // find unused size for each column
  items.forEach((item) => {
    if (item.col === 0) {
      unusedSizeOfCol1 -= item.heightPercentage;
    }
    if (item.col === 1) {
      unusedSizeOfCol2 -= item.heightPercentage;
    }
  });

  // create empty panels for each column based on the max rows
  let panelsColumn1: Panel[] = Array.from(
    { length: maxRowCol1 + 1 },
    (_, rowIndex) =>
      createPanel(`panel-${rowIndex}1.${canvasId}`, 100 / (maxRowCol1 + 1))
  );
  let panelsColumn2: Panel[] = Array.from(
    { length: maxRowCol2 + 1 },
    (_, rowIndex) =>
      createPanel(`panel-${rowIndex}2.${canvasId}`, 100 / (maxRowCol2 + 1))
  );

  // map items and add them to their designated panel
  items.forEach((item) => {
    const { col, row, heightPercentage } = item;

    if (col === 0 && panelsColumn1[row]) {
      panelsColumn1[row] = {
        ...panelsColumn1[row],
        item: item,
        size: heightPercentage,
      };
    } else if (col === 1 && panelsColumn2[row]) {
      panelsColumn2[row] = {
        ...panelsColumn2[row],
        item: item,
        size: heightPercentage,
      };
    } else {
      console.error(`Panel not found for row ${row}, column ${col}`);
    }
  });

  // find count of empty panels for each column
  let emptyPanelsOfColumn1 = panelsColumn1.filter(
    (panel) => !panel.item
  ).length;
  let emptyPanelsOfColumn2 = panelsColumn2.filter(
    (panel) => !panel.item
  ).length;

  // apply height percentage for empty panels of each column
  panelsColumn1 = panelsColumn1.map((panel, index) => {
    if (!panel.item) {
      const size =
        emptyPanelsOfColumn1 > 0 ? unusedSizeOfCol1 / emptyPanelsOfColumn1 : 0;
      console.log(`Panel ${index} is empty, assigning size: ${size}`);
      return {
        ...panel,
        size: size,
      };
    }
    return panel;
  });

  panelsColumn2 = panelsColumn2.map((panel, index) => {
    if (!panel.item) {
      const size =
        emptyPanelsOfColumn2 > 0 ? unusedSizeOfCol2 / emptyPanelsOfColumn2 : 0;
      console.log(`Panel ${index} is empty, assigning size: ${size}`);
      return {
        ...panel,
        size: size,
      };
    }
    return panel;
  });

  // Ensure the total size of each column is equal to 100%
  const totalSizeCol1 = panelsColumn1.reduce(
    (acc, panel) => acc + panel.size,
    0
  );
  const totalSizeCol2 = panelsColumn2.reduce(
    (acc, panel) => acc + panel.size,
    0
  );

  if (totalSizeCol1 !== 100) {
    console.warn(
      `Column 1 total size is ${totalSizeCol1}%. Adjusting last panel to fit.`
    );
    panelsColumn1[panelsColumn1.length - 1].size += 100 - totalSizeCol1;
  }

  if (totalSizeCol2 !== 100) {
    console.warn(
      `Column 2 total size is ${totalSizeCol2}%. Adjusting last panel to fit.`
    );
    panelsColumn2[panelsColumn2.length - 1].size += 100 - totalSizeCol2;
  }

  // return the new canvas
  return {
    id: canvasId,
    panels: [panelsColumn1, panelsColumn2],
  };
};

export const resizeColumnPanels = (panels: Panel[]) => {
  let resizedPanels = panels;

  const totalSizeOfNewTargetColumn = resizedPanels.reduce(
    (acc, panel) => acc + panel.size,
    0
  );

  if (totalSizeOfNewTargetColumn !== 100) {
    resizedPanels = resizedPanels.map((panel) => ({
      ...panel,
      size: 100 / resizedPanels.length,
    }));
  }

  return resizedPanels;
};
