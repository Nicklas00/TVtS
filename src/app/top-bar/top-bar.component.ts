import { Component } from '@angular/core';
import { MapService } from '../map.service';
import { MarkerService } from '../marker.service';
import { ControlService } from '../control.service';
import { Address } from '../Address';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  originAddress: Address | undefined;
  destinationAddress: Address | undefined;
  constructor(
    private mapService: MapService,
    private controlService: ControlService,
    private markerService: MarkerService
  ) {
    controlService.routeObject.asObservable().subscribe((route) => {
      this.destinationAddress = route.destination;
      this.originAddress = route.origin;
    });
  }
}
