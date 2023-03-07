import { Component } from '@angular/core';
import { MapService } from '../map.service';
import { MarkerService } from '../marker.service';
import { interval } from 'rxjs';
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
  constructor(private mapService: MapService, private controlService: ControlService, private markerService: MarkerService) {
    controlService.destination.asObservable().subscribe(address => {
      if(controlService.destEmptyState === false){
        this.destinationAddress = address;
      } else {
        this.destinationAddress = undefined;
      }
    })
    controlService.origin.asObservable().subscribe(address => {
      if(controlService.originEmptyState === false) {
        this.originAddress = address;
      } else {
        this.originAddress = undefined;
      }
    })

    interval(3000).subscribe(x => {
      //this.nextLayer();
  });
  }

  layerNumber = 0;
  layerName = 'postgis:uag';
  nextLayer() {
    if (this.layerNumber > 5) {
      this.layerNumber = 1
    } else {
      this.layerNumber++;
    }

    
    switch(this.layerNumber) {
      case 0: {
        this.layerName = 'postgis:uag';
        break;
      }
      case 1: {
        this.layerName = 'postgis:uag_2017';
        break;
      }
      case 2: {
        this.layerName = 'postgis:uag_2018';
        break;
      }
      case 3: {
        this.layerName = 'postgis:uag_2019';
        break;
      }
      case 4: {
        this.layerName = 'postgis:uag_2020';
        break;
      }
      case 5: {
        this.layerName = 'postgis:uag_2021';
        break;
      }
      case 6: {
        this.layerName = 'postgis:uag_2022';
        break;
      } 
      default: {
        this.layerName = 'postgis:uag';
        break;
      }
    }

    this.mapService.pointsSource?.updateParams({'layers': this.layerName});
  }
}
