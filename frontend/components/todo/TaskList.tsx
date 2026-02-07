import React from 'react';
import TaskItem from './TaskItem';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskListProps {
  todos: Todo[];
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

const TaskList = ({ todos, onUpdate, onDelete }: TaskListProps) => {
  return (
    <ul className="divide-y divide-gray-200">
      {todos.map((todo) => (
        <TaskItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default TaskList;