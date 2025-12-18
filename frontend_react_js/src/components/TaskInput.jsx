import React, { useId, useState } from 'react';
import { FiPlus } from 'react-icons/fi';

// PUBLIC_INTERFACE
export default function TaskInput({ onAdd, isDisabled = false }) {
  /** This is a public component that renders the task add form. */
  const inputId = useId();
  const [title, setTitle] = useState('');

  const canSubmit = title.trim().length > 0 && !isDisabled;

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setTitle('');
  };

  return (
    <form className="taskInputRow" onSubmit={onSubmit} aria-label="Add a task">
      <div className="field">
        <label className="label" htmlFor={inputId}>
          New task
        </label>
        <input
          id={inputId}
          className="input"
          type="text"
          value={title}
          placeholder="What needs doing?"
          onChange={(e) => setTitle(e.target.value)}
          disabled={isDisabled}
          autoComplete="off"
          // Used by AppShell quick add for focusing the field.
          // (We keep the actual DOM id stable without depending on React's generated useId)
          // eslint-disable-next-line react/no-unknown-property
          data-role="new-task-input"
        />
        {/* Mirror a stable id for quick focus (set in App.js quickAdd). */}
        <input type="hidden" id="new-task-input" value="" readOnly aria-hidden="true" />
      </div>

      <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
        <span className="btnIcon" aria-hidden="true">
          <FiPlus />
        </span>
        Add
      </button>
    </form>
  );
}
