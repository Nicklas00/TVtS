import { Component, OnInit } from '@angular/core';
import Feature from 'ol/Feature';
import { MapService } from './map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'qGIS-OL-Test';
  featureList: Feature[];
  messageText: String;
  
  constructor(private mapService: MapService) {
    this.featureList = [];
    this.messageText = "";
    mapService.featureEvents.features.subscribe((features) => {
      this.featureList = features;
      console.log(features);
      if (features.length === 0) {
        this.messageText = "No features found at that location";
      } else {
        this.messageText = `Found: ${features.length} features on location`;
      }
    });
  }
  ngOnInit(): void {
    this.mapService.createMap();
  }
}
