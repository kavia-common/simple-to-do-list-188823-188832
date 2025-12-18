import React from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import EmptyState from './components/EmptyState';
import { useTasks } from './hooks/useTasks';
import './styles/theme.css';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App root for the To-Do list UI.
 * Provides a header, add form, and task list with edit/delete/toggle completion.
 * Automatically uses REST backend if configured/reachable, otherwise falls back to localStorage.
 */
function App() {
  const { tasks, isLoading, error, storageMode, addTask, updateTask, deleteTask, toggleTask, clearError } =
    useTasks();

  return (
    <div className="App">
      <div className="container">
        <header className="headerRow" aria-label="Header">
          <div>
            <h1 className="title">To‑Do List</h1>
            <p className="subtitle">Add tasks, mark them complete, and keep moving.</p>
          </div>

          <div className="statusPills" aria-label="App status">
            <span className="pill" title="Storage provider in use">
              Storage: <strong>{storageMode}</strong>
            </span>
            {isLoading ? (
              <span className="pill pillInfo" aria-live="polite">
                Loading…
              </span>
            ) : (
              <span className="pill pillSuccess" aria-live="polite">
                Ready
              </span>
            )}
          </div>
        </header>

        <main>
          {error ? (
            <div className="notice noticeError" role="status" aria-live="polite">
              <div className="noticeText">
                <strong>Couldn’t sync with backend.</strong> {error}
                <div className="noticeHint">The app will keep working using local storage.</div>
              </div>
              <button className="btn btnGhost" onClick={clearError} type="button">
                Dismiss
              </button>
            </div>
          ) : null}

          <section className="mainCard" aria-label="Tasks">
            <TaskInput onAdd={addTask} isDisabled={isLoading} />

            <div className="divider" />

            {tasks.length === 0 ? (
              <EmptyState />
            ) : (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                isBusy={isLoading}
              />
            )}
          </section>

          <footer className="footer">
            <span className="footerText">
              Tip: press <kbd>Enter</kbd> to add a task. While editing, <kbd>Enter</kbd> saves and <kbd>Esc</kbd>{' '}
              cancels.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
