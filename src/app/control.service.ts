import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Address } from './Address';
import { AddressService } from './address.service';
import { MapService } from './map.service';
import { Route } from './Route';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  public routeObject: BehaviorSubject<Route> = new BehaviorSubject<Route>({
    resultId: undefined,
    destination: undefined,
    origin: undefined,
    mode: 1,
    features: [],
    setRoute: false,
  });

  originAddressDesc: Observable<string | undefined>;
  destinationAddressDesc: Observable<string | undefined>;
  modeDesc: Observable<string>;
  anyAddressSet: Observable<Boolean>;

  constructor(
    private addressService: AddressService,
    private mapService: MapService
  ) {
    addressService.address.subscribe((address: Address) => {
      this.newAddress(address);
    });

    mapService.featureEvents.features.subscribe((features: any) => {
      const route = this.routeObject.getValue();
      route.features = features;
      this.routeObject.next(route);
    });

    this.originAddressDesc = this.routeObject
      .asObservable()
      .pipe(switchMap(this.routeToAddressDescriptionConverter('origin')));

    this.destinationAddressDesc = this.routeObject
      .asObservable()
      .pipe(switchMap(this.routeToAddressDescriptionConverter('destination')));

    this.modeDesc = this.routeObject
      .asObservable()
      .pipe(switchMap(this.routeToModeDescriptionConverter()));

    this.anyAddressSet = this.routeObject
      .asObservable()
      .pipe(switchMap(this.routeToAnyAddressBooleanConverter()));
  }

  routeToModeDescriptionConverter(): (e: Route) => Observable<string> {
    let res = '';
    return (e) => {
      switch (e.mode) {
        case 1:
          res = 'Fodgænger';
          break;
        case 2:
          res = 'Cykel';
          break;
        default:
          break;
      }
      return new BehaviorSubject<string>(res).asObservable();
    };
  }

  routeToAddressDescriptionConverter(
    x: string
  ): (e: Route) => Observable<string | undefined> {
    return (e) => {
      if (x === 'origin') {
        if (e.origin) {
          return new BehaviorSubject<string | undefined>(
            e.origin?.forslagstekst
          ).asObservable();
        } else {
          return new BehaviorSubject<string | undefined>(
            undefined
          ).asObservable();
        }
      } else {
        if (e.destination) {
          return new BehaviorSubject<string | undefined>(
            e.destination?.forslagstekst
          ).asObservable();
        } else {
          return new BehaviorSubject<string | undefined>(
            undefined
          ).asObservable();
        }
      }
    };
  }

  routeToAnyAddressBooleanConverter(): (e: Route) => Observable<Boolean> {
    return (e) => {
      if (e.origin || e.destination) {
        return new BehaviorSubject<Boolean>(true).asObservable();
      } else {
        return new BehaviorSubject<Boolean>(false).asObservable();
      }
    };
  }

  newAddress(address: Address) {
    if (!this.routeObject.getValue().destination) {
      this.setDestination(address);
    } else if (!this.routeObject.getValue().origin) {
      this.setOrigin(address);
    }
  }

  remove() {
    const route = this.routeObject.getValue();

    route.origin = undefined;
    route.destination = undefined;

    route.setRoute = false;

    this.routeObject.next(route);
  }

  switch() {
    const route = this.routeObject.getValue();

    const address1 = this.routeObject.getValue().origin;
    const address2 = this.routeObject.getValue().destination;
    route.origin = address2;
    route.destination = address1;

    this.routeObject.next(route);
  }

  setOrigin(address: Address) {
    const route = this.routeObject.getValue();

    route.origin = address;

    this.routeObject.next(route);
  }

  setDestination(address: Address) {
    const route = this.routeObject.getValue();

    route.destination = address;

    this.routeObject.next(route);
  }

  changeMode() {
    const route = this.routeObject.getValue();

    if (route.mode === 1) {
      route.mode = 2;
    } else {
      route.mode = 1;
    }

    this.routeObject.next(route);
  }

  setRoute() {
    const route = this.routeObject.getValue();

    route.setRoute = true;

    this.routeObject.next(route);
  }

  removeRoute() {
    const route = this.routeObject.getValue();

    route.setRoute = false;

    this.routeObject.next(route);
  }
}
