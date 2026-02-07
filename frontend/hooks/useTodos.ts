import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api/client';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/tasks');
      // Backend returns { tasks: [...], total: N }
      setTodos(response.tasks || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string) => {
  setLoading(true);
  setError(null);
  try {
    const newTodo = await apiClient.post('/tasks', { title });
    setTodos(prev => [...prev, newTodo]);
    return { success: true, todo: newTodo };
  } catch (err) {
    setError((err as Error).message);
    return { success: false, error: (err as Error).message };
  } finally {
    setLoading(false);
  }
};

const updateTodo = async (id: string, updates: Partial<Todo>) => {
  setLoading(true);
  setError(null);
  try {
    const updatedTodo = await apiClient.put(`/tasks/${id}`, updates);
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? updatedTodo : todo))
    );
    return { success: true, todo: updatedTodo };
  } catch (err) {
    setError((err as Error).message);
    return { success: false, error: (err as Error).message };
  } finally {
    setLoading(false);
  }
};

const deleteTodo = async (id: string) => {
  setLoading(true);
  setError(null);
  try {
    await apiClient.delete(`/tasks/${id}`);
    setTodos(prev => prev.filter(todo => todo.id !== id));
    return { success: true };
  } catch (err) {
    setError((err as Error).message);
    return { success: false, error: (err as Error).message };
  } finally {
    setLoading(false);
  }
};

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};

export default useTodos;