import { Component } from '@angular/core';
import { Address } from '../Address';
import { AddressService } from '../address.service';
import { ControlService } from '../control.service';
import { MapService } from '../map.service';
import { RoutesService } from '../routes.service';
import { transform } from 'ol/proj';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchValue = 'flakhaven 2';
  addresses: Address[] | undefined;

  control = new FormControl('');
  options: Observable<Address[]>;

  constructor(
    private addressService: AddressService,
    private routes: RoutesService,
    private controlService: ControlService,
    private mapService: MapService
  ) {
    this.options = this.control.valueChanges.pipe(
      startWith('Odense'),
      switchMap((value) => addressService.getAddressAutocomplete(value!))
    );

    this.control.registerOnChange((address: Address) => {console.log('address.forslagstekst')});
    
    //this.control.

  }

  test(x: any) {
    console.log(this.control.getRawValue())
    console.log(x)
  }

  select(address: Address) {
    this.controlService.setDestination(address);
    this.mapService
      .testMap!.getView()
      .setCenter(
        transform(
          [address.data.x, address.data.y],
          'CRS:84',
          this.mapService.testMap!.getView().getProjection()
        )
      );
  }

  updateSearchField(x: any) {
    this.searchValue = x.target.value;
    this.addressService.getAddressAutocomplete(this.searchValue).subscribe({
      next: (addressData) => {
        this.addresses = addressData;
      },
      error: (err) => {
        this.addresses = undefined;
      },
    });
  }

  clearSearch() {
    this.addresses = undefined;
    this.searchValue = '';
  }
}
