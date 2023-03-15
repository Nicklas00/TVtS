import { Component } from '@angular/core';
import { Address } from '../Address';
import { AddressService } from '../address.service';
import { ControlService } from '../control.service';
import { FormControl } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  control = new FormControl('');
  options: Observable<Address[]>;

  constructor(
    private addressService: AddressService,
    private controlService: ControlService
  ) {
    this.options = this.control.valueChanges.pipe(
      startWith('Odense'),
      switchMap((value) => addressService.getAddressAutocomplete(value!))
    );
  }

  selectAddress(address: Address) {
    this.controlService.newAddress(address);
  }
}
