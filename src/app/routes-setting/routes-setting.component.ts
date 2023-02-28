import { Component, Input } from '@angular/core';
import { MapService } from '../map.service';
import { MarkerService } from '../marker.service';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-routes-setting',
  templateUrl: './routes-setting.component.html',
  styleUrls: ['./routes-setting.component.css']
})
export class RoutesSettingComponent {
  @Input() destText = '';
  @Input() originText = '';

  constructor(private markerService: MarkerService, private routesService: RoutesService, private mapService: MapService) {
    routesService.summarySubject.asObservable().subscribe(response => {
      mapService.routesSources2?.updateParams({'cql_filter': 'summary_id='+response.id});
    })
  }
  route() {
    const routeRequest = {
      "id": 0,
      "mode": "pedestrian",
      "origin": {
        "lat": this.markerService.destinationCoordinates.getValue()[1],
        "lon": this.markerService.destinationCoordinates.getValue()[0]
      },
      "destination": {
        "lat": this.markerService.originCoordinates.getValue()[1],
        "lon": this.markerService.originCoordinates.getValue()[0]
      }
    }
    this.routesService.save(routeRequest);
  }

  exit() {
    this.markerService.removeMarkers();
    this.mapService.routesSources2?.updateParams({'cql_filter': 'summary_id=0'});
  }
}
