import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { transform } from 'ol/proj';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { ControlService } from './control.service';
import { MapService } from './map.service';
import { routeRequest } from './routeRequest';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  readonly summarySubject = new ReplaySubject<routeRequest>(1);
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
  }

  save(routeRequest: routeRequest): void {
    this.httpClient
      .post<routeRequest>('/api/generateRoute', routeRequest)
      .subscribe({
        next: (responseData) => {
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
      },
    });
  }
}
