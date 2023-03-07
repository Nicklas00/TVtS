import { Component } from '@angular/core';
import { Address } from '../Address';
import { AddressService } from '../address.service';
import { ControlService } from '../control.service';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchValue = 'flakhaven 2';
  addresses: Address[] | undefined;

  constructor(
    private addressService: AddressService,
    private routes: RoutesService,
    private controlService: ControlService
  ) {}

  select(address: Address) {
    this.controlService.setDestination(address);
  }

  updateSearchField(x: any) {
    this.searchValue = x.target.value;
    this.addressService
    .getAddressAutocomplete(this.searchValue)
    .subscribe((addressData) => {
      this.addresses = addressData;
    })
  }

  clearSearch() {
    this.addresses = undefined;
    this.searchValue = '';
  }
}
