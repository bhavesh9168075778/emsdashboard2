import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { GlobalService } from '../services/global.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-demand-trend-analysis',
  templateUrl: './demand-trend-analysis.component.html',
  styleUrls: ['./demand-trend-analysis.component.css']
})
export class DemandTrendAnalysisComponent implements OnInit {

  countryList = [];
  stateList = [];
  cityList = [];
  zoneList = [];
  locationList = [];
  parameterList = [
    {
      id: 1, name: 'Demand KW'
    }
  ];

  selectedCountry = null;
  selectedState = null;
  selectedCity = null;
  selectedZone = null;
  selectedLocation = null;
  selectedParameter = this.parameterList[0];
  countryCode:any;
  showDateRange = false;
  currentUserData = JSON.parse(localStorage.getItem('userData'));

  durationList = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
    { id: 5, name: 'Last Month' },
    { id: 6, name: 'Custom' }
  ];
  selectedDuration = this.durationList[0];

  data = [];
  public graph = {
    layout: {
      autosize: true,
      xaxis: {
        title: {
          text: 'Time',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000',
          }
        },
      },
      yaxis: {
        title: {
          text: 'Value (Demand KW)',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000'
          }
        }
      }
    },
    config: { displaylogo: false, modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'] }
  };

  constructor(private _dashboardService: DashboardService, private globalService: GlobalService, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {

    this.globalService.countrySelection(this.currentUserData.countryid).subscribe((response: any) => {
      this.countryCode = response.result[0].code;
    this.globalService.golbalMaster('country').subscribe((response: any) => {
      this.countryList = response.result;
      this.selectedCountry = _.find(this.countryList, (o: any) => {
        return o.code === this.countryCode;
      });
      this.countrySelection();
    });
  });   
  }

  countrySelection() {
    this.stateList = [];
    this.cityList = [];
    this.zoneList = [];
    this.locationList = [];
    //this.filteredTransformers();
    this.durationSelectionAlert(this.selectedDuration);
    if (this.selectedCountry) {
      this.globalService.getStateList(this.selectedCountry).subscribe((response: any) => {
        if (response && response.code === '1') {
          this.stateList = response.result;
        }
      });
    }
  }

  stateSelection() {
    this.cityList = [];
    this.zoneList = [];
    this.locationList = [];
    if (this.selectedState) {
      this.globalService.getCityList(this.selectedState).subscribe((response: any) => {
        if (response && response.code === '1') {
          this.cityList = response.result;
        }
      });
    } else {
      this.selectedCity = null;
      this.selectedZone = null;
      this.selectedLocation = null;
    }
    //this.filteredTransformers();
    this.durationSelectionAlert(this.selectedDuration);
  }

  citySelection() {
    this.zoneList = [];
    this.locationList = [];
    if (this.selectedCity) {
      this.globalService.getZoneList(this.selectedCity).subscribe((response: any) => {
        if (response && response.code === '1') {
          this.zoneList = response.result;
        }
      });
    } else {
      this.selectedZone = null;
      this.selectedLocation = null;
    }
    this.durationSelectionAlert(this.selectedDuration);
    //this.filteredTransformers();
  }

  zoneSelection() {
    this.locationList = [];
    if (this.selectedZone) {
      this.globalService.getSiteLocationList(this.selectedZone).subscribe((response: any) => {
        if (response && response.code === '1') {
          this.locationList = response.result;
        }
      });
    } else {
      this.selectedLocation = null;
    }
    //this.filteredTransformers();
    this.durationSelectionAlert(this.selectedDuration);
  }

  locationSelection() {
    //this.filteredTransformers();
    this.durationSelectionAlert(this.selectedDuration);
  }

  filtertransformerPayload(date) {
    let payloadtogetTransformer = {
      "countryid": this.selectedCountry ? this.selectedCountry.id : null,
      "stateid": this.selectedState ? this.selectedState.id : null,
      "cityid": this.selectedCity ? this.selectedCity.id : null,
      "zoneid": this.selectedZone ? this.selectedZone.id : null,
      "locationid": this.selectedLocation ? this.selectedLocation.id : null,
      "transformerid": null,
      "startdate": date ? date.startdate : moment().format('YYYY-MM-DD'),
      "enddate": date ? date.enddate : moment().format('YYYY-MM-DD')
    }
    return payloadtogetTransformer;
  }

  durationSelectionAlert(selectedDuration) {
    console.log('selectedDuration====', selectedDuration)
    let date = {
      startdate: moment().format('YYYY-MM-DD'),
      enddate: moment().format('YYYY-MM-DD')
    };
    if (selectedDuration.id == 2) {
      date.startdate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      date.enddate = moment().subtract(1, 'day').format('YYYY-MM-DD')
    }
    if (selectedDuration.id == 3) {
      date.startdate = moment().startOf('week').format('YYYY-MM-DD');
      date.enddate = moment().endOf('week').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 4) {
      date.startdate = moment().startOf('month').format('YYYY-MM-DD');
      date.enddate = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 5) {
      date.startdate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
      date.enddate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 6) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
    this.filteredTransformers(date);
  }

  changeDateRange(event) {
    console.log("event----------", event)
    if (this.showDateRange) {
      let date = {
        startdate: moment(event.value[0]).format('YYYY-MM-DD'),
        enddate: moment(event.value[1]).format('YYYY-MM-DD')
      };
      this.filteredTransformers(date);
    }
  }

  filteredTransformers(date?) {
    let temptransformerList = [];
    this.ngxLoader.startLoader('demandtrend');
    let payloadtogetTransformer = this.filtertransformerPayload(date);
    this.globalService.getfilteredTransformers(JSON.stringify(payloadtogetTransformer), localStorage.getItem('userData')).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        this.ngxLoader.stopLoader('demandtrend');
        console.log("filtered response=============>", response);
        for (let i = 0; i < response.result.length; i++) {
          temptransformerList.push(response.result[i].transformerid);
        }
        let transformedTransformerList = temptransformerList.map(t => `'${t}'`).join(',');
        let payload = { transformerid: '', startdate: '', enddate: '' };
        payload.transformerid = transformedTransformerList;
        payload.startdate = payloadtogetTransformer.startdate;
        payload.enddate = payloadtogetTransformer.enddate;
        console.log("filtered response==payload===========>", payload);
        this.loadGraph(payload);
      } else {
        this.ngxLoader.stopLoader('demandtrend');
        this.data = [];
      }
    }, (error) => {
      this.ngxLoader.stopLoader('demandtrend');
    });
  }

  loadGraph(payload) {
    this.data = [];
    this.ngxLoader.startLoader('demand-trendgraph');
    this._dashboardService.loadIndividualDashboard(payload).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        this.ngxLoader.stopLoader('demand-trendgraph');
        let responseData = _.flatMap(response.result, (o: any) => {
          let readings = JSON.parse(o.readings);
          o.demandKW = readings['3 Phase Active Power'];
          return o;
        })
        console.log("TransformerData response============>", response.result);
        this.data = _(responseData)
          .groupBy('transformerid')
          .map((data, transformerid) => ({
            x: _.map(data, 'DATE'),
            y: _.map(data, 'demandKW'),
            name: transformerid,
            mode: 'lines+markers',
            type: 'scatter',
            /*  text: _.map(data, 'mdate'), */
            max: _.maxBy(data, 'demandKW')['demandKW'],
            min: _.minBy(data, 'demandKW')['demandKW'],
            range: _.maxBy(data, 'demandKW')['demandKW'] - _.minBy(data, 'demandKW')['demandKW'],
            avg: _.sumBy(data, (o: any) => Number(o['demandKW'])) / responseData.length
          })).value();

        console.log("TransformerData finalResult============>", this.data);
      } else {
        this.ngxLoader.stopLoader('demand-trendgraph');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('demand-trendgraph');
    });
  }

}
