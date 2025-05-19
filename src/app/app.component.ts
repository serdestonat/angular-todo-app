import { Component, ChangeDetectorRef } from '@angular/core';
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

  constructor(public todoService: TodoService, private cdr: ChangeDetectorRef) {
    this.todoService.editModalState$.subscribe((state) => {
      // this.cdr.detectChanges();
      this.showAddCard = state.isOpen;
      if (state.todo) {
        this.editingTodo = state.todo;
        this.newTodoTitle = state.todo.title;
      }
    });
  }

  pendingTodos: Todo[] = [];
  completedTodos: Todo[] = [];

  ngOnInit() {
    this.updateLists();
    this.todoService.todosChanged$.subscribe(() => {
      this.updateLists();
    });
  }

  private updateLists() {
    const allTodos = this.todoService.getTodos();
    this.pendingTodos = allTodos.filter((t) => !t.completed);
    this.completedTodos = allTodos.filter((t) => t.completed);
    this.cdr.detectChanges();
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

      // ✅ Item’ları tamamlanma durumuna göre güncelle
      event.container.data.forEach((item) => {
        item.completed = event.container.id === 'completed';
      });
    }

    const allTodos = [...this.pendingTodos, ...this.completedTodos];
    this.todoService.saveTodos(allTodos); // Bu satır zaten todosChanged'i tetikliyor
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
