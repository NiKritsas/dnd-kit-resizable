import { Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ITEMS } from "../Resizable";

const DB_OUTFITS: {
  outfitId: number;
  items: {
    item: Item | null;
    slot: { col: number | null; row: number | null; height: number | null };
  }[];
}[] = [
  {
    outfitId: 1,
    items: [
      {
        item: ITEMS[10],
        slot: {
          col: 0,
          row: 0,
          height: 100,
        },
      },
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
  },
  {
    outfitId: 1,
    items: [
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
  },
];

const OutfitsGrid = () => {
  return (
    <section className="p-4 flex flex-col gap-2">
      <h1 className="text-lg font-semibold">Outfits</h1>
      <div className="flex flex-wrap gap-2">
        {DB_OUTFITS.map((outfit) => (
          <div
            key={outfit.outfitId}
            className="h-[380px] aspect-square rounded-md border p-1"
          >
            <div className="bg-yellow-200 h-full w-full rounded-sm flex gap-px">
              {/* 1st column */}
              <div className="flex flex-col h-full w-full gap-px">
                {outfit.items.map((el, index) => {
                  if (el.slot.col === 0) {
                    return (
                      <div
                        key={index}
                        style={{
                          height: el.slot.height
                            ? `${el.slot.height}%`
                            : "auto",
                        }}
                        className={cn(
                          "h-full w-full flex items-center justify-center",
                          el.item && "bg-blue-50"
                        )}
                      >
                        {el.item?.title}
                      </div>
                    );
                  }
                })}
              </div>
              {/* 2nd column */}
              <div className="flex flex-col h-full w-full gap-px">
                {outfit.items.map((el, index) => {
                  if (el.slot.col === 1) {
                    return (
                      <div
                        key={index}
                        style={{
                          height: el.slot.height
                            ? `${el.slot.height}%`
                            : "auto",
                        }}
                        className={cn(
                          "h-full w-full flex items-center justify-center",
                          el.item && "bg-blue-50"
                        )}
                      >
                        {el.item?.title}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OutfitsGrid;
