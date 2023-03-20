import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { Address } from '../Address';
import { AddressService } from '../address.service';
import { ControlService } from '../control.service';
import { MapService } from '../map.service';
import { RoutesService } from '../routes.service';
import { faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-routes-setting',
  templateUrl: './routes-setting.component.html',
  styleUrls: ['./routes-setting.component.css'],
})
export class RoutesSettingComponent {
  faRightLeft = faRightLeft;
  faRepeat = faRepeat;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;


  originControl = new FormControl('');
  destControl = new FormControl('');
  originOptions: Observable<Address[]>;
  destOptions: Observable<Address[]>;

  constructor(
    private routesService: RoutesService,
    private mapService: MapService,
    public controlService: ControlService,
    private addressService: AddressService
  ) {
    this.originOptions = this.originControl.valueChanges.pipe(
      startWith('Odense'),
      switchMap((value) => addressService.getAddressAutocomplete(value!))
    );

    this.destOptions = this.destControl.valueChanges.pipe(
      startWith('Odense'),
      switchMap((value) => addressService.getAddressAutocomplete(value!))
    );

    controlService.routeObject.asObservable().subscribe((route) => {
      if (
        route.origin &&
        this.originControl.value === route.origin.forslagstekst
      ) {
      } else if (route.origin) {
        this.originControl.patchValue(route.origin.forslagstekst);
      } else {
        this.originControl.patchValue('');
      }

      if (
        route.destination &&
        this.destControl.value === route.destination.forslagstekst
      ) {
      } else if (route.destination) {
        this.destControl.patchValue(route.destination.forslagstekst);
      } else {
        this.destControl.patchValue('');
      }
    });
  }

  selectOrigin(address: Address) {
    this.controlService.setOrigin(address);
    this.originControl.patchValue(address.forslagstekst);
  }

  selectDest(address: Address) {
    this.controlService.setDestination(address);
    this.destControl.patchValue(address.forslagstekst);
  }

  route() {
    this.controlService.setRoute();
  }

  exit() {
    this.controlService.remove();
  }

  switchAddresses() {
    this.controlService.switch();
  }
}
