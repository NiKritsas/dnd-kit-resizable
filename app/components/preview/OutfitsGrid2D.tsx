import { Item, SlotItem, Outfit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ITEMS } from "../Resizable";

const DB_OUTFITS: {
  outfitId: number;
  items: {
    item: Item | null;
    slot: { col: number | null; row: number | null; height: number | null };
  }[][];
}[] = [
  {
    outfitId: 1,
    items: [
      [
        {
          item: ITEMS[10],
          slot: {
            col: 0,
            row: 0,
            height: 100,
          },
        },
      ],
      [
        {
          item: ITEMS[9],
          slot: {
            col: 1,
            row: 0,
            height: 30,
          },
        },
        {
          item: null,
          slot: {
            col: 1,
            row: 1,
            height: 40,
          },
        },
        {
          item: ITEMS[20],
          slot: {
            col: 1,
            row: 2,
            height: 30,
          },
        },
      ],
    ],
  },
  {
    outfitId: 2,
    items: [
      [
        {
          item: ITEMS[10],
          slot: {
            col: 0,
            row: 0,
            height: 30,
          },
        },
        {
          item: ITEMS[8],
          slot: {
            col: 0,
            row: 1,
            height: 70,
          },
        },
      ],
      [
        {
          item: ITEMS[9],
          slot: {
            col: 1,
            row: 0,
            height: 100 / 3,
          },
        },
        {
          item: ITEMS[20],
          slot: {
            col: 1,
            row: 1,
            height: 100 / 3,
          },
        },
        {
          item: ITEMS[19],
          slot: {
            col: 1,
            row: 2,
            height: 100 / 3,
          },
        },
      ],
    ],
  },
];

export const OutfitsGrid: React.FC = () => {
  return (
    <section className="p-4 flex flex-col gap-2">
      <h1 className="text-lg font-semibold">Outfits</h1>
      <div className="flex flex-wrap gap-2">
        {DB_OUTFITS.map((outfit) => (
          <OutfitCard key={outfit.outfitId} outfit={outfit} />
        ))}
      </div>
    </section>
  );
};

const OutfitSlot: React.FC<SlotItem> = ({ slot, item }) => (
  <div
    style={{ height: slot.height ? `${slot.height}%` : "auto" }}
    className={cn(
      "w-full flex items-center justify-center overflow-hidden",
      item ? "bg-blue-50" : "bg-gray-100"
    )}
  >
    {item ? (
      <>
        <div
          className={cn(
            "text-center",
            item.isactive ? "text-black" : "text-black/50"
          )}
        >
          <span className="text-sm font-medium">{item.title}</span>
          {/* <span className="sr-only">
            {item.isactive ? "Active" : "Inactive"}
          </span> */}
        </div>
      </>
    ) : (
      <span className="text-gray-400">Empty</span>
    )}
  </div>
);

const OutfitColumn: React.FC<{ items: SlotItem[] }> = ({ items }) => (
  <div className="flex flex-col h-full w-full gap-px">
    {items
      .sort((a, b) => (a.slot.row ?? 0) - (b.slot.row ?? 0))
      .map((el, index) => (
        <OutfitSlot key={index} {...el} />
      ))}
  </div>
);

const OutfitCard: React.FC<{ outfit: (typeof DB_OUTFITS)[0] }> = ({
  outfit,
}) => (
  <div className="h-[380px] aspect-square rounded-md border p-1">
    <div className="bg-yellow-200 h-full w-full rounded-sm flex gap-px">
      {outfit.items.map((items, index) => (
        <OutfitColumn key={index} items={items} />
      ))}
    </div>
  </div>
);
