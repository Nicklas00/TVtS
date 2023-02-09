import { Injectable } from '@angular/core';
import { epsg } from '../openlayers-tools/epsg';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createWmtsLayer } from '../openlayers-tools/wmts-builder';
import { defaults } from 'ol/interaction';
import { Feature, Map, View } from 'ol';
import { transform } from 'ol/proj';
import { ImageWMS } from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import {
  mouseCoordinateConverter,
  MouseEvents,
} from '../openlayers-tools/mouse-events';
import { map } from 'rxjs/internal/operators/map';
import { FeatureEvents } from '../openlayers-tools/feature-events';

import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import OSM from 'ol/source/OSM';
import { Geometry } from 'ol/geom';
import BaseLayer from 'ol/layer/Base';

@Injectable({ providedIn: 'root' })
export class MapService {
  map: Map | undefined;
  testp: Feature<Geometry> | undefined;
  vectorSource: VectorSource<Geometry> | undefined;
  vectorLayer: BaseLayer | undefined;
  rasterLayer: any;

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
    this.testp = new Feature({
      geometry: new Point(fromLonLat([12.540444310020543, 55.670013312732465])),
    });

    this.testp.setStyle(
      new Style({
        image: new Icon({
          color: '#8959A8',
          crossOrigin: 'anonymous',
          src: 'assets/marker/marker-blue.png',
          imgSize: [20, 20],
        }),
      })
    );

    this.vectorSource = new VectorSource({
      features: [this.testp],
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

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
            center: fromLonLat([12.540444310020543, 55.670013312732465]),
            zoom: 8,
          }),
        });

        const wmsSource = new ImageWMS({
          params: {
            LAYERS: 'topp:Kommuneinddeling',
            //prettier-ignore
            //CQL_FILTER: 'navn_tekst ilike \'%klatre%\'',
          },
          projection: 'EPSG:25832',
          url: 'http://localhost/geoserver/topp/wms?',
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
          .setSource(wmsSource, 'topp:Kommuneinddeling')
          .setMouseEvents(this.mouseEvents);
      }
    });
  }
}
