import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import { Address } from './Address';
import { AddressService } from './address.service';
import { MapService } from './map.service';
import { Route } from './Route';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  private resultIdX: BehaviorSubject<number | undefined> = new BehaviorSubject<
    number | undefined
  >(undefined);
  private destinationX: BehaviorSubject<Address | undefined> =
    new BehaviorSubject<Address | undefined>(undefined);
  private originX: BehaviorSubject<Address | undefined> = new BehaviorSubject<
    Address | undefined
  >(undefined);
  private modeX: BehaviorSubject<number> = new BehaviorSubject(1);
  private featuresX: BehaviorSubject<Feature[]> = new BehaviorSubject<
    Feature[]
  >([]);
  private setRouteBoolX: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public routeTest: Observable<Route>;

  public routeDefinition: Observable<Route>;

  public originAddressDesc: Observable<string | undefined>;
  public destinationAddressDesc: Observable<string | undefined>;
  public modeDesc: Observable<string>;
  public anyAddressSet: Observable<Boolean>;

  public features = this.featuresX.asObservable();

  private mouseAddressSubscription: Subscription | undefined;

  constructor(
    private addressService: AddressService,
    private mapService: MapService
  ) {
    this.routeTest = combineLatest(
      [
        this.resultIdX,
        this.destinationX,
        this.originX,
        this.modeX,
        this.featuresX,
        this.setRouteBoolX,
      ],
      (resultId, destination, origin, mode, features, setRoute) => {
        return {
          resultId: resultId,
          destination: destination,
          origin: origin,
          mode: mode,
          features: features,
          setRoute: setRoute,
        };
      }
    );

    this.routeDefinition = combineLatest(
      [this.destinationX, this.originX, this.modeX, this.setRouteBoolX],
      (destination, origin, mode, setRouteBool) => {
        return {
          resultId: -1,
          destination: destination,
          origin: origin,
          mode: mode,
          features: [],
          setRoute: setRouteBool,
        };
      }
    );

    this.routeDefinition.subscribe((route) => {
      if (route.destination && route.origin) {
        if (this.mouseAddressSubscription) {
          this.mouseAddressSubscription.unsubscribe();
          this.mouseAddressSubscription = undefined;
        }
      } else {
        if (!this.mouseAddressSubscription) {
          this.mouseAddressSubscription = addressService.address.subscribe(
            (address: Address) => {
              this.newAddress(address);
            }
          );
        }
      }
    });

    mapService.featureEvents.features.subscribe((features: any) => {
      this.featuresX.next(features);
    });

    this.originAddressDesc = this.routeTest.pipe(
      map((routeObject) =>
        this.routeToAddressDescriptionConverter(routeObject, 'origin')
      )
    );

    this.destinationAddressDesc = this.routeTest.pipe(
      map((routeObject) =>
        this.routeToAddressDescriptionConverter(routeObject, 'destination')
      )
    );

    this.modeDesc = this.routeTest.pipe(
      map((routeObject) => {
        switch (routeObject.mode) {
          case 1:
            return 'Fodgænger';
          case 2:
            return 'Cykel';
          default:
            return '';
        }
      })
    );

    this.anyAddressSet = this.routeTest.pipe(
      map((routeObject) => {
        if (routeObject.origin || routeObject.destination) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  private routeToAddressDescriptionConverter(
    e: Route,
    x: string
  ): string | undefined {
    if (x === 'origin') {
      if (e.origin) {
        return e.origin.forslagstekst;
      } else {
        return undefined;
      }
    } else {
      if (e.destination) {
        return e.destination.forslagstekst;
      } else {
        return undefined;
      }
    }
  }

  public newAddress(address: Address) {
    if (!this.destinationX.getValue()) {
      this.setDestination(address);
    } else if (!this.originX.getValue()) {
      this.setOrigin(address);
    }
  }

  public remove() {
    this.destinationX.next(undefined);
    this.originX.next(undefined);
    this.setRouteBoolX.next(false);
  }

  public switch() {
    const originAddress = this.originX.getValue();
    const destAddress = this.destinationX.getValue();

    this.originX.next(destAddress);
    this.destinationX.next(originAddress);
  }

  public setOrigin(address: Address) {
    this.originX.next(address);
  }

  public setDestination(address: Address) {
    this.destinationX.next(address);
  }

  public changeMode() {
    if (this.modeX.getValue() === 1) {
      this.modeX.next(2);
    } else {
      this.modeX.next(1);
    }
  }

  public setRoute() {
    this.setRouteBoolX.next(true);
  }

  public removeRoute() {
    this.setRouteBoolX.next(false);
  }
}
