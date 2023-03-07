import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { BehaviorSubject, map } from 'rxjs';
import { mouseCoordinateConverter } from 'src/openlayers-tools/mouse-events';
import { Address } from './Address';
import { AddressService } from './address.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  readonly emptyAddress = {
    data: {
      x: 0,
      y: 0,
    },
    forslagstekst: '',
  };

  public destination: BehaviorSubject<Address> = new BehaviorSubject<Address>(
    this.emptyAddress
  );
  public origin: BehaviorSubject<Address> = new BehaviorSubject<Address>(
    this.emptyAddress
  );
  public originEmptyState = false;
  public destEmptyState = false;
  constructor(
    private mapService: MapService,
    private addressService: AddressService
  ) {
    mapService.mouseEvents.clicks
      .pipe(map(mouseCoordinateConverter('CRS:84')))
      .subscribe((coords) => {
        this.newCoords(coords);
      });

    this.origin.asObservable().subscribe((address) => {
      if (address.data.x === 0 && address.data.y === 0) {
        this.originEmptyState = true;
      } else {
        this.originEmptyState = false;
      }
    });

    this.destination.asObservable().subscribe((address) => {
      if (address.data.x === 0 && address.data.y === 0) {
        this.destEmptyState = true;
      } else {
        this.destEmptyState = false;
      }
    });
  }

  newCoords(coords: Coordinate) {
    if (this.destEmptyState) {
      this.addressService
        .getAddressByCoordinates(coords)
        .subscribe((reverseAddress) => {
          const address = {
            data: {
              x: reverseAddress.x,
              y: reverseAddress.y,
            },
            forslagstekst: reverseAddress.betegnelse,
          };
          this.destination.next(address);
        });
    } else if (this.originEmptyState) {
      this.addressService
        .getAddressByCoordinates(coords)
        .subscribe((reverseAddress) => {
          const address = {
            data: {
              x: reverseAddress.x,
              y: reverseAddress.y,
            },
            forslagstekst: reverseAddress.betegnelse,
          };
          this.origin.next(address);
        });
    }
  }

  remove() {
    this.origin.next(this.emptyAddress);
    this.destination.next(this.emptyAddress);
  }

  switch() {
    const address1 = this.origin.getValue();
    const address2 = this.destination.getValue();

    this.origin.next(address2);
    this.destination.next(address1);
  }

  setOrigin(address: Address) {
    this.origin.next(address);
  }

  setDestination(address: Address) {
    this.destination.next(address);
  }
}
