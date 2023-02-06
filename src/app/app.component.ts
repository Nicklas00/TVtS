import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'qGIS-OL-Test';
  constructor(private mapService: MapService) {}
  ngOnInit(): void {
    this.mapService.createMap();
  }
}
