export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface TodoApiResponse {
  todos?: Todo[];
  todo?: Todo;
  success?: boolean;
  error?: string;
}