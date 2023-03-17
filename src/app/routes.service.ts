import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { transform } from 'ol/proj';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  switchMap,
} from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { ControlService } from './control.service';
import { MapService } from './map.service';
import { Route } from './Route';
import { routeRequest } from './routeRequest';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  routeRequest: Observable<routeRequest | undefined>;
  constructor(
    private httpClient: HttpClient,
    private mapService: MapService,
    private controlService: ControlService
  ) {
    controlService.routeObject.asObservable().subscribe((route) => {
      mapService.routeVectorSource.clear();
      if (route.features.length > 0) {
        const lineString25832 =
          route.features[0].get('geometry').flatCoordinates;
        const points = [];
        for (let i = 0; i < lineString25832.length; i += 2) {
          points.push(
            transform(
              [lineString25832[i], lineString25832[i + 1]],
              'EPSG:25832',
              'EPSG:3857'
            )
          );
        }

        const feature = new Feature({
          geometry: new LineString(points),
        });
        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#7fbffa',
              width: 5,
            }),
          })
        );
        mapService.routeVectorSource.addFeature(feature);
      }
    });

    this.routeRequest = controlService.routeObject
      .asObservable()
      .pipe(switchMap(this.routeToSummaryIdConverter()));

    this.routeRequest.subscribe((routeRequest) => {
      if (routeRequest) {
        mapService.routesSources2?.updateParams({
          cql_filter: 'summary_id=' + routeRequest.id,
        });
      } else {
        mapService.routesSources2?.updateParams({
          cql_filter: 'summary_id=' + 0,
        });
      }
    });
  }

  routeToSummaryIdConverter(): (
    e: Route
  ) => Observable<routeRequest | undefined> {
    return (e) => {
      if (e.destination && e.origin && e.setRoute) {
        let mode = '';
        if (e.mode === 1) {
          mode = 'pedestrian';
        } else {
          mode = 'bicycle';
        }

        return this.save({
          id: undefined,
          mode: mode,
          origin: {
            lat: e.origin.data.y,
            lon: e.origin.data.x,
          },
          destination: {
            lat: e.destination.data.y,
            lon: e.destination.data.x,
          },
          message: '',
        });
      } else {
        return new BehaviorSubject<undefined>(undefined).asObservable();
      }
    };
  }

  save(routeRequest: routeRequest): Observable<routeRequest> {
    return this.httpClient
      .post<routeRequest>('/api/generateRoute', routeRequest)
      .pipe(
        retry(1),
        catchError((err) => {
          return new BehaviorSubject<routeRequest>({
            id: undefined,
            mode: 'null',
            origin: {
              lat: routeRequest.origin.lat,
              lon: routeRequest.origin.lon,
            },
            destination: {
              lat: routeRequest.destination.lat,
              lon: routeRequest.destination.lon,
            },
            message: 'Fejl: Kunne ikke hente rute fra serveren.',
          }).asObservable();
        })
      );
  }
}
