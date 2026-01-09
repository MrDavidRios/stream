import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import App from "./App";
import { BrainDump } from "./pages/brain-dump/BrainDump.tsx";
import { SortDump } from "./pages/sort-dump/SortDump.tsx";
import {
  isFirstTimeToday,
  markTodayAsVisited,
} from "./hooks/useFirstTimeToday";

function AppRouter() {
  const shouldShowBrainDump = isFirstTimeToday();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            shouldShowBrainDump ? (
              <Navigate to="/brain-dump" replace />
            ) : (
              <App />
            )
          }
        />
        <Route
          path="/brain-dump"
          element={<BrainDump onComplete={markTodayAsVisited} />}
        />
        <Route path="/sort" element={<SortDump />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
