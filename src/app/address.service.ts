import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Address } from './adress';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private autoCompleteURL =
    'https://dawa.aws.dk/autocomplete?fuzzy=&q=%%query%%&startfra=adresse&per_side=6';
  constructor(private http: HttpClient) {}

  //getGreeting(searchQuery: string): Observable<Address[]> {return this.http.get<Address[]>('http://localhost:8080/api/test')};
  getGreeting(searchQuery: string): Observable<Address[]> {return this.http.get<Address[]>(this.autoCompleteURL.replace('%%query%%', searchQuery))};
}
