import { Component } from '@angular/core';
import { MapService } from '../map.service';
import { MarkerService } from '../marker.service';
import { ControlService } from '../control.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  constructor(
    private mapService: MapService, //To make sure the service it loaded
    public controlService: ControlService,
    private markerService: MarkerService //To make sure the service it loaded
  ) {}
}
