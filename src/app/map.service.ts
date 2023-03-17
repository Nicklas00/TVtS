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
import { MouseEvents } from '../openlayers-tools/mouse-events';
import { FeatureEvents } from '../openlayers-tools/feature-events';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Injectable({ providedIn: 'root' })
export class MapService {
  readonly mouseEvents = new MouseEvents();
  markerSource: VectorSource | undefined;
  routesSources: ImageWMS = new ImageWMS();
  pointsSource: ImageWMS | undefined;
  gridSource: ImageWMS | undefined;
  routeVectorSource = new VectorSource();
  testMap: Map = new Map();
  idkMap = new Map();
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
      const epsgProjection25832 = 'EPSG:25832';
      const layerURL = '/postgis/wms?';
      const gridLayer = 'postgis:uag_alle';

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
              zIndex: 10,
            }),
            new VectorLayer({
              source: this.routeVectorSource,
              zIndex: 11,
            })
          ],
          view: new View({
            projection: source.getProjection()!,
            resolutions: source.getTileGrid()!.getResolutions(),
            zoom: 9,
          }),
        });
        olMap
          .getView()
          .setCenter(
            transform(
              [588061, 6139595],
              'EPSG:25832',
              olMap.getView().getProjection()
            )
          );
        this.testMap = olMap;

        const routesSource = this.createImageWMS(
          routesLayers,
          epsgProjection25832,
          layerURL,
          'summary_id=0'
        );
        this.routesSources = routesSource;

        this.featureEvents
          .setSource(routesSource, 'postgis:routes_detail')
          .setMouseEvents(this.mouseEvents);

        const wmsSource = this.createImageWMS(
          accidentPointLayers,
          epsgProjection25832,
          layerURL,
          'id > 0'
        );
        this.pointsSource = wmsSource;

        const gridLayerSource = this.createImageWMS(
          gridLayer,
          epsgProjection25832,
          layerURL,
          "id > 0"
        );

        this.gridSource = gridLayerSource;
        this.addWMSToMap(olMap, wmsSource, 'AP', 5);
        this.addWMSToMap(olMap, routesSource, 'routes', 9);

        this.markerSource = vectorSource;

        // Hook up the MouseEvents handler with our actual map:
        this.mouseEvents.setMap(olMap);
      }
    });
  }

  public addWMSToMap(
    olMap: Map,
    imageWMS: ImageWMS,
    key: string,
    setZindex: number
  ) {
    const layer = new ImageLayer({ source: imageWMS, zIndex: setZindex });
    this.idkMap.set(key, layer);
    olMap.addLayer(layer);
  }

  public removeWMSToMap(olMap: Map, key: string) {
    olMap.removeLayer(this.idkMap.get(key));
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
        CQL_FILTER: cql_filter,
      },
      projection: projection,
      url: url,
    });
    return wmsSource;
  }
}
