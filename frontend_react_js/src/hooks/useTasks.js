import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createApiClient } from '../services/apiClient';
import { createLocalTaskStore } from '../services/localStore';

function normalizeTask(raw) {
  return {
    id: raw.id,
    title: String(raw.title ?? ''),
    completed: Boolean(raw.completed),
  };
}

function sortTasks(tasks) {
  // Active tasks first, then completed; stable-ish by title.
  return tasks
    .slice()
    .sort((a, b) => Number(a.completed) - Number(b.completed) || a.title.localeCompare(b.title));
}

function randomTempId() {
  return `tmp_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

async function canReachApi(api) {
  // Try a lightweight read; if it fails, we'll fall back.
  const tasks = await api.listTasks();
  return Array.isArray(tasks);
}

// PUBLIC_INTERFACE
export function useTasks() {
  /** This is a public hook that provides tasks state + CRUD actions with optimistic updates. */
  const api = useMemo(() => createApiClient(), []);
  const local = useMemo(() => createLocalTaskStore(), []);

  const providerRef = useRef(null); // { mode, listTasks, createTask, patchTask, deleteTask }
  const [storageMode, setStorageMode] = useState(api.enabled ? 'api' : 'local');

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // non-intrusive error message; when API fails we switch to local and continue
  const [error, setError] = useState('');

  const setProvider = useCallback((provider, mode) => {
    providerRef.current = provider;
    setStorageMode(mode);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsLoading(true);
      setError('');

      // Default to local when API base is missing.
      if (!api.enabled) {
        setProvider(local, 'local');
        const items = await local.listTasks();
        if (isMounted) setTasks(sortTasks(items.map(normalizeTask)));
        if (isMounted) setIsLoading(false);
        return;
      }

      // When API is configured, try to reach it once.
      try {
        await canReachApi(api);
        setProvider(api, 'api');
        const items = await api.listTasks();
        if (isMounted) setTasks(sortTasks(items.map(normalizeTask)));
      } catch (e) {
        // Fail open: switch to local store so UI stays functional.
        setProvider(local, 'local');
        const items = await local.listTasks();
        if (isMounted) setTasks(sortTasks(items.map(normalizeTask)));
        if (isMounted) {
          setError(
            'Backend unavailable. Using localStorage. (Set REACT_APP_API_BASE / REACT_APP_BACKEND_URL to enable REST.)'
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [api, local, setProvider]);

  const clearError = useCallback(() => setError(''), []);

  const safeProvider = () => providerRef.current || local;

  const addTask = useCallback(async (title) => {
    const provider = safeProvider();
    const tempId = randomTempId();

    // optimistic insert
    const optimistic = { id: tempId, title, completed: false };
    setTasks((prev) => sortTasks([optimistic, ...prev]));

    try {
      const created = await provider.createTask({ title, completed: false });
      const normalized = normalizeTask(created);

      // replace temp
      setTasks((prev) => sortTasks(prev.map((t) => (t.id === tempId ? normalized : t))));
    } catch (e) {
      // revert
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(e?.message || 'Failed to add task');
    }
  }, [local]);

  const updateTask = useCallback(async (id, patch) => {
    const provider = safeProvider();

    let before;
    setTasks((prev) => {
      before = prev.find((t) => String(t.id) === String(id));
      if (!before) return prev;
      return sortTasks(prev.map((t) => (String(t.id) === String(id) ? { ...t, ...patch } : t)));
    });

    try {
      const updated = await provider.patchTask(id, patch);
      const normalized = normalizeTask(updated);
      setTasks((prev) => sortTasks(prev.map((t) => (String(t.id) === String(id) ? normalized : t))));
    } catch (e) {
      // revert if we had it
      if (before) {
        setTasks((prev) => sortTasks(prev.map((t) => (String(t.id) === String(id) ? before : t))));
      }
      setError(e?.message || 'Failed to update task');
    }
  }, [local]);

  const deleteTask = useCallback(async (id) => {
    const provider = safeProvider();

    let removed;
    setTasks((prev) => {
      removed = prev.find((t) => String(t.id) === String(id));
      return prev.filter((t) => String(t.id) !== String(id));
    });

    try {
      await provider.deleteTask(id);
    } catch (e) {
      // revert
      if (removed) setTasks((prev) => sortTasks([removed, ...prev]));
      setError(e?.message || 'Failed to delete task');
    }
  }, [local]);

  const toggleTask = useCallback(async (id) => {
    const current = tasks.find((t) => String(t.id) === String(id));
    if (!current) return;
    await updateTask(id, { completed: !current.completed });
  }, [tasks, updateTask]);

  return {
    tasks,
    isLoading,
    error,
    storageMode,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearError,
  };
}
