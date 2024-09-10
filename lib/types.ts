export interface Item {
  id: string | number;
  title: string;
}

export interface OutfitItem extends Item {
  col: number;
  row: number;
  heightPercentage: number;
}

export interface Panel {
  id: string;
  size: number;
  item?: Item | null;
  col: number;
  row: number;
}

export interface Canvas {
  id?: string;
  panels: Panel[][];
}
