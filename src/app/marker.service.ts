import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import { MapService } from './map.service';
import { Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { ControlService } from './control.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  public destinationCoordinates: Coordinate = [0, 0];
  public originCoordinates: Coordinate = [0, 0];
  public originEmptyState: Boolean = false;
  public destEmptyState: Boolean = false;

  constructor(
    private mapService: MapService,
    private controlService: ControlService
  ) {
    controlService.destination.asObservable().subscribe((address) => {
      this.destinationCoordinates = [address.data.x, address.data.y];
      this.setEmptyState(
        [address.data.x, address.data.y], 
        this.destEmptyState
      );
      this.setMarkers(mapService.markerSource!);
    });

    controlService.origin.asObservable().subscribe((address) => {
      this.originCoordinates = [address.data.x, address.data.y];
      this.setEmptyState(
        [address.data.x, address.data.y],
        this.originEmptyState
      );
      this.setMarkers(mapService.markerSource!);
    });
  }

  setEmptyState(coords: Coordinate, stateBool: Boolean) {
    if (coords[0] === 0 && coords[1] === 0) {
      stateBool = true;
    } else {
      stateBool = false;
    }
  }

  public setMarkers(vectorSource: VectorSource) {
    if(vectorSource === undefined) {
      return;
    }
    vectorSource.clear();

    if (this.destEmptyState === false) {
      const destMarker = new Feature({
        geometry: new Point(
          fromLonLat([
            this.destinationCoordinates[0],
            this.destinationCoordinates[1],
          ])
        ),
      });

      destMarker.setStyle(
        new Style({
          image: new Icon({
            color: '#F44336',
            src: '../assets/map-marker-black.png',
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
          fromLonLat([this.originCoordinates[0], this.originCoordinates[1]])
        ),
      });

      destMarker.setStyle(
        new Style({
          image: new Icon({
            //color: '#F44336',
            src: '../assets/dot-marker.png',
            imgSize: [40, 40],
            anchor: [0.5, 1],
          }),
        })
      );
      vectorSource.addFeature(destMarker);
    }
  }
}
