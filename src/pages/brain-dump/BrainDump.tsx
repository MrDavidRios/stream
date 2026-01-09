import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import "./BrainDump.css";

interface BrainDumpProps {
  onComplete?: () => void;
}

export function BrainDump({ onComplete }: BrainDumpProps) {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setTasks([...tasks, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleSort = () => {
    onComplete?.();
    navigate("/sort", { state: { tasks } });
  };

  return (
    <div className="brain-dump">
      <div className="brain-dump-header">
        <h1>Brain Dump</h1>
        <p>Enter your tasks as a stream of consciousness. Press Enter to add each task.</p>
      </div>

      <input
        type="text"
        className="brain-dump-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's on your mind?"
        autoFocus
      />

      <ul className="brain-dump-list">
        {tasks.map((task, index) => (
          <li key={index} className="brain-dump-item">
            {task}
          </li>
        ))}
      </ul>

      <button
        className="brain-dump-sort-button"
        onClick={handleSort}
        disabled={tasks.length === 0}
      >
        Sort Tasks
      </button>
    </div>
  );
}