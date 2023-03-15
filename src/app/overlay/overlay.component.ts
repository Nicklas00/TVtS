import { Component } from '@angular/core';
import { ControlService } from '../control.service';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {

  bottomDrawerDataBool: Boolean = false;
  constructor(private routeService: RoutesService, private controlService: ControlService) {
    controlService.routeObject.asObservable().subscribe(route => {
      if(route.features.length > 0) {
        this.bottomDrawerDataBool = true;
      } else {
        this.bottomDrawerDataBool = false;
      }
    })
  }
}
