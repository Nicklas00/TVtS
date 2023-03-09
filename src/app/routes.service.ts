import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { routeRequest } from './routeRequest';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  readonly summarySubject = new ReplaySubject<routeRequest>(1);
  constructor(private httpClient: HttpClient) {}

  save(routeRequest: routeRequest): void {
    this.httpClient
      .post<routeRequest>(
        '/api/generateRoute',
        routeRequest
      )
      .subscribe({
        next: (responseData) => {
          // By convention, a POST/PUT returns the stored data, so we update our state with this:
          this.summarySubject.next(responseData);
        },
        error: (e) => {
          // Relevant error handling here.
        },
      });
  }

  removeSelectedRoute() {
    this.summarySubject.next({
      id: 0, 
      mode: '',
      origin: {
        lat: 0,
        lon: 0,
      },
      destination: {
        lat: 0,
        lon: 0,
      }
    });
  }
}
