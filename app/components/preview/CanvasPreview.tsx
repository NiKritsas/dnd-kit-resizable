import React from "react";
import { useAppState } from "../AppStateContext";

interface PreviewModalProps {
  index: number; // Canvas index to preview
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  index,
  onClose,
}) => {
  const { state } = useAppState();

  const canvas = state[index];

  if (!canvas) {
    return <div>Canvas not found</div>;
  }

  const { panels } = canvas;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg p-4 max-w-3xl w-full">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">Canvas Preview</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            Close
          </button>
        </div>
        <div className="flex justify-center mt-4 h-[300px]">
          {/* Iterate over the columns */}
          {panels.map((column, colIndx) => (
            <div key={`column-${colIndx}`} className="flex flex-col w-1/2">
              {column.map((panel, rowIndx) => {
                const height = state[index].panels[colIndx][rowIndx].size || {
                  height: 100,
                  width: "auto",
                };
                console.log(height);

                return (
                  <div
                    key={panel.id}
                    className="border rounded-md flex items-center justify-center"
                    style={{
                      height: `${height}%`,
                      width: "auto",
                    }}
                  >
                    {/* item inside the panel */}
                    {panel.item ? (
                      <div className="text-center font-semibold">
                        {panel.item.title}
                      </div>
                    ) : (
                      <div className="text-gray-400">Empty</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
