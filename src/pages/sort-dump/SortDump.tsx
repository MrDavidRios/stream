import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Task, SortedTask, SortAction, BucketType } from "../../types/sorting";
import { DraggableCard } from "./components/DraggableCard";
import { DropBucket } from "./components/DropBucket";
import "./sort-dump.css";

export function SortDump() {
  const location = useLocation();
  const navigate = useNavigate();
  const rawTasks: string[] = location.state?.tasks || [];

  const [unsortedTasks] = useState<Task[]>(() =>
    rawTasks.map((text, i) => ({ id: `task-${i}`, text }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sortedTasks, setSortedTasks] = useState<SortedTask[]>([]);
  const [undoStack, setUndoStack] = useState<SortAction[]>([]);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const currentTask = unsortedTasks[currentIndex] ?? null;
  const isComplete = currentIndex >= unsortedTasks.length;
  const canUndo = undoStack.length > 0;

  const todayTasks = sortedTasks.filter((s) => s.bucket === "today");
  const thisWeekTasks = sortedTasks.filter((s) => s.bucket === "this-week");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Navigate home when complete
  useEffect(() => {
    if (isComplete && unsortedTasks.length > 0) {
      navigate("/");
    }
  }, [isComplete, navigate, unsortedTasks.length]);

  const sortTask = useCallback(
    (bucket: BucketType) => {
      if (!currentTask || exitDirection) return;

      const direction = bucket === "today" ? "left" : "right";
      setExitDirection(direction);

      setTimeout(() => {
        setExitDirection(null);
        setSortedTasks((prev) => [...prev, { task: currentTask, bucket }]);
        setUndoStack((prev) => [
          ...prev,
          { taskId: currentTask.id, bucket, previousIndex: currentIndex },
        ]);
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    },
    [currentTask, currentIndex, exitDirection]
  );

  const undoLastSort = useCallback(() => {
    if (undoStack.length === 0 || exitDirection) return;

    const lastAction = undoStack[undoStack.length - 1];
    setCurrentIndex(lastAction.previousIndex);
    setSortedTasks((prev) => prev.slice(0, -1));
    setUndoStack((prev) => prev.slice(0, -1));
  }, [undoStack, exitDirection]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }

      if (e.key === "ArrowLeft") {
        sortTask("today");
      } else if (e.key === "ArrowRight") {
        sortTask("this-week");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undoLastSort();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortTask, undoLastSort]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    event.active
    if (over) {
      const bucket = over.id as BucketType;
      console.log('')
      sortTask(bucket);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="sort-dump">
        <div className="sort-dump__header">
          <h1>Sort Your Tasks</h1>
        </div>

        <div className="sort-dump__progress">
          <p>{currentIndex + 1} of {unsortedTasks.length}</p>
        </div>

        <div className="sort-dump__arena">
          <DropBucket
            id="today"
            label="Today"
            position="left"
            taskCount={todayTasks.length}
          />

          <DropBucket
            id="this-week"
            label="This Week"
            position="right"
            taskCount={thisWeekTasks.length}
          />

          {/* Last in DOM so it stacks on top of both buckets */}
          <div className="sort-dump__card-zone">
            {currentTask && (
              <DraggableCard task={currentTask} exitDirection={exitDirection} />
            )}
          </div>
        </div>

        {canUndo && (
          <div className="sort-dump__undo-hint">Press Ctrl+Z to undo</div>
        )}
      </div>
    </DndContext>
  );
}
