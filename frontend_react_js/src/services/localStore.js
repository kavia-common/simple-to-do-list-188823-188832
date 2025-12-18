const STORAGE_KEY = 'kavia.todo.tasks.v1';

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  // Sufficient for local-only IDs.
  return `local_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = safeJsonParse(raw || '[]', []);
  if (!Array.isArray(data)) return [];
  return data;
}

function writeAll(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// PUBLIC_INTERFACE
export function createLocalTaskStore() {
  /** This is a public factory returning a localStorage-backed store with async CRUD methods. */
  return {
    mode: 'local',

    // PUBLIC_INTERFACE
    async listTasks() {
      /** Returns all tasks from localStorage. */
      return readAll();
    },

    // PUBLIC_INTERFACE
    async createTask(payload) {
      /** Creates a task in localStorage. */
      const tasks = readAll();
      const task = {
        id: randomId(),
        title: String(payload.title || '').trim(),
        completed: Boolean(payload.completed),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      const next = [task, ...tasks];
      writeAll(next);
      return task;
    },

    // PUBLIC_INTERFACE
    async patchTask(id, payload) {
      /** Updates a task in localStorage. */
      const tasks = readAll();
      const idx = tasks.findIndex((t) => String(t.id) === String(id));
      if (idx === -1) {
        const err = new Error('Task not found');
        err.code = 'NOT_FOUND';
        throw err;
      }
      const updated = {
        ...tasks[idx],
        ...payload,
        updatedAt: nowIso(),
      };
      const next = tasks.slice();
      next[idx] = updated;
      writeAll(next);
      return updated;
    },

    // PUBLIC_INTERFACE
    async deleteTask(id) {
      /** Deletes a task from localStorage. */
      const tasks = readAll();
      const next = tasks.filter((t) => String(t.id) !== String(id));
      writeAll(next);
      return null;
    },
  };
}
