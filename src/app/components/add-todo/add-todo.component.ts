// components/add-todo/add-todo.component.ts
import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  standalone: true, // <-- Bu satırı kontrol edin
  imports: [FormsModule],
})
export class AddTodoComponent {
  newTodoTitle = '';

  constructor(private todoService: TodoService) {}

  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }
}
