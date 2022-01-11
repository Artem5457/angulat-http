import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';

export interface Todo {
  id: number,
  title: string,
  completed: boolean
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  constructor(private http: HttpClient) {}

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
      headers: new HttpHeaders({
        'MyCustomHeader': Math.random().toString(),
        'Number': '2344'
      })
    });
  }

  fetchTodos(): Observable<Todo[]> {
    let params = new HttpParams();
    params = params.append('_limit', 4);
    params = params.append('custom', 'anything');

    return  this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
      // params: new HttpParams()?.set('_limit', '3')
      params,
      observe: 'response'
    })
      .pipe(
        map(response => {
          // console.log('Response', response);
          return response.body;
        }),
        // @ts-ignore
        delay(1500),
        catchError(error => {
          console.log('Error: ', error.message);
          return throwError(error);
        })
      )
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      observe: 'events'
    }).pipe(
      tap(event => {
        // console.log('Event: ', event);
        if (event.type === HttpEventType.Sent) {
          console.log('Sent', event);
        }

        if (event.type === HttpEventType.Response) {
          console.log('Response', event);
        }
      })
    )
  }

  completeTodo(id: number): Observable<any> {
    return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {headerscompleted: true}, {
      // @ts-ignore
      responseType: 'json'
    })
  }
}

