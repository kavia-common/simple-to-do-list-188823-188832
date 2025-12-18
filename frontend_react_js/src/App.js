import React, { useId, useMemo, useState } from 'react';
import { FiCheckCircle, FiClock, FiGrid, FiSearch, FiSettings } from 'react-icons/fi';
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
  const {
    tasks,
    isLoading,
    error,
    storageMode,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearError,
  } = useTasks();

  const searchId = useId();
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side placeholder filtering only; no backend changes.
  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => String(t.title || '').toLowerCase().includes(q));
  }, [searchQuery, tasks]);

  return (
    <div className="App">
      <div className="layout">
        <aside className="sidebar" aria-label="Primary">
          <div className="sidebarBrand" aria-label="App name">
            <span className="sidebarLogo" aria-hidden="true">
              ✓
            </span>
            <span className="sidebarBrandText">To‑Do</span>
          </div>

          <nav className="nav" aria-label="Sidebar navigation">
            <button type="button" className="navItem navItemActive">
              <FiGrid className="navIcon" aria-hidden="true" />
              <span>All Tasks</span>
            </button>

            <button type="button" className="navItem">
              <FiCheckCircle className="navIcon" aria-hidden="true" />
              <span>Completed</span>
            </button>

            <button type="button" className="navItem">
              <FiClock className="navIcon" aria-hidden="true" />
              <span>Pending</span>
            </button>

            <button type="button" className="navItem">
              <FiSettings className="navIcon" aria-hidden="true" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="sidebarHint" aria-label="Sidebar note">
            <div className="sidebarHintTitle">Tip</div>
            <div className="sidebarHintText">Use search to quickly filter tasks.</div>
          </div>
        </aside>

        <div className="content">
          <header className="topbar" aria-label="Header">
            <div>
              <h1 className="title">To‑Do List</h1>
              <p className="subtitle">Add tasks, mark them complete, and keep moving.</p>
            </div>

            <div className="topbarRight">
              <div className="search" role="search">
                <label className="srOnly" htmlFor={searchId}>
                  Search tasks
                </label>
                <FiSearch className="searchIcon" aria-hidden="true" />
                <input
                  id={searchId}
                  className="searchInput"
                  type="search"
                  value={searchQuery}
                  placeholder="Search tasks…"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
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
            </div>
          </header>

          <main className="appMain">
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

              {visibleTasks.length === 0 ? (
                <EmptyState />
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  isBusy={isLoading}
                />
              )}
            </section>

            <footer className="footer">
              <span className="footerText">
                Tip: press <kbd>Enter</kbd> to add a task. While editing, <kbd>Enter</kbd>{' '}
                saves and <kbd>Esc</kbd> cancels.
              </span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
