// models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
