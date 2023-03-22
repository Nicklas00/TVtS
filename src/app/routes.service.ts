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
  debounceTime,
  distinctUntilChanged,
  Observable,
  retry,
  switchMap,
} from 'rxjs';
import { ControlService } from './control.service';
import { MapService } from './map.service';
import { Route } from './Route';
import { RouteRequest } from './RouteRequest';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  routeRequest: Observable<RouteRequest | undefined>;
  constructor(
    private httpClient: HttpClient,
    private mapService: MapService,
    private controlService: ControlService
  ) {
    controlService.features
      .pipe(debounceTime(200))
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return (
            prev.length === curr.length &&
            prev[0] === curr[0]
          );
        })
      )
      .subscribe((features) => {
        mapService.routeVectorSource.clear();
        if (features.length > 0) {
          const lineString25832 =
            features[0].get('geometry').flatCoordinates;
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

    this.routeRequest = controlService.routeDefinition
      .pipe(debounceTime(500))
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return (
            prev.destination === curr.destination &&
            prev.origin === curr.origin &&
            prev.mode === curr.mode &&
            prev.setRoute === curr.setRoute
          );
        })
      )
      .pipe(switchMap(this.routeToSummaryIdConverter()));

    this.routeRequest.subscribe((routeRequest) => {
      if (routeRequest) {
        mapService.routesSources?.updateParams({
          cql_filter: 'summary_id=' + routeRequest.id,
        });
      } else {
        mapService.routesSources?.updateParams({
          cql_filter: 'summary_id=' + 0,
        });
      }
    });
  }

  routeToSummaryIdConverter(): (
    e: Route
  ) => Observable<RouteRequest | undefined> {
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

  save(routeRequest: RouteRequest): Observable<RouteRequest> {
    return this.httpClient
      .post<RouteRequest>('/api/generateRoute', routeRequest)
      .pipe(
        retry(1),
        catchError((err) => {
          return new BehaviorSubject<RouteRequest>({
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
