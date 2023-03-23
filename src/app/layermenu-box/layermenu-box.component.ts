import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { __values } from 'tslib';
import { MapService } from '../map.service';

@Component({
  selector: 'app-layermenu-box',
  templateUrl: './layermenu-box.component.html',
  styleUrls: ['./layermenu-box.component.css'],
})
export class LayermenuBoxComponent {
  constructor(private mapService: MapService) {}

  alle = new FormControl('0');
  dateLoop = [
    `date >= 2017-01-01 and date <= 2017-12-01`,
    `date >= 2018-01-01 and date <= 2018-12-01`,
    `date >= 2019-01-01 and date <= 2019-12-01`,
    `date >= 2020-01-01 and date <= 2020-12-01`,
    `date >= 2021-01-01 and date <= 2021-12-01`,
    `date >= 2022-01-01 and date <= 2022-12-01`,
  ];
  year = ['2017', '2018', '2019', '2020', '2021', '2022'];

  sub: Subscription | undefined;
  index = 0;
  y = true;

  showFilter() {
    this.y = !this.y;
  }

  loopYear(
    isChecked: any,
    type: string,
    clock: string,
    month1: string,
    month2: string,
    day: string,
    serious: string
  ) {
    let CQLFilter = this.filterControl(
      type,
      clock,
      month1,
      month2,
      day,
      serious
    );
    let CQLString = '';

    if (isChecked.target.checked && this.index <= 5) {
      this.sub = this.loopYearFunctionality(
        CQLFilter,
        CQLString,
        month1,
        month2
      );
    } else {
      this.sub?.unsubscribe();
      this.index = 0;
    }
  }

  loopYearFunctionality(
    CQLFilter: string[],
    CQLString: string,
    month1: string,
    month2: string
  ): Subscription {
    let observable = interval(1500);
    let y = CQLFilter.length;
    return observable.subscribe((x) => {
      if (this.index <= 5) {
        if (CQLFilter.length > 1 && month1 !== '' && month2 !== '') {
          CQLFilter[0] = this.dateLoop[this.index];
          CQLString = CQLFilter.join(' and ');
          this.mapService.pointsSource?.updateParams({ CQL_FILTER: CQLString });
          this.index += 1;
        } else if (CQLFilter.length === 1 && month1 !== '' && month2 !== '') {
          CQLFilter[0] = this.dateLoop[this.index];
          CQLString = CQLFilter.join(' and ');
          this.mapService.pointsSource?.updateParams({ CQL_FILTER: CQLString });
          this.index += 1;
        } else if (CQLFilter.length >= 1) {
          CQLFilter[y] = this.dateLoop[this.index];
          CQLString = CQLFilter.join(' and ');
          this.mapService.pointsSource?.updateParams({ CQL_FILTER: CQLString });
          this.index += 1;
        } else {
          this.mapService.pointsSource?.updateParams({
            CQL_FILTER: this.dateLoop[this.index],
          });
          this.index += 1;
        }
      } else {
        this.index = 0;
      }
    });
  }

  layerSelect(value: string) {
    switch (value) {
      case '0': {
        this.mapService.pointsSource?.updateParams({
          STYLES: 'postgis:heatmap',
        });
        break;
      }
      case '1': {
        this.mapService.pointsSource?.updateParams({
          STYLES: 'postgis:heatmap_alt_color',
        });
        break;
      }
      case '2': {
        this.mapService.pointsSource?.updateParams({
          STYLES: 'postgis:heatmap_weighted',
        });
        break;
      }
      case '3': {
        this.mapService.pointsSource?.updateParams({
          STYLES: 'postgis:heatmap_radius',
        });
        break;
      }
      case '4': {
        this.mapService.pointsSource?.updateParams({ STYLES: 'point' });
        break;
      }
    }
  }

  filterControl(
    type: string,
    clock: string,
    month1: string,
    month2: string,
    serious: string,
    day: string
  ) {
    const CQLarr: string[] = [];

    let CQLTime = this.searchByTime(clock);
    let CQLType = this.searchByTrafficType(type);
    let CQLDate = this.searchByDate(month1, month2);
    let CQLDay = this.searchByDay(day);
    let CQLSeriousness = this.searchBySeriouseness(serious);
    let CQLFull;

    !CQLDate ? {} : CQLarr.push(CQLDate);
    !CQLTime ? {} : CQLarr.push(CQLTime);
    !CQLType ? {} : CQLarr.push(CQLType);
    !CQLDay ? {} : CQLarr.push(CQLDay);
    !CQLSeriousness ? {} : CQLarr.push(CQLSeriousness);
    if (CQLarr.length > 0) {
      CQLFull = CQLarr.join(' and ');
      this.mapService.pointsSource?.updateParams({ CQL_FILTER: CQLFull });
      return CQLarr;
    } else {
      this.mapService.pointsSource?.updateParams({ CQL_FILTER: 'id > 0' });
      return CQLarr;
    }
  }

  searchByTime(value: string) {
    if (value == '0' || value === undefined) {
      return undefined;
    } else {
      return `time_interval_id = '${value}'`;
    }
  }

  searchBySeriouseness(value: string) {
    if (value == '0' || value === undefined) {
      return undefined;
    } else {
      return `seriousness_id = '${value}'`;
    }
  }

  searchByDay(value: string) {
    if (value == '0' || value === undefined) {
      return undefined;
    } else {
      return `day_type_id = '${value}'`;
    }
  }

  searchByTrafficType(value: string) {
    if (value == '0' || value === undefined) {
      return undefined;
    } else {
      return `traffic_type_id = '${value}'`;
    }
  }

  searchByDate(date1: String, date2: String) {
    if (!date1 || !date2 || date1 === undefined || date2 === undefined) {
      return undefined;
    } else {
      return `date >= '${date1 + '-01'}' and date <= '${date2 + '-01'}'`;
    }
  }

  enableLayer(isChecked: any, id: string) {
    if (isChecked.target.checked) {
      this.addLayer(id);
    } else {
      this.removeLayer(id);
    }
  }

  removeLayer(id: string) {
    if (id == '1') {
      this.mapService.removeWMSToMap(this.mapService.olMap, 'AP');
    } else {
      this.mapService.removeWMSToMap(this.mapService.olMap, 'grid');
    }
  }

  addLayer(id: string) {
    if (id == '1') {
      this.mapService.addWMSToMap(
        this.mapService.olMap,
        this.mapService.pointsSource!,
        'AP',
        5
      );
    } else {
      this.mapService.addWMSToMap(
        this.mapService.olMap,
        this.mapService.gridSource!,
        'grid',
        5
      );
    }
  }
}
