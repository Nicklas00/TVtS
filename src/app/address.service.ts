import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from './Address';
import { Coordinate } from 'ol/coordinate';
import { ReverseAddress } from './ReverseAddress';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private autoCompleteURL = '/autocomplete?fuzzy=&q=%%query%%&startfra=adresse&per_side=6';
  private reverseAddressURL = '/adgangsadresser/reverse?x=%%x%%&y=%%y%%&srid=4326&struktur=mini';
  constructor(private http: HttpClient) {}

  getAddressAutocomplete(searchQuery: string): Observable<Address[]> {
    return this.http.get<Address[]>(
      this.autoCompleteURL.replace('%%query%%', searchQuery)
    );
  }

  getAddressByCoordinates(coords: Coordinate): Observable<ReverseAddress> {
    return this.http.get<ReverseAddress>(
      this.reverseAddressURL.replace('%%x%%', '' + coords[0]).replace('%%y%%', '' + coords[1])
    );
  }
}
