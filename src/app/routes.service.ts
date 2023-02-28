import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { routeRequest } from './routeRequest';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  readonly summarySubject = new ReplaySubject<routeRequest>(1);
  constructor(private httpClient: HttpClient) {}

  idk() {
    this.httpClient
      .get(
        'https://dawa.aws.dk/autocomplete?fuzzy=&q=hasselvej&startfra=adresse&per_side=6'
      )
      .pipe(map((res) => res.toString()))
      .subscribe((data) => console.log(data));
  }

  save(routeRequest: routeRequest): void {
    this.httpClient
      .post<routeRequest>(
        'http://localhost:8080/api/generateRoute',
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
}
