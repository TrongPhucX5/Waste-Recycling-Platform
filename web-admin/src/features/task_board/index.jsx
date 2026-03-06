import React from "react";
import { useTaskBoard } from "./hooks/useTaskBoard";
import TaskList from "./components/TaskList";

const TaskBoard = () => {
  const { tasks, loading, assignTask } = useTaskBoard();

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Danh sách việc cần giao</h2>
      <TaskList tasks={tasks} onAssign={assignTask} />
    </div>
  );
};

export default TaskBoard;
