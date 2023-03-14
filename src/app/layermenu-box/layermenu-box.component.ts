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
    let CQLTime = this.searchByTime(clock);
    let CQLType = this.filterBy(type);
    let CQLDate = this.searchByDate(month1, month2);

    console.log("time: " + CQLTime + "\nType: " + CQLType + "\nDate: " + CQLDate);
    console.log(CQLType + ' and ' + CQLTime + ' and ' + CQLDate);

    if(CQLTime && CQLDate && CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLType + ' and ' + CQLTime + ' and ' + CQLDate});
      console.log("jeg er i if 1: " + CQLType + ' and ' + CQLTime + ' and ' + CQLDate);
    }else if(CQLTime && !CQLDate && CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLType + ' and ' + CQLTime});
      console.log("jeg er i if 2: " + CQLType + ' and ' + CQLTime);
    }else if(!CQLTime && CQLDate && CQLType ){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLType + ' and ' + CQLDate});
      console.log("jeg er i if 3: " + CQLType + ' and ' + CQLDate);
    }else if(CQLTime && CQLDate && !CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLTime + ' and ' + CQLDate});
      console.log("jeg er i if 4: " + CQLTime + ' and ' + CQLDate);     
    }else if(!CQLTime && CQLDate && !CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLDate});
      console.log("jeg er i if 5: " + CQLDate);
    }else if(CQLTime && !CQLDate && !CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLTime});
      console.log("jeg er i if 6: " + CQLTime);
    }else if(!CQLTime && !CQLDate && CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLType});
      console.log("jeg er i if 7: " + CQLType);
    }else if(!CQLTime && !CQLDate && !CQLType){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': 'id > 0'});
      console.log("jeg er i if 8: ");
    }
  }

  searchByTime(value:string) : string | undefined{
    if(value == "0"){
      return undefined;
    }else{
      return `time_interval_id = '${value}'`;
    }
  }

  filterBy(value: string | undefined){
    switch(value){
      case "0":{
        return undefined;
        break;
      }
      case "1":{
        return `seriousness_id = '1'`;
        break;
      }
      case "2":{
        return `seriousness_id = '2'`;
        break;
      }
      case "3":{
        return `day_type_id = '1'`;
        break;
      }
      case "4":{
        return `day_type_id = '2'`;
        break;
      }
      case "5":{
        return `traffic_type_id = '1'`;
        break;
      }
      case "6":{
        return `traffic_type_id = '2'`;
        break;
      }
    } 
    return undefined;
    console.log("value: " + value);
  }

  searchByDate(date1: String, date2: String):string | undefined{    
    if(!date1 || !date2){
      return undefined;
    }else{
    return `date >= '${date1 + '-01'}' and date <= '${date2+'-01'}'`;
    }

    
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
