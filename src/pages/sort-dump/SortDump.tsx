import { useLocation } from "react-router";

export function SortDump() {
  const location = useLocation();
  const tasks = location.state?.tasks || [];

  return (
    <div className="sort-page">
      <h1>Sort Tasks</h1>
      <p>Sort your tasks into buckets (coming soon)</p>
      <p>Tasks to sort: {tasks.length}</p>
    </div>
  );
}
