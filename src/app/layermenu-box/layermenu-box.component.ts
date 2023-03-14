import { Component, ViewChild } from '@angular/core';
import { __values } from 'tslib';
import { MapService } from '../map.service';

@Component({
  selector: 'app-layermenu-box',
  templateUrl: './layermenu-box.component.html',
  styleUrls: ['./layermenu-box.component.css'],
})
export class LayermenuBoxComponent {
  constructor(private mapService: MapService) {}

  filterControl(type:string, clock:string, month1:string, month2:string){
    this.mapService.pointsSource?.updateParams({'CQL_FILTER': `time_interval_id = 1 and seriousness_id = 2`})
    
    /*if(type !== "0" && clock !== "0" && month1 !== null && month2 !== null){
      //this.filterBy(type);
      //this.searchByTime(clock);
      this.searchByDate(month1, month2);
      console.log(type + "  " + clock + "  " + month1 + "  " + month2);
      
    }else{
      console.log("virker ikke");

      
    }
    */
  }

  searchByTime(value:string){
    if(value == "0"){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': 'id > 0'});
    }else{
    this.mapService.pointsSource?.updateParams({'CQL_FILTER': `time_interval_id = '${value}'`})
    console.log(value);
    }
  }

  /*switch(value){
    case "0":{
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': `seriousness_id = '1'`})
      break;
    }
    case "1":{
      this.mapService.pointsSource?.updateParams({})
      break;
    }
    case "2":{
      this.mapService.pointsSource?.updateParams({})
      break;
    }
    case "3":{
      this.mapService.pointsSource?.updateParams({})
      break;
    }
    case "4":{
      this.mapService.pointsSource?.updateParams({})
      break;
    }
  }
  */

  filterBy(value: string){
    switch(value){
      case "0":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': 'id > 0'})
        break;
      }
      case "1":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': `seriousness_id = '1'`});
        break;
      }
      case "2":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': `seriousness_id = '2'`});
        break;
      }
      case "3":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': `day_type_id = '1'`});
        break;
      }
      case "4":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': `day_type_id = '2'`});
        break;
      }
      case "5":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': `traffic_type_id = '1'`});
        break;
      }
      case "6":{
        this.mapService.pointsSource?.updateParams({'CQL_FILTER': `traffic_type_id = '2'`});
        break;
      }
    } 
    console.log("value: " + value);
  }

  searchByDate(date1: String, date2: String){
    console.log(date1, date2);
    this.mapService.pointsSource?.updateParams({'CQL_FILTER': `date >= '${date1 + '-01'}' and date <= '${date2+'-01'}'`});
    console.log(`date > '${date1}-01' and date < '${date2}-01'`);

    
  }

  enableLayer(isChecked: any) {
    if (isChecked.target.checked) {
      this.addLayer();
    } else {
      this.removeLayer();
    }
  }

  removeLayer() {
    this.mapService.removeWMSToMap(this.mapService.testMap, 'AP');
    console.log('removed layer');
  }

  addLayer() {
    this.mapService.addWMSToMap(
      this.mapService.testMap,
      this.mapService.pointsSource!,
      'AP',
      5
    );
    console.log('added layer');
  }
}
