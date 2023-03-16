import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from './Address';
import { AddressService } from './address.service';
import { MapService } from './map.service';
import { Route } from './Route';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  public routeObject: BehaviorSubject<Route> = new BehaviorSubject<Route>({
    id: undefined,
    destination: undefined,
    origin: undefined,
    mode: 'pedestrian',
    features: [],
  });

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
}
