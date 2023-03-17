import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { __values } from 'tslib';
import { MapService } from '../map.service';

@Component({
  selector: 'app-layermenu-box',
  templateUrl: './layermenu-box.component.html',
  styleUrls: ['./layermenu-box.component.css'],
})
export class LayermenuBoxComponent {
  constructor(private mapService: MapService) {}

  alle = new FormControl("0");

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
      case "4":{
        this.mapService.pointsSource?.updateParams({'STYLES': 'point'})
        break;
      }
    }
  }

  filterControl(type:string, clock:string, month1:string, month2:string, day:string, serious:string){
    const CQLarr : string[] = [];

    let CQLTime = this.searchByTime(clock);
    let CQLType = this.searchByTrafficType(type);
    let CQLDate = this.searchByDate(month1, month2);
    let CQLDay = this.searchByDay(day);
    let CQLSeriousness = this.searchBySeriouseness(serious);

    !CQLTime ? console.log("Time er ikke eksisterende") : CQLarr.push(CQLTime);
    !CQLDate ? {} : CQLarr.push(CQLDate);
    !CQLType ? {} : CQLarr.push(CQLType);
    !CQLDay ? {} : CQLarr.push(CQLDay);
    !CQLSeriousness ? {} : CQLarr.push(CQLSeriousness);
    if(CQLarr.length > 0){
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': CQLarr.join(' and ')});
      console.log('CQL = ' + CQLarr.join(' and '));
    }else{
      this.mapService.pointsSource?.updateParams({'CQL_FILTER': 'id > 0'});
      console.log("else");
    }    
  }

  searchByTime(value:string){
    if(value == "0" || value === undefined){
      return undefined
    }else{
      return `time_interval_id = '${value}'`;
    }
  }

  searchBySeriouseness(value:string){
    if(value == '0' || value === undefined){
      return undefined
    }else{
      return `seriousness_id = '${value}'`;
    }
  }

  searchByDay(value:string){
    if(value == '0' || value === undefined){
      return undefined
    }else{
      return `day_type_id = '${value}'`;
    }
  }

  searchByTrafficType(value:string){
    if(value == '0' || value === undefined){
      return undefined
    }else{
      return `traffic_type_id = '${value}'`;
    }
  }

  searchByDate(date1: String, date2: String){    
    if(!date1 || !date2 || date1 === undefined || date2 === undefined){
      return undefined;
    }else{
      return `date >= '${date1 + '-01'}' and date <= '${date2+'-01'}'`;
    }

    
  }

  enableLayer(isChecked: any, id:string) {
    if (isChecked.target.checked) {
      this.addLayer(id);
      console.log(id);
      
    } else {
      this.removeLayer(id);
      console.log(id);
      
    }
  }

  removeLayer(id:string) {
    console.log(id);
    if(id == "1"){
      this.mapService.removeWMSToMap(this.mapService.testMap, 'AP');
    }else{
      this.mapService.removeWMSToMap(this.mapService.testMap, 'grid'); 
    }
    console.log('removed layer');
  }

  addLayer(id:string) {
    console.log(id);
    if(id == "1"){
    this.mapService.addWMSToMap(
      this.mapService.testMap,
      this.mapService.pointsSource!,
      'AP',
      5
    );
  }else{
    this.mapService.addWMSToMap(
      this.mapService.testMap,
      this.mapService.gridSource!,
      'grid',
      5
    );
  }
    console.log('added layer');
  }
}
