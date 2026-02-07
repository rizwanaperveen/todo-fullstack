'use client';

import React from 'react';
import TaskList from '@/components/todo/TaskList';
import TaskForm from '@/components/todo/TaskForm';
import EmptyState from '@/components/todo/EmptyState';
import useTodos from '@/hooks/useTodos';
import useAuth from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const DashboardPage = () => {
  const { todos, loading, error, createTodo, updateTodo, deleteTodo } = useTodos();
  const { user, logout } = useAuth();

  const handleCreateTodo = async (title: string) => {
    await createTodo(title);
  };

  const handleUpdateTodo = async (id: string, updates: Partial<any>) => {
    await updateTodo(id, updates);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name || 'User'}!</h1>
        <TaskForm onCreate={handleCreateTodo} />
      </div>

      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Todos</h2>
          <TaskList todos={todos} onUpdate={handleUpdateTodo} onDelete={handleDeleteTodo} />
        </div>
      )}
    </div>
  );
};

const DashboardPageWrapper = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
};

export default DashboardPageWrapper;