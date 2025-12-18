/**
 * Small REST client for tasks endpoint.
 * Environment variables:
 * - REACT_APP_API_BASE or REACT_APP_BACKEND_URL
 */

function getApiBase() {
  const raw = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  return raw.trim().replace(/\/+$/, '');
}

async function parseJsonOrText(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  const text = await res.text();
  return text ? { message: text } : {};
}

// PUBLIC_INTERFACE
export function createApiClient() {
  /** This is a public factory that returns an API client for CRUD operations on tasks. */
  const baseUrl = getApiBase();
  const enabled = Boolean(baseUrl);

  const request = async (path, options = {}) => {
    if (!enabled) {
      const err = new Error('API base URL not configured');
      err.code = 'NO_API_BASE';
      throw err;
    }

    const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    let res;
    try {
      res = await fetch(url, {
        headers: {
          'content-type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });
    } catch (e) {
      const err = new Error('Network error');
      err.cause = e;
      err.code = 'NETWORK_ERROR';
      throw err;
    }

    if (!res.ok) {
      const body = await parseJsonOrText(res);
      const err = new Error(body?.message || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.body = body;
      err.code = 'HTTP_ERROR';
      throw err;
    }

    // 204 No Content
    if (res.status === 204) return null;
    return parseJsonOrText(res);
  };

  return {
    enabled,

    // PUBLIC_INTERFACE
    async listTasks() {
      /** Fetch all tasks. Returns array of {id, title, completed}. */
      return request('/tasks', { method: 'GET' });
    },

    // PUBLIC_INTERFACE
    async createTask(payload) {
      /** Create a task with {title, completed?}. Returns created task. */
      return request('/tasks', { method: 'POST', body: JSON.stringify(payload) });
    },

    // PUBLIC_INTERFACE
    async patchTask(id, payload) {
      /** Patch a task (title/completed). Returns updated task. */
      return request(`/tasks/${encodeURIComponent(String(id))}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },

    // PUBLIC_INTERFACE
    async deleteTask(id) {
      /** Delete task by id. Returns null. */
      await request(`/tasks/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
      return null;
    },
  };
}
