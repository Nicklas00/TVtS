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
      const accidentPointLayers = 'postgis:accident_points';
      const routesLayers = 'postgis:routes';
      const epsgProjection4326 = 'EPSG:4326';
      const layerURL = 'http://localhost/geoserver/postgis/wms?';

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
            }),
          ],
          view: new View({
            projection: source.getProjection()!,
            resolutions: source.getTileGrid()!.getResolutions(),
            zoom: 8,
          }),
        });
        
        const routesSource = this.createImageWMS(routesLayers,epsgProjection4326, layerURL);
        const wmsSource = this.createImageWMS(accidentPointLayers,epsgProjection4326, layerURL);
        
        this.addWMSToMap(olMap, wmsSource);
        this.addWMSToMap(olMap, routesSource);

        this.addPointer(vectorSource);

        // Hook up the MouseEvents handler with our actual map:
        this.mouseEvents.setMap(olMap);
      }
    });
  }

  public addWMSToMap(olMap:Map, imageWMS:ImageWMS){
    olMap.getView().setCenter(
      transform(
        [588061, 6139595],
        'EPSG:25832',
        olMap.getView().getProjection()
      )
    );
    olMap.addLayer(new ImageLayer({ source: imageWMS }));
  }

  public createImageWMS(layers: string, projection: string, url: string): ImageWMS{
    const wmsSource = new ImageWMS({
      params: {
        LAYERS: layers,
      },
      projection: projection,
      url: url,
    });
    return wmsSource;
  }

  public addPointer(vectorSource: VectorSource){
  let markerCount = 0;

        this.mouseEvents.clicks
          .pipe(map(mouseCoordinateConverter('CRS:84')))
          .subscribe((coords) => {
            const testp = new Feature({
              geometry: new Point(fromLonLat([coords[0], coords[1]])),
            });

            testp.setStyle(
              new Style({
                image: new Icon({
                  color: '#F44336',
                  src: '../assets/map-marker.png',
                  imgSize: [40, 40],
                }),
              })
            );
            if (markerCount < 2) {
              vectorSource.addFeature(testp);
              markerCount += 1;
            } else {
              vectorSource.clear();
              markerCount = 0;
            }
          });
        }

  
}
