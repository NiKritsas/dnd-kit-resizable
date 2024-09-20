"use client";

import { ResizableDemo } from "./components/Resizable";
import { AppStateProvider } from "./components/AppStateContext";
import { OutfitsGrid } from "./components/preview/OutfitsGrid2D";

export default function Home() {
  return (
    <AppStateProvider>
      <ResizableDemo />
      <OutfitsGrid />
    </AppStateProvider>
  );
}
