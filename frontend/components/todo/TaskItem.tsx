'use client';

import React, { useState } from 'react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

const TaskItem = ({ todo, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleToggle = async () => {
    await onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleEdit = async () => {
    if (editValue.trim()) {
      await onUpdate(todo.id, { title: editValue });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(todo.id);
  };

  return (
    <li className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`ml-3 block text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
        >
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              className="border border-gray-300 rounded px-2 py-1 text-gray-700"
              autoFocus
            />
          ) : (
            <span onClick={() => setIsEditing(true)} className="cursor-pointer">
              {todo.title}
            </span>
          )}
        </label>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button
          onClick={handleDelete}
          className="text-sm font-medium text-red-600 hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;