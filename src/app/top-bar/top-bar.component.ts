import { Component } from '@angular/core';
import { mouseCoordinateConverter } from 'src/openlayers-tools/mouse-events';
import { MapService } from '../map.service';
import { map } from 'rxjs/internal/operators/map';
import { MarkerService } from '../marker.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  originText: string | undefined;
  destinationText: string | undefined;
  constructor(private mapService: MapService, private markerSerivce: MarkerService) {
    markerSerivce.destinationCoordinates.asObservable().subscribe(coords => {
      if(markerSerivce.destEmptyState === false){
        this.destinationText = 'Destination: ' + coords;
      } else {
        this.destinationText = undefined;
      }
    })
    markerSerivce.originCoordinates.asObservable().subscribe(coords => {
      if(markerSerivce.originEmptyState === false) {
        this.originText = 'Origin: ' + coords;
      } else {
        this.originText = undefined;
      }
    })
  }
}
