import { Component, Input } from '@angular/core';
import { Address } from '../Address';
import { AddressService } from '../address.service';
import { ControlService } from '../control.service';
import { MapService } from '../map.service';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-routes-setting',
  templateUrl: './routes-setting.component.html',
  styleUrls: ['./routes-setting.component.css'],
})
export class RoutesSettingComponent {
  @Input() destAddress: Address | undefined;
  @Input() originAddress: Address | undefined;

  originAddresses: Address[] | undefined;
  destinationAddresses: Address[] | undefined;

  constructor(
    private routesService: RoutesService,
    private mapService: MapService,
    private controlService: ControlService,
    private addressService: AddressService
  ) {
    routesService.summarySubject.asObservable().subscribe((response) => {
      mapService.routesSources2?.updateParams({
        cql_filter: 'summary_id=' + response.id,
      });
    });
  }
  route() {
    const routeRequest = {
      id: 0,
      mode: 'pedestrian',
      origin: {
        lat: this.destAddress!.data.y,
        lon: this.destAddress!.data.x,
      },
      destination: {
        lat: this.originAddress!.data.y,
        lon: this.originAddress!.data.x,
      },
    };
    this.routesService.save(routeRequest);
  }

  exit() {
    this.controlService.remove();
    this.routesService.removeSelectedRoute();
    this.mapService.routesSources2?.updateParams({
      cql_filter: 'summary_id=0',
    });
  }

  switchAddresses() {
    this.controlService.switch();
  }

  searchOrigin(x: any) {
    this.addressService
    .getAddressAutocomplete(x.target.value)
    .subscribe((addressData) => {
      this.originAddresses = addressData;
    });
  }

  searchDestination(x: any) {
    this.addressService
    .getAddressAutocomplete(x.target.value)
    .subscribe((addressData) => {
      this.destinationAddresses = addressData;
    });
  }

  clearOriginSearch() {
    this.originAddresses = undefined;
  }

  clearDestinationSearch() {
    this.destinationAddresses = undefined;
  }

  selectOriginAddress(address: Address) {
    this.controlService.setOrigin(address);
    this.clearOriginSearch();
  }

  selectDestinationAddress(address: Address) {
    this.controlService.setDestination(address);
    this.clearDestinationSearch();
  }

  getOriginText(): string {
    if(this.originAddress === undefined) {
      return '';
    } else {
      return this.originAddress.forslagstekst;
    }
  }

  getDestinationText(): string {
    if(this.destAddress === undefined) {
      return '';
    } else {
      return this.destAddress.forslagstekst;
    }
  }
}
