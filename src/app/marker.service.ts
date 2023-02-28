import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import { map } from 'rxjs/internal/operators/map';
import { mouseCoordinateConverter } from 'src/openlayers-tools/mouse-events';
import { MapService } from './map.service';
import { Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point';
import { Feature, Map, View } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  public destinationCoordinates: BehaviorSubject<Coordinate>;
  public originCoordinates: BehaviorSubject<Coordinate>;
  public originEmptyState = false;
  public destEmptyState = false;

  constructor(private mapService: MapService) {
    this.destinationCoordinates = new BehaviorSubject<Coordinate>([0, 0]);
    this.originCoordinates = new BehaviorSubject<Coordinate>([0, 0]);

    mapService.mouseEvents.clicks
      .pipe(map(mouseCoordinateConverter('CRS:84')))
      .subscribe((coords) => {
        this.newCoords(coords);
      });

    this.originCoordinates.asObservable().subscribe((coords) => {
      if (coords[0] === 0 && coords[1] === 0) {
        this.originEmptyState = true;
      } else {
        this.originEmptyState = false;
      }
    });

    this.destinationCoordinates.asObservable().subscribe((coords) => {
      if (coords[0] === 0 && coords[1] === 0) {
        this.destEmptyState = true;
      } else {
        this.destEmptyState = false;
      }
    });
  }

  public switchMarkers() {
    const coords1 = this.originCoordinates.getValue();
    const coords2 = this.destinationCoordinates.getValue();

    this.originCoordinates.next(coords2);
    this.destinationCoordinates.next(coords1);
  }

  public removeMarkers() {
    this.destinationCoordinates.next([0, 0]);
    this.originCoordinates.next([0, 0]);
    this.setMarkers(this.mapService.markerSource!);
  }

  private newCoords(coords: Coordinate) {
    if (this.destEmptyState) {
      this.destinationCoordinates.next(coords);
    } else if (this.originEmptyState) {
      this.originCoordinates.next(coords);
    }
    this.setMarkers(this.mapService.markerSource!);
  }

  public setMarkers(vectorSource: VectorSource) {
    vectorSource.clear();

    if (this.destEmptyState === false) {
      const destMarker = new Feature({
        geometry: new Point(
          fromLonLat([
            this.destinationCoordinates.getValue()[0],
            this.destinationCoordinates.getValue()[1],
          ])
        ),
      });

      destMarker.setStyle(
        new Style({
          image: new Icon({
            color: '#F44336',
            src: '../assets/map-marker-red.png',
            imgSize: [40, 40],
            anchor: [0.5, 1],
          }),
        })
      );
      vectorSource.addFeature(destMarker);
    }

    if (this.originEmptyState === false) {
      const destMarker = new Feature({
        geometry: new Point(
          fromLonLat([
            this.originCoordinates.getValue()[0],
            this.originCoordinates.getValue()[1],
          ])
        ),
      });

      destMarker.setStyle(
        new Style({
          image: new Icon({
            //color: '#F44336',
            src: '../assets/map-marker-green.png',
            imgSize: [40, 40],
            anchor: [0.5, 1],
          }),
        })
      );
      vectorSource.addFeature(destMarker);
    }
  }
}
