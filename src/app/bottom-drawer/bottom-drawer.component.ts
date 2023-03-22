import { Component } from '@angular/core';
import { Geometry } from 'ol/geom';
import { RoutesService } from '../routes.service';
import Feature from 'ol/Feature';
import { ControlService } from '../control.service';

@Component({
  selector: 'app-bottom-drawer',
  templateUrl: './bottom-drawer.component.html',
  styleUrls: ['./bottom-drawer.component.css']
})
export class BottomDrawerComponent {

  featuresList: Feature<Geometry>[] = [];
  constructor(private routesService: RoutesService, public controlService: ControlService) {
    controlService.features.subscribe(features => {
      this.featuresList = features;
    })
  }
}
