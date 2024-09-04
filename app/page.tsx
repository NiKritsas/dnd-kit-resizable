"use client";

import { ResizableDemo } from "./components/Resizable";
import { AppStateProvider } from "./components/AppStateContext";

export default function Home() {
  return (
    <AppStateProvider>
      <ResizableDemo />
    </AppStateProvider>
  );
}
