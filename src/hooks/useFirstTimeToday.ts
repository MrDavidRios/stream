import { useState } from "react";

const LAST_VISIT_KEY = "stream_last_visit_date";

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function useFirstTimeToday(): { isFirstTimeToday: boolean; markVisited: () => void } {
  const [isFirstTimeToday, setIsFirstTimeToday] = useState<boolean>(() => {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const today = getTodayDateString();
    return lastVisit !== today;
  });

  const markVisited = () => {
    const today = getTodayDateString();
    localStorage.setItem(LAST_VISIT_KEY, today);
    setIsFirstTimeToday(false);
  };

  return { isFirstTimeToday, markVisited };
}

export function isFirstTimeToday(): boolean {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const today = getTodayDateString();
  return lastVisit !== today;
}

export function markTodayAsVisited(): void {
  const today = getTodayDateString();
  localStorage.setItem(LAST_VISIT_KEY, today);
}
