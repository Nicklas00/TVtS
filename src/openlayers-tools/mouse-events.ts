import { Observable, Subject } from 'rxjs';
import { Map, MapBrowserEvent } from 'ol';
import { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import { get, getTransform, ProjectionLike, TransformFunction } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import Projection from 'ol/proj/Projection';
/**
 * This converts the OpenLayers mouse events to Observables, making them easily accessible/mappable in a Reactive style.
 */
export class MouseEvents {
  private readonly clicksSubject = new Subject<MapBrowserEvent<MouseEvent>>();
  private readonly movesSubject = new Subject<
    MapBrowserEvent<MouseEvent> | undefined
  >();
  private clickHandle: EventsKey | EventsKey[] | undefined;
  private moveHandle: EventsKey | EventsKey[] | undefined;
  private targetHandle: EventsKey | EventsKey[] | undefined;
  private currentMapTarget: Element | undefined;
  /**
   * An Observable of MapBrowserEvent representing clicks.
   */
  readonly clicks: Observable<MapBrowserEvent<MouseEvent>> =
    this.clicksSubject.asObservable();
  /**
 * An Observable of MapBrowserEvent representing mouse moves, emitting `undefined` when the cursor passes outside the map.
 */
  readonly moves: Observable<MapBrowserEvent<MouseEvent> | undefined> =
    this.movesSubject.asObservable();
  /**
 * Registers a given map to provide the events. Registering a new map will automatically de-register the previous.
 */
  setMap(map: Map): this {
    // De-register existing click- and move listeners...
    if (this.clickHandle) {
      unByKey(this.clickHandle);
    }
    if (this.moveHandle) {
      unByKey(this.moveHandle);
    }
    // ...and register new ones on the new map:
    // (We *could* set this up as a cold observable, only connecting the ol events when we have a subscriber, but
    // realistically, that would be a lot of boilerplate for no gain, and possibly even a loss as event handlers are set
    // up and torn down excessively).
    this.clickHandle = map.on('click', (e: MapBrowserEvent<MouseEvent>) =>
      this.clicksSubject.next(e)
    );
    this.moveHandle = map.on('pointermove', (e: MapBrowserEvent<MouseEvent>) =>
      this.movesSubject.next(e)
    );
    // Track mouse-out on the HTML element which contains the map:
    const signalMouseOut = () => {
      this.movesSubject.next(undefined);
    };
    // Switch the mouseout event handler to the new map's HTML element:
    const setMouseOutOnTarget = () => {
      if (this.currentMapTarget) {
        this.currentMapTarget.removeEventListener('mouseout', signalMouseOut);
      }
      const target = map.getTargetElement();
      if (target) {
        target.addEventListener('mouseout', signalMouseOut);
      }
      this.currentMapTarget = target;
    };
    // De- and re-register a listener for the map changing target HTML
    element: if (this.targetHandle) {
      unByKey(this.targetHandle);
    }
    this.targetHandle = map.on('change:target', () => {
      setMouseOutOnTarget();
    });
    setMouseOutOnTarget();
    return this;
  }
}
/**
 * Creates a function which maps the coordinates in a MapBrowserEvent to coordinates in a given CRS, automatically
 * taking into account with the map view's CRS is.
 *
 * @example
 *
 * this.mapService.mouseEvents.clicks.pipe(
 * map(mouseCoordinateConverter('epsg:25832'))
 * )
 *
 * If the event can be undefined (such as when using the {@link MouseEvents.moves}), wrap the function in a null-safe
 * wrapper, e.g. using Ginnungagap:
 *
 * @example
 *
 * this.mapService.mouseEvents.moves.pipe(
 * map(nullSafe(mouseCoordinateConverter('epsg:25832')))
 * )
 */
export function mouseCoordinateConverter(
  targetProjectionLike: ProjectionLike
): (e: MapBrowserEvent<MouseEvent>) => Coordinate {
  const targetProjection = get(targetProjectionLike);
  if (!targetProjection) {
    throw new Error(
      'No Proj4 definition registered for ' +
        (targetProjectionLike instanceof Projection
          ? targetProjectionLike.getCode()
          : targetProjectionLike)
    );
  }
  let lastKnownViewProjection: Projection | undefined;
  let transform: TransformFunction;
  return (e) => {
    const viewProjection = e.map.getView().getProjection();
    if (viewProjection !== lastKnownViewProjection) {
      lastKnownViewProjection = viewProjection;
      transform =
        viewProjection === targetProjection
          ? (c) => c
          : getTransform(viewProjection, targetProjection);
    }
    return transform(e.coordinate, undefined, undefined) as Coordinate;
  };
}
