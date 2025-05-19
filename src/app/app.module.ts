import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DragDropModule,
    AppComponent, // Standalone olduğu için imports içine
    TodoListComponent, // Standalone olduğu için imports içine
  ],
})
export class AppModule {}
