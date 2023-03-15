import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  switchMap,
} from 'rxjs';
import { Address } from './Address';
import { Coordinate } from 'ol/coordinate';
import { ReverseAddress } from './ReverseAddress';
import { MapService } from './map.service';
import {
  get,
  getTransform,
  Projection,
  ProjectionLike,
  TransformFunction,
} from 'ol/proj';
import { MapBrowserEvent } from 'ol';

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
    this.address = mapService.mouseEvents.clicks.pipe(
      switchMap(this.mouseAddressConverter('CRS:84'))
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

  mouseAddressConverter(
    targetProjectionLike: ProjectionLike
  ): (e: MapBrowserEvent<MouseEvent>) => Observable<Address> {
    const targetProjection = get(targetProjectionLike);
    if (!targetProjection) {
      throw new Error(
        'No Proj4 definition registered for ' +
          (targetProjectionLike instanceof Projection
            ? targetProjectionLike.getCode()
            : targetProjectionLike)
      );
    }
    let lastKnownViewProjection: Projection | undefined;
    let transform: TransformFunction;
    return (e) => {
      const viewProjection = e!.map.getView().getProjection();
      if (viewProjection !== lastKnownViewProjection) {
        lastKnownViewProjection = viewProjection;
        transform =
          viewProjection === targetProjection
            ? (c) => c
            : getTransform(viewProjection, targetProjection);
      }
      return this.getAddressByCoordinates(
        transform(e.coordinate, undefined, undefined) as Coordinate
      ).pipe(
        switchMap((reverseAddress) => {
          return new BehaviorSubject<Address>({
            data: {
              x: reverseAddress.x,
              y: reverseAddress.y,
            },
            forslagstekst: reverseAddress.betegnelse,
          } as Address).asObservable();
        })
      );
    };
  }
}
