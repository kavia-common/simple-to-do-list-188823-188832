import React, { useMemo, useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import EmptyState from './components/EmptyState';
import AppShell from './components/AppShell';
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => String(t.title || '').toLowerCase().includes(q));
  }, [tasks, search]);

  const quickAdd = () => {
    // Keep behavior predictable: focus stays on the page; we just close the sidebar.
    setSidebarOpen(false);
    // Users can add via the main "New task" input; this is a friendly shortcut hint action.
    // We intentionally do not auto-create empty tasks.
    const el = document.getElementById('new-task-input');
    if (el) el.focus();
  };

  return (
    <div className="App">
      <AppShell
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchValue={search}
        onSearchChange={setSearch}
        onQuickAdd={quickAdd}
      >
        <div className="container containerWide">
          <div className="statusRow" aria-label="App status">
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
            <div className="cardHeader">
              <div>
                <h2 className="cardTitle">Tasks</h2>
                <p className="cardSub">
                  {search.trim()
                    ? `Showing ${filteredTasks.length} of ${tasks.length} matching “${search.trim()}”.`
                    : 'Add tasks, mark them complete, and keep moving.'}
                </p>
              </div>
            </div>

            <TaskInput onAdd={addTask} isDisabled={isLoading} />

            <div className="divider" />

            {filteredTasks.length === 0 ? (
              search.trim() ? (
                <div className="emptyState" role="status" aria-live="polite">
                  <div className="emptyIcon" aria-hidden="true">
                    ☐
                  </div>
                  <h2 className="emptyTitle">No matches</h2>
                  <p className="emptyText">Try a different search term.</p>
                </div>
              ) : (
                <EmptyState />
              )
            ) : (
              <TaskList
                tasks={filteredTasks}
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
        </div>
      </AppShell>
    </div>
  );
}

export default App;
