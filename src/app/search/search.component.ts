import { Component } from '@angular/core';
import { AddressService } from '../address.service';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchValue = 'wildersgade';

  constructor(private address: AddressService, private routes: RoutesService) {}
  search() {
    this.address
      .getGreeting(this.searchValue)
      .subscribe((addressData) => console.log(addressData));
  }

  updateSearchField(x: any) {
    this.searchValue = x.target.value;
  }

  test() {
    const routeRequest = {
      id: 0,
      mode: 'pedestrian',
      origin: {
        lat: 55.393495,
        lon: 10.376343,
      },
      destination: {
        lat: 55.389638,
        lon: 10.385509,
      },
    };
    this.routes.save(routeRequest);
  }
}
