import React from 'react';
import TaskItem from './TaskItem';

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onToggle, onDelete, onUpdate, isBusy = false }) {
  /** This is a public component that renders the list of tasks. */
  return (
    <ul className="taskList" aria-label="Task list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isBusy={isBusy}
        />
      ))}
    </ul>
  );
}
