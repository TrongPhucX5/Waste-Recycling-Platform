import React from "react";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onAssign }) => (
  <div>
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} onAssign={onAssign} />
    ))}
  </div>
);

export default TaskList;
