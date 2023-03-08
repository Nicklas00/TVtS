import { Injectable } from '@angular/core';
import { epsg } from '../openlayers-tools/epsg';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createWmtsLayer } from '../openlayers-tools/wmts-builder';
import { defaults } from 'ol/interaction';
import { Feature, Map, View } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import { ImageWMS } from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import {
  mouseCoordinateConverter,
  MouseEvents,
} from '../openlayers-tools/mouse-events';
import { map } from 'rxjs/internal/operators/map';
import { FeatureEvents } from '../openlayers-tools/feature-events';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point';

@Injectable({ providedIn: 'root' })
export class MapService {
  readonly mouseEvents = new MouseEvents();
  markerSource: VectorSource | undefined;
  routesSources2: ImageWMS | undefined;
  pointsSource: ImageWMS | undefined;
  constructor() {
    epsg.forEach((def) => proj4.defs(def.srid, def.defs));
    register(proj4);
  }
  readonly featureEvents = new FeatureEvents();
  createMap(): void {
    createWmtsLayer(
      'https://tile.geoteamwork.com/service/wmts?REQUEST=getcapabilities',
      { layer: 'OSM_europe', format: 'image/png' }
    ).then((wmtsLayer) => {
      const source = wmtsLayer.getSource();
      const vectorSource = new VectorSource({});
      const accidentPointLayers = 'postgis:uag';
      const routesLayers = 'postgis:routes_detail';
      const epsgProjection4326 = 'EPSG:4326';
      const epsgProjection25832 = 'EPSG:25832';
      const layerURL = 'http://localhost:8080/geoserver/postgis/wms?';

      if (source) {
        const olMap = new Map({
          target: 'map',
          controls: [],
          interactions: defaults({
            altShiftDragRotate: false,
            pinchRotate: false,
          }),
          layers: [
            wmtsLayer,
            new VectorLayer({
              source: vectorSource,
              zIndex: 10
            }),
          ],
          view: new View({
            projection: source.getProjection()!,
            resolutions: source.getTileGrid()!.getResolutions(),
            zoom: 9,
          }),
        });

        const routesSource = this.createImageWMS(
          routesLayers,
          epsgProjection25832,
          layerURL,
          'summary_id=0'
        );
        this.routesSources2 = routesSource;
        
        const wmsSource = this.createImageWMS(
          accidentPointLayers,
          epsgProjection25832,
          layerURL,
          'id > 0'//'INTERSECTS(buffer(POINT(10.39033 55.39470), 100)'
        );
        this.pointsSource = wmsSource;

        this.addWMSToMap(olMap, wmsSource);
        this.addWMSToMap(olMap, routesSource);

        const squareAlvor = this.createImageWMS(
          'postgis:uag_alle_alvor',
          epsgProjection25832,
          layerURL,
          'id>0'
        )

        //this.addWMSToMap(olMap, squareAlvor);

        this.markerSource = vectorSource;

        // Hook up the MouseEvents handler with our actual map:
        this.mouseEvents.setMap(olMap);
      }
    });
  }

  public addWMSToMap(olMap: Map, imageWMS: ImageWMS) {
    olMap
      .getView()
      .setCenter(
        transform(
          [588061, 6139595],
          'EPSG:25832',
          olMap.getView().getProjection()
        )
      );
    olMap.addLayer(new ImageLayer({ source: imageWMS }));
  }

  public createImageWMS(
    layers: string,
    projection: string,
    url: string,
    cql_filter: string
  ): ImageWMS {
    const wmsSource = new ImageWMS({
      params: {
        LAYERS: layers,
        CQL_FILTER: cql_filter
      },
      projection: projection,
      url: url,
    });
    return wmsSource;
  }

  
}
