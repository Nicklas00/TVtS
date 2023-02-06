import { ImageWMS, TileWMS } from 'ol/source';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { GeoJSON } from 'ol/format';
import Feature from 'ol/Feature';
import { MouseEvents } from './mouse-events';
import { checkNotUndefined } from '@northtech/ginnungagap';
import { MapBrowserEvent } from 'ol';
import { Geometry } from 'ol/geom';
/**
 * Converts mouse events (typically clicks) to Features by querying GetFeatureInfo for the given source.
 */
export class FeatureEvents {
  private source: ImageWMS | TileWMS | undefined;
  private queryLayers: string | undefined;
  private subscription: Subscription | undefined;
  private readonly format = new GeoJSON();
  private featuresSubject = new BehaviorSubject<Feature<Geometry>[]>([]);
  /**
   * An Observable of found Features. Each event on the stream corresponds to a mouse event. The data is an array of
   * Features, as a click can hit several features at once. (Or an empty array if nothing was hit).
   */
  features = this.featuresSubject.asObservable();
  private errorsSubject = new Subject<Error | TypeError | Response>();
  /**
   * We do not want (temporary network) errors to terminate the feature subscriptions, so we report errors on a separate
   * stream.
   */
  errors = this.errorsSubject.asObservable();
  /**
   * Sets the source to fetch features from.
   */
  setSource(
    source: ImageWMS | TileWMS | undefined,
    queryLayers: string | undefined
  ): this {
    this.source = source;
    this.queryLayers = queryLayers;
    return this;
  }
  /**
   * Sets the source of the mouse events which trigger fetching feature info.
   */
  setMouseEvents(
    mouseEvents: MouseEvents | Observable<MapBrowserEvent<MouseEvent>>
  ): this {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = (
      mouseEvents instanceof MouseEvents ? mouseEvents.clicks : mouseEvents
    ).subscribe((e) => {
      if (this.source && this.queryLayers) {
        const url = this.source.getFeatureInfoUrl(
          e.coordinate,
          checkNotUndefined(
            e.map.getView().getResolution(),
            'Cannot construct a .getFeatureInfoUrl when .getView().getResolution() is undefined'
          ),
          e.map.getView().getProjection(),
          {
            INFO_FORMAT: 'application/json',
            FEATURE_COUNT: 20,
            QUERY_LAYERS: this.queryLayers,
          }
        );
        fetch(
          checkNotUndefined(url, 'Could not construct a . getFeatureInfoUrl')
        )
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response;
          })
          .then((response) => response.text())
          .then((text) => this.format.readFeatures(text))
          .then((features) => {
            if (features?.length) {
              this.featuresSubject.next(features);
            } else {
              this.featuresSubject.next([]);
            }
          })
          .catch((error) => {
            this.featuresSubject.next([]);
            if (
              error instanceof Error ||
              error instanceof TypeError ||
              error instanceof Response
            ) {
              this.errorsSubject.next(error);
            } else {
              this.errorsSubject.next(new Error(error.toString()));
            }
          });
      }
    });
    return this;
  }
}
