import React, { useEffect } from 'react';
import { FiCheckCircle, FiMenu, FiPlus } from 'react-icons/fi';
import SearchBar from './SearchBar';

/**
 * PUBLIC_INTERFACE
 * AppShell provides the persistent application layout:
 * - Responsive left sidebar (collapsible on mobile)
 * - Top bar with menu button, search input, and add-task shortcut
 * - Main content area
 */
export default function AppShell({
  sidebarOpen,
  setSidebarOpen,
  searchValue,
  onSearchChange,
  onQuickAdd,
  children,
}) {
  // Close the mobile sidebar with Escape for accessibility.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <div className="layoutRoot">
      {/* Mobile overlay */}
      <button
        type="button"
        className={`sidebarOverlay ${sidebarOpen ? 'sidebarOverlayOpen' : ''}`}
        aria-label="Close navigation menu"
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`sidebar ${sidebarOpen ? 'sidebarOpen' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="sidebarHeader">
          <div className="brand" aria-label="App name">
            <span className="brandIcon" aria-hidden="true">
              <FiCheckCircle />
            </span>
            <div className="brandText">
              <div className="brandTitle">To‑Do</div>
              <div className="brandSub">Simple task manager</div>
            </div>
          </div>

          <button
            type="button"
            className="iconBtn iconBtnGhost sidebarCloseBtn"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <FiMenu />
          </button>
        </div>

        <nav className="sidebarNav" aria-label="Sidebar links">
          <a className="navItem navItemActive" href="#tasks" aria-current="page">
            <span className="navDot" aria-hidden="true" />
            Tasks
          </a>
          <div className="navSectionLabel">Views</div>
          <button type="button" className="navItem navItemButton" onClick={() => onSearchChange('')}>
            <span className="navDot navDotMuted" aria-hidden="true" />
            Clear search
          </button>
        </nav>

        <div className="sidebarFooter">
          <button type="button" className="btn btnPrimary sidebarAddBtn" onClick={onQuickAdd}>
            <span className="btnIcon" aria-hidden="true">
              <FiPlus />
            </span>
            Quick add
          </button>
          <div className="sidebarHint">Tip: Use search to filter tasks instantly.</div>
        </div>
      </aside>

      <div className="layoutMain">
        <header className="topbar" aria-label="Top bar">
          <div className="topbarLeft">
            <button
              type="button"
              className="iconBtn iconBtnGhost"
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu />
            </button>

            <div className="topbarTitleWrap">
              <h1 className="topbarTitle">To‑Do List</h1>
              <span className="topbarSubtitle">Stay focused. Ship tasks.</span>
            </div>
          </div>

          <div className="topbarCenter" aria-label="Search tasks">
            <SearchBar value={searchValue} onChange={onSearchChange} />
          </div>

          <div className="topbarRight">
            <button type="button" className="btn btnPrimary topbarAddBtn" onClick={onQuickAdd}>
              <span className="btnIcon" aria-hidden="true">
                <FiPlus />
              </span>
              Add
            </button>
          </div>
        </header>

        <main className="page" id="tasks">
          {children}
        </main>
      </div>
    </div>
  );
}
