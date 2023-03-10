import { Component } from '@angular/core';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {

  bottomDrawerDataBool: Boolean = false;
  constructor(private routeService: RoutesService) {
    routeService.selectedFeatures.asObservable().subscribe(features => {
      if(features.length > 0) {
        this.bottomDrawerDataBool = true;
      } else {
        this.bottomDrawerDataBool = false;
      }
    })
  }
}
