import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function TaskItem({ task, onToggle, onDelete, onUpdate, isBusy = false }) {
  /** This is a public component that renders a single editable task row. */
  const editInputId = useId();
  const editRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  useEffect(() => {
    // Keep draft in sync if the task title changes due to optimistic updates/reverts.
    setDraft(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [isEditing]);

  const trimmedDraft = useMemo(() => draft.trim(), [draft]);

  const startEdit = () => {
    if (isBusy) return;
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(task.title);
    setIsEditing(false);
  };

  const commitEdit = () => {
    if (isBusy) return;
    if (!trimmedDraft) return; // do not allow empty titles
    if (trimmedDraft === task.title) {
      setIsEditing(false);
      return;
    }
    onUpdate(task.id, { title: trimmedDraft });
    setIsEditing(false);
  };

  const onEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <li className="taskItem" aria-label={`Task: ${task.title}`}>
      <div className="taskLeft">
        <button
          type="button"
          className={`checkBtn ${task.completed ? 'checkBtnDone' : ''}`}
          onClick={() => onToggle(task.id)}
          disabled={isBusy}
          aria-pressed={task.completed}
          aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
          title={task.completed ? 'Completed' : 'Not completed'}
        >
          {task.completed ? '✓' : ''}
        </button>

        <div className="taskBody">
          {isEditing ? (
            <div className="editRow">
              <label className="srOnly" htmlFor={editInputId}>
                Edit task title
              </label>
              <input
                ref={editRef}
                id={editInputId}
                className="input inputCompact"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onEditKeyDown}
                disabled={isBusy}
              />
              <button
                type="button"
                className="btn btnSmall btnPrimary"
                onClick={commitEdit}
                disabled={isBusy || !trimmedDraft}
              >
                Save
              </button>
              <button type="button" className="btn btnSmall btnGhost" onClick={cancelEdit} disabled={isBusy}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="titleRow">
              <span className={`taskTitle ${task.completed ? 'taskTitleDone' : ''}`}>
                {task.title}
              </span>
              <span className="taskMeta">
                {task.completed ? 'Completed' : 'Active'}
              </span>
            </div>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="taskActions" aria-label="Task actions">
          <button
            type="button"
            className="btn btnSmall btnGhost"
            onClick={startEdit}
            disabled={isBusy}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btnSmall btnDanger"
            onClick={() => onDelete(task.id)}
            disabled={isBusy}
          >
            Delete
          </button>
        </div>
      ) : null}
    </li>
  );
}
