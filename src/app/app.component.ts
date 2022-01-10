import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Todo, TodoService } from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todos: Todo[] = [];
  loading: boolean = false;
  todoTitle: string = '';

  constructor(
    private todosService: TodoService
  ) { }

  ngOnInit(): void {
    this.fetchTodos();
  }

  addTodo() {
    if (!this.todoTitle.trim()) {
      return;
    }

    // @ts-ignore
    const newTodo: Todo = {
      title: this.todoTitle,
      completed: false,
    }

    this.todosService.addTodo(newTodo)
      .subscribe(todo => {
        console.log('Todo: ', todo);
        this.todos.push(todo);
        this.todoTitle = '';
      });
  }

  fetchTodos() {
    this.loading = true;
    this.todosService.fetchTodos()
      .subscribe(todos => {
        this.todos = todos;
        this.loading = false;
      })
  }

  removeTodo(id: number) {
    this.todosService.removeTodo(id)
      .subscribe(() => {
        this.todos = this.todos.filter(el => el.id !== id)
      })
  }
}
