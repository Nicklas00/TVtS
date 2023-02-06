import { Injectable } from '@angular/core';
import { epsg } from '../openlayers-tools/epsg';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createWmtsLayer } from '../openlayers-tools/wmts-builder';
import { defaults } from 'ol/interaction';
import { Map, View } from 'ol';
import { transform } from 'ol/proj';
import { ImageWMS } from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import {
  mouseCoordinateConverter,
  MouseEvents,
} from '../openlayers-tools/mouse-events';
import { map } from 'rxjs/internal/operators/map';
import { FeatureEvents } from '../openlayers-tools/feature-events';

@Injectable({ providedIn: 'root' })
export class MapService {
  readonly mouseEvents = new MouseEvents();
  constructor() {
    epsg.forEach((def) => proj4.defs(def.srid, def.defs));
    register(proj4);
    // Demo output of the clicked coordinates. Notice that the MouseEvents object and its observables are available immediately,
    // even though it has not yet been hooked up to a map creating actual click events:
    this.mouseEvents.clicks
      .pipe(map(mouseCoordinateConverter('CRS:84')))
      .subscribe((coords) => console.log('clicked CRS:84', coords));
    this.mouseEvents.clicks
      .pipe(map(mouseCoordinateConverter('EPSG:25832')))
      .subscribe((coords) => console.log('clicked EPSG:25832', coords));
  }
  readonly featureEvents = new FeatureEvents();
  createMap(): void {
    createWmtsLayer(
      'https://tile.geoteamwork.com/service/wmts?REQUEST=getcapabilities',
      { layer: 'OSM_europe', format: 'image/png' }
    ).then((wmtsLayer) => {
      const source = wmtsLayer.getSource();

      if (source) {
        const olMap = new Map({
          target: 'map',
          controls: [],
          interactions: defaults({
            altShiftDragRotate: false,
            pinchRotate: false,
          }),
          layers: [wmtsLayer],
          view: new View({
            projection: source.getProjection()!,
            resolutions: source.getTileGrid()!.getResolutions(),
            zoom: 8,
          }),
        });
        const wmsSource = new ImageWMS({
          params: {
            LAYERS: 'northtech:cvrgeokodet',
            //prettier-ignore
            CQL_FILTER: 'navn_tekst ilike \'%klatre%\'',
          },
          projection: 'EPSG:900913',
          url: 'https://gs.demo.geoteamwork.com/northtech/wms?',
        });

        olMap
          .getView()
          .setCenter(
            transform(
              [721371, 6174352],
              'EPSG:25832',
              olMap.getView().getProjection()
            )
          );
        olMap.addLayer(new ImageLayer({ source: wmsSource }));
        // Hook up the MouseEvents handler with our actual map:
        this.mouseEvents.setMap(olMap);
        // Hook up the FeatureEvent to the layer we want to listen to:
        this.featureEvents
          .setSource(wmsSource, 'northtech:cvrgeokodet')
          .setMouseEvents(this.mouseEvents);
      }
    });
  }
}
