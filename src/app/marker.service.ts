import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import { MapService } from './map.service';
import { Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { ControlService } from './control.service';
import { Address } from './Address';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(
    private mapService: MapService,
    private controlService: ControlService
  ) {
    controlService.routeDefinition.subscribe((route) => {
      this.setMarkers(
        mapService.markerSource!,
        route.destination,
        route.origin
      );
    });
  }

  private setMarkers(
    vectorSource: VectorSource,
    destination: Address | undefined,
    origin: Address | undefined
  ) {
    if (vectorSource === undefined) {
      return;
    }
    vectorSource.clear();

    if (destination) {
      const destMarker = new Feature({
        geometry: new Point(
          fromLonLat([destination.data.x, destination.data.y])
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

    if (origin) {
      const destMarker = new Feature({
        geometry: new Point(fromLonLat([origin.data.x, origin.data.y])),
      });

      destMarker.setStyle(
        new Style({
          image: new Icon({
            //color: '#F44336',
            src: '../assets/dot-marker.png',
            imgSize: [40, 40],
            anchor: [0.5, 0.5],
            scale: 0.5,
          }),
        })
      );
      vectorSource.addFeature(destMarker);
    }
  }
}
