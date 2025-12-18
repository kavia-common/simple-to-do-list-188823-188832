import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState() {
  /** This is a public component that renders the empty state when no tasks exist. */
  return (
    <div className="emptyState" role="status" aria-live="polite">
      <div className="emptyIcon" aria-hidden="true">
        ☐
      </div>
      <h2 className="emptyTitle">No tasks yet</h2>
      <p className="emptyText">Add your first task above to get started.</p>
    </div>
  );
}
