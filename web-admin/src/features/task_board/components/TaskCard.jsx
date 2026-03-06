import React from "react";

const TaskCard = ({ task, onAssign }) => (
  <div className="border p-2 mt-2">
    <p>{task.address}</p>
    <button onClick={() => onAssign(task.id, "user_collector_123")}>
      Giao việc
    </button>
  </div>
);

export default TaskCard;
