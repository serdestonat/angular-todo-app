import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly STORAGE_KEY = 'angular_todo_app';
  private editModalState = new BehaviorSubject<{
    isOpen: boolean;
    todo?: Todo;
  }>({
    isOpen: false,
    todo: undefined,
  });

  editModalState$ = this.editModalState.asObservable();

  getTodos(): Todo[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  addTodo(title: string): void {
    const todos = this.getTodos();
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.saveTodos([...todos, newTodo]);
  }

  toggleTodo(id: string): void {
    const todos = this.getTodos().map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveTodos(todos);
  }

  deleteTodo(id: string): void {
    const todos = this.getTodos().filter((todo) => todo.id !== id);
    this.saveTodos(todos);
  }

  reorderTodos(todos: Todo[]): void {
    this.saveTodos(todos);
  }

  openEditModal(todo: Todo) {
    this.editModalState.next({ isOpen: true, todo });
  }

  closeEditModal() {
    this.editModalState.next({ isOpen: false });
  }

  updateTodo(updatedTodo: Todo) {
    const todos = this.getTodos().map((t) =>
      t.id === updatedTodo.id ? updatedTodo : t
    );
    this.saveTodos(todos);
  }
}
