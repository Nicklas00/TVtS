import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  retry,
  switchMap,
} from 'rxjs';
import { Address } from './Address';
import { Coordinate } from 'ol/coordinate';
import { ReverseAddress } from './ReverseAddress';
import { MapService } from './map.service';
import { mouseCoordinateConverter } from 'src/openlayers-tools/mouse-events';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private autoCompleteURL =
    '/autocomplete?fuzzy=&q=%%QUERY%%&startfra=adresse&per_side=6';
  private reverseAddressURL =
    '/adgangsadresser/reverse?x=%%X%%&y=%%Y%%&srid=4326&struktur=mini';

  address: Observable<Address> = new Observable(undefined);

  constructor(private http: HttpClient, private mapService: MapService) {
    this.address = mapService.mouseEvents.clicks
      .pipe(map(mouseCoordinateConverter('CRS:84')))
      .pipe(switchMap((coords) => this.getAddressByCoordinates(coords)))
      .pipe(
        map((reverseAddress) => {
          return {
            data: {
              x: reverseAddress.x,
              y: reverseAddress.y,
            },
            forslagstekst: reverseAddress.betegnelse,
          };
        })
      );
  }

  getAddressAutocomplete(searchQuery: string): Observable<Address[]> {
    return this.http.get<Address[]>(
      this.autoCompleteURL.replace('%%QUERY%%', searchQuery)
    );
  }

  getAddressByCoordinates(coords: Coordinate): Observable<ReverseAddress> {
    return this.http
      .get<ReverseAddress>(
        this.reverseAddressURL
          .replace('%%X%%', '' + coords[0])
          .replace('%%Y%%', '' + coords[1])
      )
      .pipe(
        retry(1),
        catchError((err) => {
          return new BehaviorSubject<ReverseAddress>({
            x: coords[0],
            y: coords[1],
            betegnelse: 'Fejl: kunne ikke finde adresse',
          }).asObservable();
        })
      );
  }
}
