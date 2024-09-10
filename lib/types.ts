export interface Item {
  id: string | number;
  title: string;
  isactive: boolean;
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
}

export interface Canvas {
  id?: string;
  panels: Panel[][];
}
