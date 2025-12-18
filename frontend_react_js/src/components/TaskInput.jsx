import React, { useId, useState } from 'react';

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
        />
      </div>

      <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
        Add
      </button>
    </form>
  );
}
