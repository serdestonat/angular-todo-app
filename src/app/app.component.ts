import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoListComponent, DragDropModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showAddCard = false;
  newTodoTitle = '';
  editingTodo: Todo | null = null;

  constructor(public todoService: TodoService) {
    this.todoService.editModalState$.subscribe((state) => {
      this.showAddCard = state.isOpen;
      if (state.todo) {
        this.editingTodo = state.todo;
        this.newTodoTitle = state.todo.title;
      }
    });
  }

  get pendingTodos(): Todo[] {
    return this.todoService.getTodos().filter((t) => !t.completed);
  }

  get completedTodos(): Todo[] {
    return this.todoService.getTodos().filter((t) => t.completed);
  }

  onTodoDrop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Durum güncelleme
      event.container.data.forEach((item) => {
        item.completed = event.container.id === 'completed';
      });
    }
    this.todoService.saveTodos([...this.pendingTodos, ...this.completedTodos]);
  }

  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
      this.showAddCard = false;
    }
  }

  handleSave() {
    if (this.newTodoTitle.trim()) {
      if (this.editingTodo) {
        const updatedTodo = {
          ...this.editingTodo,
          title: this.newTodoTitle.trim(),
        };
        this.todoService.updateTodo(updatedTodo);
      } else {
        this.todoService.addTodo(this.newTodoTitle.trim());
      }
      this.closeModal();
    }
  }

  closeModal() {
    this.todoService.closeEditModal();
    this.newTodoTitle = '';
    this.editingTodo = null;
  }
}
