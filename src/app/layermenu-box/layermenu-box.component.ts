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

  layerSelect(value:string){
    switch(value){
      case "0":{
        this.mapService.pointsSource?.updateParams({'STYLES': 'postgis:heatmap'})
        break;
      }
      case "1":{
        this.mapService.pointsSource?.updateParams({'STYLES': 'postgis:heatmap_alt_color'})
        break;
      }
      case "2":{
        this.mapService.pointsSource?.updateParams({'STYLES': 'postgis:heatmap_weighted'})
        break;
      }
      case "3":{
        this.mapService.pointsSource?.updateParams({'STYLES': 'postgis:heatmap_radius'})
        break;
      }
    }
  }

  filterControl(type:string, clock:string, month1:string, month2:string, day:string, serious:string){
    const CQLarr : string[] = [];

    let CQLTime = this.searchByTime(clock);
    let CQLType = this.searchByType(type);
    let CQLDate = this.searchByDate(month1, month2);
    let CQLDay = this.searchByDay(day);
    let CQLSeriousness = this.searchBySeriouseness(serious);

    !CQLTime ? {} : CQLarr.push(CQLTime);
    !CQLDate ? {} : CQLarr.push(CQLDate);
    !CQLType ? {} : CQLarr.push(CQLType);
    !CQLDay ? {} : CQLarr.push(CQLDay);
    !CQLSeriousness ? {} : CQLarr.push(CQLSeriousness);

    this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLarr.join(' and ')});
  }

  searchByTime(value:string) : string | undefined{
    if(value == "0"){
      return undefined;
    }else{
      return `time_interval_id = '${value}'`;
    }
  }

  searchBySeriouseness(value:string | undefined){
    if(value == '0'){
      return undefined;
    }else{
      return `seriousness_id = '${value}'`;
    }
  }

  searchByDay(value:string | undefined){
    if(value == '0'){
      return undefined;
    }else{
      return `day_type_id = '${value}'`;
    }
  }

  searchByTrafficType(value:string | undefined){
    if(value == '0'){
      return undefined;
    }else{
      return `traffic_type_id = '${value}'`;
    }
  }

  searchByType(value: string | undefined){
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
