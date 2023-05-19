import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { GlobalService } from '../services/global.service';
import { SiteManagerService } from '../services/site-manager.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { AlertComponent } from '../alert/alert.component';
import { ReportService } from '../services/report.service';
import { filter } from 'rxjs/operators';
import { CustomDateComponent } from '../reports/customdate/custom-date.component';
import { runInThisContext } from 'vm';
import { analyzeAndValidateNgModules } from '@angular/compiler';

const counterAnim = (qSelector, start = 0, end, duration = 1000) => {
 const target = document.querySelector(qSelector);
 let startTimestamp = null;
 const step = (timestamp) => {
  if (!startTimestamp) startTimestamp = timestamp;
  const progress = Math.min((timestamp - startTimestamp) / duration, 1);
  let result=Number((progress * (end - start) + start).toFixed(2));
  let result1=new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 20 }).format(result);
  target.innerText = result1;
  if (progress < 1) {
   window.requestAnimationFrame(step);
  }
 };
 window.requestAnimationFrame(step);
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /* model */
  canvasWidth = 200;
  needleValue = 0;
  centralLabel = '';

  options = {
    hasNeedle: true,
    needleColor: 'black',
    needleUpdateSpeed: 1000,
    arcColors: ['red', 'orange','green'],
    arcDelimiters: [30,50],
    rangeLabel: ['0','100'],
    needleStartValue: 0,
  };
  selectedCountry = null;
  selectedState = null;
  selectedCity = null;
  selectedZone = null;
  selectedLocation = null;
  selectedTransformer = null;
  TransformerListForAge : any;
  ageTransformer = null;
  ageTransformerArray = null;
  windingTempArray = [];
  OilLevelArray = [];
  humidityArray = [];
  PFArray = [];
  harmonicsArray = [];
  loadArray = [];
  ratedLoadArray = [];
  vunbalanceArray = [];
  healthIndexArray = [];
  ratedLoadValue = null;
  currentUserData = JSON.parse(localStorage.getItem('userData'));
  data: any;
  calculatedWindingTemprature:Number = 0;
  countryList = [];
  stateList = [];
  cityList = [];
  zoneList = [];
  locationList = [];
  transformerList = [];
  healthIndex = [];
  iUnbalanceArray = [];
  weatherData = null;
  selectedTransformerForWeather = null;
  selectedTransformerForHealth = null;
  timeFilter: string;
  timeOptions: any = ['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month', 'Custom'];
  filter: any = {};
  transformerParam: string;
  customeSelectedDate:any;
  OilTempArray: any = [];
  transformerDataForHealthIndex:any = [];
oilTempr : any;
oilTempValue : any;
PFValue : any;
humidityvalue : any;
harmonicsValue : any;
oilLevelValue : any;
loadValue : any;
repairedValue : any;
iUnbalanceValue:any;
vUnbalanceValue:any;
windingTempValue:any;
ageTransformerValue:any;
ageTransformersvalue : any;
healthOfTransformer:any;
oilLevelValues: any;
windingTempValues: any;
oilTempValues: any;
oilLevelIndicator: any;
LoadPercentages: any=[];
loadPercentageValue:any;
healthColor: any;
cap= {
        radius: 5,
        border: {
            color: 'red',
            width: 3
            }
    };
labelStyle= {
        format: '{value}°'
    };
    labelStyles= {
            format: '{value}%'
        };
  durationList = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
    { id: 5, name: 'Last Month' },
    { id: 6, name: 'Custom' }
  ];
  selectedDuration = null;
  selectedDurationAlert = null;

  parameterList = [
    { name: 'All', value: 'all' },
    { name: 'Oil Temperature', value: 'apOiltemperature' },
    { name: 'Winding Temperature', value: 'apWindingtemperature' },
    { name: 'Overload', value: 'apOverload' },
    { name: 'Underload', value: 'apUnderload' },
    { name: 'Iunbalance', value: 'apIunbalance' },
    { name: 'Vunbalance', value: 'apVunbalance' },
    { name: 'Lowvolt', value: 'apLowvolt' },
    { name: 'Low Powerfactor', value: 'apLowPowerfactor' },
    { name: 'Oil Level', value: 'apOillevel' },
  ];

  selectedParameter = this.parameterList[0];

  redTransformerPath = '../assets/images/red_transformer.png'
  greenTransformerPath = '../assets/images/green_transformer.png'
  blackTransformerPath = '../assets/images/black_transformer.png'
  lat: number;
  lng: number;
  dataPoints = [{ lat: '20.10009154', lng: '73.011800995' }, { lat: '20.09894655', lng: '73.0174298' }]
  dataLoadProfile = []
  graphLoadProfile = {
    layout: {
      width: 500, height: 290,
       xaxis: {
        title: {
          text: 'Transformer Id',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000',
          }
        },
      },
      yaxis: {
        title: {
          text: 'Load Percentage',
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
  dataAlertCount = [];
  graphAlertCount = {
    layout: {
      width: 500, height: 290,
      xaxis: {
        title: {
          text: 'Date',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000',
          }
        },
      },
      yaxis: {
        title: {
          text: 'No. of Alerts',
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

  dataTransformerAlert = [];
  graphTransformerAlert = {
    layout: {
      width: 500, height: 290,
      xaxis: {
        title: {
          text: 'Transformer ID',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000',
          }
        },
      },
      yaxis: {
        title: {
          text: 'No. of Alerts',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000'
          }
        }
      }
    },
    config: { displaylogo: false,responsive: true, modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'] }
  };
  dashboardData;
  kvaData = null;
  kwData = null;
  kwhData = null;
  readings = [];
  countryCode:any;
  showDateRange: boolean;
  showDateRange1: boolean;
  mapData = [];
  lat1:any;
  lng1:any;
  transformerTile = null;
  constructor(private _dashboardService: DashboardService, private globalService: GlobalService,private reportService: ReportService,
    private sitemanagerService: SiteManagerService,private route: ActivatedRoute, private ngxLoader: NgxUiLoaderService, private router: Router, private matDialog: MatDialog) {

  }

  ngOnInit() {
    console.log("currentUserData========", this.currentUserData);
    this.globalService.countrySelection(this.currentUserData.countryid).subscribe((response: any) => {
      this.countryCode = response.result[0].code;
    this.ngxLoader.startLoader('healthIndexArray');
    this.globalService.golbalMaster('country').subscribe((response: any) => {
      this.countryList = response.result;
      this.selectedCountry = _.find(this.countryList, (o: any) => {
        return o.code === this.countryCode;
      });
      this.countrySelection();
      this.getLatLang();
    });
  });
    this.timeFilter = 'Today';
  }
  getLatLang(){
    let countryid = this.currentUserData.countryid;
    if(countryid == 100){
    this.lat1 = 20.5937;
    this.lng1 = 78.9629;
    } else if(countryid == 162){
      this.lat1 = 9.0820;
      this.lng1 = 8.6753;
    } else if(countryid == 232 ){
      this.lat1 = 40.147844308078014;
      this.lng1 = -101.23596925926525;
    } else if(countryid == 111 ){
      this.lat1 = 36.52430154315737;
      this.lng1 = 139.42371318237787;
    }

  }
  openAlertBox() {
    let dialogRef: any;
    const dialogConfig = new MatDialogConfig();

    dialogRef = this.matDialog.open(AlertComponent, {
      autoFocus: false,
      height: '600px', width: '700px', data: { "details": "", "action": "Add" }, panelClass: 'custom-modalbox'
    });
    dialogRef.updatePosition({ top: '50px', right: '10px' });

  }

  filtertransformerPayload() {
    let payloadtogetTransformer = {
      "countryid": this.selectedCountry ? this.selectedCountry.id : null,
      "stateid": this.selectedState ? this.selectedState.id : null,
      "cityid": this.selectedCity ? this.selectedCity.id : null,
      "zoneid": this.selectedZone ? this.selectedZone.id : null,
      "locationid": this.selectedLocation ? this.selectedLocation.id : null,
      "transformerid": this.selectedTransformer ? this.selectedTransformer.transformerid : null,
    }
    return payloadtogetTransformer;
  }

  getListofTransformerInitial() {
    let payloadtogetTransformer = {
      "countryid": this.selectedCountry ? this.selectedCountry.id : null,
      "stateid": null,
      "cityid": null,
      "zoneid": null,
      "locationid": null,
      "transformerid": null,
    };
    this.globalService.getfilteredTransformers(JSON.stringify(payloadtogetTransformer), localStorage.getItem('userData')).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        this.transformerList = response.result;
        this.transformerList.map(e => {
          e.label = `${e.transformerid}[ ${e.sitename} ]`;
      });
      }
    })
  }

  countrySelection() {
    this.stateList = [];
    this.cityList = [];
    this.zoneList = [];
    this.locationList = [];
    this.filteredTransformers()
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
    this.filteredTransformers();
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
    this.filteredTransformers();
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
    this.filteredTransformers();
  }

  locationSelection() {
    this.filteredTransformers();
  }

  transformerSelection() {
    this.filteredTransformers();
  }

  onMouseOver(infoWindow, gm) {
    if (gm.lastOpen && gm.lastOpen.isOpen) {
      gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }

  transformerClicked(data) {
    console.log("data++", data)
    //data = 'T-1152';
    this.router.navigate(['/report'], { queryParams: { transformerId: data.transformerid } });

  }

  filteredTransformers() {
    this.ngxLoader.startLoader('dashboard');
    let temptransformerList = [];
    this.kvaData = null;
    this.kwData = null;
    this.kwhData = null;
    let payloadtogetTransformer = this.filtertransformerPayload();
    console.log("filtered response===payloadtogetTransformer==========>", payloadtogetTransformer)
    this.globalService.getfilteredTransformers(JSON.stringify(payloadtogetTransformer), localStorage.getItem('userData')).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        this.ngxLoader.stopLoader('dashboard');
        console.log("filtered response=============>", response.result[0]);
        this.transformerList = response.result;
        this.transformerList.map(e => {
          e.label = `${e.transformerid}[ ${e.sitename} ]`;
      });
        for (let i = 0; i < response.result.length; i++) {
          temptransformerList.push(response.result[i].transformerid);
        }
        console.log("Transformer Parameters",temptransformerList);
        /* Method For Populating Tiles Count */
        this.getMapData(temptransformerList);
        /* Method to Load Profile */
        this.loadProfile(temptransformerList);
        /* Method For Alert Count */
        const dates = this.generatesDatesForAlert();
        let currentDatealert = {
          startdate: moment().startOf('month').format('YYYY-MM-DD'),
          enddate: moment().endOf('month').format('YYYY-MM-DD')
        };
        this.selectedDurationAlert = this.durationList[3];
        this.alertCount(currentDatealert);
        /* Method For Weather Load */
        this.selectedTransformerForWeather = response.result[0];
        this.selectedTransformerForHealth = response.result[0];
        this.getWeatherData(response.result[0]);
        /* Method For Transformer Alert */
        let currentDate = {
          startdate: moment().format('YYYY-MM-DD'),
          enddate: moment().format('YYYY-MM-DD')
        };
        this.selectedDuration = this.durationList[0];
        this.getTransformerAlert(currentDate);


      } else {
        this.ngxLoader.stopLoader('dashboard');
        this.transformerTile = null;
        this.kvaData = null;
        this.kwData = null;
        this.kwhData = null;

        this.dataLoadProfile = [];
        this.dataAlertCount = [];
        this.mapData = [];
        this.selectedTransformerForWeather = null;
        this.selectedTransformerForHealth = null;
        this.weatherData = null;
        this.dataTransformerAlert = [];
      }
    }, (error) => {
      this.ngxLoader.stopLoader('dashboard');
    });
  }

  parameterChange(selectedParameter) {
    this.durationSelectionAlert(this.selectedDuration, 'talert');
  }

  changeDateRange(event) {
    console.log("event----------", event)
    if (this.showDateRange) {
      let date = {
        startdate: moment(event.value[0]).format('YYYY-MM-DD'),
        enddate: moment(event.value[1]).format('YYYY-MM-DD')
      };
      this.getTransformerAlert(date);
    }
  }

  changeDateRange1(event) {
    console.log("event----------", event)
    if (this.showDateRange1) {
      let date = {
        startdate: moment(event.value[0]).format('YYYY-MM-DD'),
        enddate: moment(event.value[1]).format('YYYY-MM-DD')
      };
      this.alertCount(date);
    }
  }

  durationSelectionAlert(selectedDuration, type) {
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
    if (selectedDuration.id == 6 && type === 'talert') {
      this.showDateRange = true;
    } else if (type === 'talert') {
      this.showDateRange = false;
    }

    if (selectedDuration.id == 6 && type === 'alert') {
      this.showDateRange1 = true;
    } else if (type === 'alert') {
      this.showDateRange1 = false;
    }

    if (type === 'talert' && selectedDuration.id != 6) {
      this.getTransformerAlert(date);
    } else if (selectedDuration.id != 6) {
      this.alertCount(date);
    }

  }

  getTransformerAlert(date) {
    this.dataTransformerAlert = [];
    let temptransformerList = [];
    for (let i = 0; i < this.transformerList.length; i++) {
      temptransformerList.push(this.transformerList[i].transformerid);
    }
    this.ngxLoader.startLoader('dataTransformerAlert');
    this._dashboardService.transformerCount({ daterange: JSON.stringify(date), transformerList: temptransformerList, parameter: this.selectedParameter.value }).subscribe((response: any) => {
      console.log("response==getTransformerAlert======", response)
      if (response && response.result && response.result.length > 0) {
        this.ngxLoader.stopLoader('dataTransformerAlert');
        const count = _.map(response.result, 'count');
        const transformers = _.map(response.result, 'transformerid');
        const sitename = _.map(response.result, 'sitename');
        this.dataTransformerAlert = [{ x: transformers, y: count,text:sitename, type: 'bar' }];
      } else {
        this.ngxLoader.stopLoader('dataTransformerAlert');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('dataTransformerAlert');
    })
  }

  generatesDatesForAlert() {
    let resultdates = [];
    let n = 7;
    let current = moment();
    while (n > 0) {
      resultdates.push(current.format('YYYY-MM-DD'))
      current.subtract(1, 'day');
      n--;
    }
    console.log("filtered resultdates=============>", resultdates)
    return resultdates;
  }

  alertCount(date) {
    this.dataAlertCount = [];
    let temptransformerList = [];
    for (let i = 0; i < this.transformerList.length; i++) {
      temptransformerList.push(this.transformerList[i].transformerid);
    }
    this.ngxLoader.startLoader('dataAlertCount');
    this._dashboardService.alertCount({ dates: JSON.stringify(date), transformerList: temptransformerList }).subscribe((response: any) => {
      console.log("response=====alertCount===", response)
      if (response && response.result && response.result.length > 0) {
        this.ngxLoader.stopLoader('dataAlertCount');
        let dataAlercount = response.result;
        let apOverload = _.find(dataAlercount, (o: any) => {
          return o.type === 'apOverload'
        })
        var trace1 = {
          x: apOverload.date,
          y: apOverload.count,
          name: 'Overload',
          type: 'bar'
        };
        let apIunbalance = _.find(dataAlercount, (o: any) => {
          return o.type === 'apIunbalance'
        })
        var trace2 = {
          x: apIunbalance.date,
          y: apIunbalance.count,
          name: 'I Unbalance',
          type: 'bar'
        };
        let apOiltemperature = _.find(dataAlercount, (o: any) => {
          return o.type === 'apOiltemperature'
        })
        var trace3 = {
          x: apOiltemperature.date,
          y: apOiltemperature.count,
          name: 'Oil Temperature',
          type: 'bar'
        };
        let apUnderload = _.find(dataAlercount, (o: any) => {
          return o.type === 'apUnderload'
        })
        var trace4 = {
          x: apUnderload.date,
          y: apUnderload.count,
          name: 'Underload',
          type: 'bar'
        };

        let apLowPowerfactor = _.find(dataAlercount, (o: any) => {
          return o.type === 'apLowPowerfactor'
        })
        var trace5 = {
          x: apLowPowerfactor.date,
          y: apLowPowerfactor.count,
          name: 'LowPowerfactor',
          type: 'bar'
        };

        let apWindingTemperature = _.find(dataAlercount, (o: any) => {
          return o.type === 'apWindingTemperature'
        })
        var trace6 = {
          x: apWindingTemperature.date,
          y: apWindingTemperature.count,
          name: 'WindingTemperature',
          type: 'bar'
        };

        let apOillevel = _.find(dataAlercount, (o: any) => {
          return o.type === 'apOillevel'
        })
        var trace7 = {
          x: apOillevel.date,
          y: apOillevel.count,
          name: 'Oillevel',
          type: 'bar'
        };

        this.dataAlertCount = [trace1, trace2, trace3, trace4, trace5, trace6, trace7]
        console.log("this.dataAlertCount============", this.dataAlertCount)
      } else {
        this.ngxLoader.stopLoader('dataAlertCount');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('dataAlertCount');
    })
  }

  loadProfile(transformerList) {
    this.dataLoadProfile = [];
    let finalYaxis = [];
    let sitename = [];
    let xAxis = [];
    let calYaxis = {
      firstrangeVal: 0,
      secondrangeVal: 0,
      thirdrangeVal: 0,
      fourthrangeVal: 0,
      fifthrangeVal: 0
    };
    this.ngxLoader.startLoader('dataLoadProfile');
    this.ngxLoader.startLoader('kvaTile');
    this.ngxLoader.startLoader('kwTile');
    this.ngxLoader.startLoader('kwhTile');
    this._dashboardService.loadProfile({"transformerlist":transformerList}).subscribe((response: any) => {
      console.log('Transformer Data for Rated Load', response);
      if (response && response.code === '1' && response.result.length > 0) {
        this.ngxLoader.stopLoader('dataLoadProfile');

        this.transformerDataForHealthIndex = response.result;
        this.getTranformerHealthIndex(transformerList[0]);
        //     for (let i = 0; i < response.result.length; i++) {
        console.log('loadProfile========', response, "GroupBY==", _.groupBy(response.result, "Deviceid"))
        _.each(_.groupBy(response.result, "sitename"), (val,key) => {
                  sitename.push(key);
             });
        _.each(_.groupBy(response.result, "transformerid"), (val, key) => {

          xAxis.push(key);


          if (val.length > 0) {
            let tempData: any = 0;
            for (let i = 0; i < val.length; i++) {
              let individualObj = JSON.parse(val[i].readings);
              tempData = ((((Number(individualObj.L1) + Number(individualObj.L2) + Number(individualObj.L3)) / 3) / Number(val[i].ratedLoad)) * 100);
              this.ratedLoadArray.push({"transformerid":val[i].transformerid,"ratedLoad":val[i].ratedLoad});

            }
            console.log("kjsjhshdfhshiodiojisjijdisjidjjsajs",tempData)
            this.LoadPercentages.push({"transformerid":key,"data":Number(tempData)});
            finalYaxis.push(tempData);
          } else {
            let individualObj = JSON.parse(val[0].readings);
            finalYaxis.push((((individualObj.L1 + individualObj.L2 + individualObj.L3) / 3) / +val[0].ratedLoad) * 100);
          }
        });
        /*         for (let i = 0; i < response.result.length; i++) {
                  xAxis.push(response.result[i].transformerid)
                  let individualObj = JSON.parse(response.result[i].readings);
                  finalYaxis.push((((individualObj.L1 + individualObj.L2 + individualObj.L3) / 3)/+response.result[i].ratedLoad)*100);
                  //let individualloadPercentage = (individualObj.L1 + individualObj.L2 + individualObj.L3) / 3
                  //finalYaxis = this.checkRange(individualloadPercentage, calYaxis);
                } */
        console.log("yaxis=====", finalYaxis)
        //this.dataLoadProfile = [{ x: [20, 40, 60, 80, 100], y: finalYaxis, type: 'bar' }];
        this.dataLoadProfile = [{ x: xAxis, y: finalYaxis,text:sitename, type: 'bar' }];
        console.log("dataLoadProfile=====", this.ratedLoadArray)

        /* Method For Populating Tiles Count */
        this.getTilesCount(response.result);


      } else {
        this.ngxLoader.stopLoader('dataLoadProfile');
        this.ngxLoader.stopLoader('kvaTile');
        this.ngxLoader.stopLoader('kwTile');
        this.ngxLoader.stopLoader('kwhTile');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('dataLoadProfile');
      this.ngxLoader.stopLoader('kvaTile');
      this.ngxLoader.stopLoader('kwTile');
      this.ngxLoader.stopLoader('kwhTile');
    })
  }

  checkRange(individualloadPercentage, calYaxis) {

    console.log('individualloadPercentage==', individualloadPercentage)
    if (individualloadPercentage >= 0 && individualloadPercentage <= 20) {
      calYaxis.firstrangeVal = calYaxis.firstrangeVal + 1;
    }
    if (individualloadPercentage >= 21 && individualloadPercentage <= 40) {
      calYaxis.secondrangeVal = calYaxis.secondrangeVal + 1;
    }
    if (individualloadPercentage >= 41 && individualloadPercentage <= 60) {
      calYaxis.thirdrangeVal = calYaxis.thirdrangeVal + 1;
    }
    if (individualloadPercentage >= 61 && individualloadPercentage <= 80) {
      calYaxis.fourthrangeVal = calYaxis.fourthrangeVal + 1;
    }
    if (individualloadPercentage >= 81 && individualloadPercentage <= 100) {
      calYaxis.fifthrangeVal = calYaxis.fifthrangeVal + 1;
    }
    console.log('_.toArray(calYaxis)==', _.toArray(calYaxis))
    return _.toArray(calYaxis);
  }

  getTilesCount(transformerList) {
    this.ngxLoader.stopLoader('kvaTile');
    this.ngxLoader.stopLoader('kwTile');
    this.ngxLoader.stopLoader('kwhTile');
    this.readings = [];
    _.forEach(transformerList, (o: any) => {
      this.readings.push(JSON.parse(o.readings))
    });
    this.kvaData = {
      total: _.sumBy(this.readings, (o: any) => Number(o['3 Phase Apparent Power'])),
      max: _.maxBy(this.readings, '3 Phase Apparent Power')['3 Phase Apparent Power'],
      min: _.minBy(this.readings, '3 Phase Apparent Power')['3 Phase Apparent Power'],
      range: _.maxBy(this.readings, '3 Phase Apparent Power')['3 Phase Apparent Power'] - _.minBy(this.readings, '3 Phase Apparent Power')['3 Phase Apparent Power'],
      avg: _.sumBy(this.readings, (o: any) => Number(o['3 Phase Apparent Power'])) / transformerList.length
    };
    this.kwData = {
      total: _.sumBy(this.readings, (o: any) => Number(o['3 Phase Active Power'])),
      max: _.maxBy(this.readings, '3 Phase Active Power')['3 Phase Active Power'],
      min: _.minBy(this.readings, '3 Phase Active Power')['3 Phase Active Power'],
      range: _.maxBy(this.readings, '3 Phase Active Power')['3 Phase Active Power'] - _.minBy(this.readings, '3 Phase Active Power')['3 Phase Active Power'],
      avg: _.sumBy(this.readings, (o: any) => Number(o['3 Phase Active Power'])) / transformerList.length
    };
    this.kwhData = {
      total: _.sumBy(this.readings, (o: any) => Number(o['System_kwh'])),
      max: _.maxBy(this.readings, 'System_kwh')['System_kwh'],
      min: _.minBy(this.readings, 'System_kwh')['System_kwh'],
      range: _.maxBy(this.readings, 'System_kwh')['System_kwh'] - _.minBy(this.readings, 'System_kwh')['System_kwh'],
      avg: _.sumBy(this.readings, (o: any) => Number(o['System_kwh'])) / transformerList.length
    }
    console.log("this.kvaData====this.kwData===this.kwhData============", this.kvaData, this.kwData, this.kwhData)
    counterAnim(".count1", 10, this.kvaData.total, 3000);
    counterAnim(".count2", 10, this.kwData.total, 3000);
    counterAnim(".count3", 10, this.kwhData.total, 3000);


  }

  getMapData(transformerList) {
    this.mapData = [];
    this.transformerTile = null;
    this.ngxLoader.startLoader('transformerTile');
    this._dashboardService.transformerTileData({ transformerList: transformerList }).subscribe((response: any) => {
      this.ngxLoader.stopLoader('transformerTile');
      if (response && response.code === '1' && response.result.length > 0) {
        this.transformerTile = response.dashboardTransformerResult;
        this.transformerTile.normalTransformer = localStorage.getItem("normalCount") ? localStorage.getItem("normalCount") : response.dashboardTransformerResult.normalTransformer;
        console.log('MAP DATA==', response.result)
        this.lat = response.result[0].siteData.latitude;
        this.lng = response.result[0].siteData.longitude;
        this.mapData = _.flatMap(response.result, (o: any) => {
          let tempMapData: any = {};
          tempMapData.transformerid = o.siteData.transformerid;
          tempMapData.latitude = o.siteData.latitude;
          tempMapData.longitude = o.siteData.longitude;
          tempMapData.sitename = o.siteData.sitename;
          tempMapData.datareceived = o.datareceived;
          if (o.datareceived) {
            let readings = JSON.parse(o.transformerData.readings);
            tempMapData.Kva = (+readings['3 Phase Apparent Power']).toFixed(2);
            tempMapData.Kwh = readings.System_kwh;
            tempMapData.Load = (((readings.L1 + readings.L2 + readings.L3) / 3) / o.transformerData.ratedLoad) * 100;
          } else if (o.datareceivedafter) {
            let readings = JSON.parse(o.transformerData.readings);
            tempMapData.Kva = (+readings['3 Phase Apparent Power']).toFixed(2);
            tempMapData.Kwh = readings.System_kwh;
            tempMapData.Load = (((readings.L1 + readings.L2 + readings.L3) / 3) / o.transformerData.ratedLoad) * 100;
          } else {
            tempMapData.Kva = null;
            tempMapData.Kwh = null;
            tempMapData.Load = null;
          }
          tempMapData.alert = _.map(o.alert, (a: any) => {
            a.mparametervalue=a.gparametervalue;
            if (a.parametername === "apOillevel") {
              if (a.mparametervalue === 4) {   a.mparametervalue = "Low"; }
              if (a.mparametervalue === 5) {  a.mparametervalue = "Medium"; }
              if (a.mparametervalue === 6) {  a.mparametervalue = "High"; }
            }
            return a;
          });
          return tempMapData;
        });
        console.log('MAp DATA++++++++++++', this.transformerTile);
        counterAnim(".totalTransformer", 10, this.transformerTile.totalTransformer, 3000);
        counterAnim(".online", 10, this.transformerTile.onlineTransformer, 3000);
        counterAnim(".normal", 10, this.transformerTile.normalTransformer, 3000);
        counterAnim(".offline", 10, this.transformerTile.offlineTransformer, 3000);
      }
    }, (error) => {
      this.ngxLoader.stopLoader('transformerTile');
    });
  }

  getWeatherData(data) {
    //let response = JSON.parse('{"coord":{"lon":72.85,"lat":19.01},"weather":[{"id":721,"main":"Haze","description":"haze","icon":"50n"}],"base":"stations","main":{"temp":297.15,"feels_like":297.4,"temp_min":297.15,"temp_max":297.15,"pressure":1013,"humidity":69},"visibility":3500,"wind":{"speed":3.6,"deg":300},"clouds":{"all":20},"dt":1580141589,"sys":{"type":1,"id":9052,"country":"IN","sunrise":1580089441,"sunset":1580129884},"timezone":19800,"id":1275339,"name":"Mumbai","cod":200}');
    let responseWeather;
    this._dashboardService.getWeatherData(data).subscribe((response: any) => {
      if (response) {
        console.log("responseWeather==Weather==", response)
        responseWeather = response;
        this.weatherData = {
          location: _.startCase(data.locationname),
          city: _.startCase(data.cityname),
          state: _.startCase(data.statename),
          country: _.startCase(data.countryname),
          temperature: (responseWeather.main.temp - 273.15).toFixed(2),
          weatherType: responseWeather.weather[0].main,
          wind: responseWeather.wind.speed * 3.6,
          humidity: responseWeather.main.humidity,
        }
        console.log("this.weatherData==Weather==", this.weatherData)
      }
    });

  }
  async filters(type: string, param: string) {

    try {
        console.log(type, param);
         if (type === 'date') {
            this.timeFilter = param;
          //  if (Object.keys(this.filter).length > 0) {

                var filter: any = await this.formatDate(param);
                //this.filter = this.filter + filter;
                if (filter.filter === 'This Week' || filter.filter === 'This Month' || filter.filter === 'Last Month') {
                    if (this.filter && this.filter.date) {
                        delete this.filter.date;
                    }
                    this.filter.startDate = filter.startDate;
                    this.filter.endDate = filter.endDate;
                    this.filter.filter = filter.filter;
                }
                else if (filter.filter === 'Today' || filter.filter === 'Yesterday') {
                    if (this.filter && this.filter.startDate && this.filter.endDate) {
                        delete this.filter.startDate;
                        delete this.filter.endDate;
                    }
                    this.filter.filter = filter.filter
                    this.filter.date = filter.date;
                }

                else if (filter.filter === 'Custom') {
                    if (this.filter && this.filter.date) {
                        delete this.filter.date;
                    }
                    if(filter.startDate && filter.endDate) {
                        this.filter.startDate = filter.startDate;
                    this.filter.endDate = filter.endDate;
                    this.filter.filter = filter.filter;
                    }

                }
                if(filter.startDate && filter.endDate) {
                }


              }


    } catch (error) {
        console.log('ERROR:', error);
    }


}

formatDate(param) {
    return new Promise((resolve, reject) => {
        if (param === 'Today') {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            resolve({ 'date': [year, month, day].join('-'), 'filter': param })
            // return [year, month, day].join('-');
        } else if (param === 'Yesterday') {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + (d.getDate() - 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            resolve({ 'date': [year, month, day].join('-'), 'filter': param });
            //return [year, month, day].join('-');
        } else if (param === 'Last Month') {
            resolve({ 'startDate': moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'), 'endDate': moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'), 'filter': param })
            // resolve('&' + `startDate=${[year, month, day].join('-')}` + '&' + `endDate=${[year, month, 30].join('-')}` +  '&' + `filter=${param}`);
            // resolve({'startDate':[year, month, day].join('-'), 'endDate':[year, month, 30].join('-')});
        }
        else if (param === 'This Month') {
            resolve({ 'startDate': moment().startOf('month').format('YYYY-MM-DD'), 'endDate': moment().endOf('month').format('YYYY-MM-DD'), 'filter': param });
            // resolve('&' + `startDate=${[year, month, day].join('-')}` + '&' + `endDate=${[year, month, 30].join('-')}` +  '&' + `filter=${param}`);

        } else if (param === 'This Week') {
            resolve({ 'startDate': moment().startOf('week').format('YYYY-MM-DD'), 'endDate': moment().endOf('week').format('YYYY-MM-DD'), 'filter': param })
            //  resolve('&' + `startDate=${[year, month, startDate].join('-')}` + '&' + `endDate=${[year, month, day].join('-')}` +  '&' + `filter=${param}`);
        }
        else if (param === 'Custom') {
            const dialogConfig = new MatDialogConfig();
            let dialogRef = this.matDialog.open(CustomDateComponent, {
                autoFocus: false,
                height: '350px', width: '450px', data: { "details": "", "action": "Add",selectedDate:this.customeSelectedDate}
            });


            dialogRef.afterClosed().subscribe(value => {
                console.log("Value=======",value);
                this.customeSelectedDate=value;
                resolve({ 'startDate': value.startDate, 'endDate': value.endDate, 'filter': param })
            });
        }
    })
}

  getTranformerHealthIndex(transformerID){
    console.log("Health Index Transformer id",transformerID);
    this.oilTempValues = 0;
    this.windingTempValues=0;
    this.oilLevelValues = 0;
    this.healthOfTransformer = 0;
    this.loadPercentageValue = 0;
    this.oilLevelIndicator = '0';
            this._dashboardService.getTransformerHealthIndex(transformerID).subscribe((response: any) => {

                console.log("All Health Index DATA",response);
                for(let i=0 ; i< this.LoadPercentages.length;i++){
                  if(this.LoadPercentages[i].transformerid == transformerID){
                      this.loadPercentageValue = (this.LoadPercentages[i].data).toFixed(2);
                      if(this.loadPercentageValue == "NaN"){
                        this.loadPercentageValue = 0;
                      }
                  }
                }
               
                this._dashboardService.parameterConfig(transformerID).subscribe((response1: any) => {
                  if(response1.result.length > 0){
                for(let i=0;i<this.transformerDataForHealthIndex.length;i++){

                  if(this.transformerDataForHealthIndex[i].transformerid == transformerID ){
                    if(response1.result[0].oiltemperature == '1'){
                      this.oilTempValues = this.transformerDataForHealthIndex[i].Oil_Temperature;
                    }
                    if(response1.result[0].windingtemperature == '1'){
                      if(this.transformerDataForHealthIndex[i].hasOwnProperty("Winding_Temperature")){
                        this.windingTempValues = this.transformerDataForHealthIndex[i].Winding_Temperature;
                      }
                    }
                    if(this.transformerDataForHealthIndex[i].Winding_Temperature < 0){
                      this.windingTempValues = 0;
                    }
                    if(response1.result[0].oillevel == '1'){
                        if(this.transformerDataForHealthIndex[i].Oil_Level == 4){
                          this.oilLevelValues = 20;
                          this.oilLevelIndicator = "LOW";
                        } else if(this.transformerDataForHealthIndex[i].Oil_Level == 5){
                          this.oilLevelValues = 50;
                          this.oilLevelIndicator = "MEDIUM"
                        } else if(this.transformerDataForHealthIndex[i].Oil_Level == 6){
                          this.oilLevelValues = 85;
                          this.oilLevelIndicator = "HIGH";
                        }
                    }
                    if(response1.result[0].windingtemperaturebycal == '1'){
                      if(this.transformerDataForHealthIndex[i].Oil_Temperature !== 0 && this.windingTempValues == 0){
                        var jsonReadings = JSON.parse(this.transformerDataForHealthIndex[i].readings);
                        var addition: number = Number(jsonReadings.L1)+Number(jsonReadings.L2)+Number(jsonReadings.L3);
                        var LoadPercentage: number = ((addition/3)/Number(this.transformerDataForHealthIndex[i].kvarating))*100;
                          this.windingTempValues = Number((Number(this.transformerDataForHealthIndex[i].Oil_Temperature)+((this.transformerDataForHealthIndex[i].kwhreading*LoadPercentage)/100)).toFixed(2));
                          if(this.windingTempValues == NaN){
                            this.windingTempValues = 0;
                          }
                      }
                    }
                  }
                }
                console.log("Calculated Winding Tempareture value",this.calculatedWindingTemprature);
                if (response.data.length > 0) {
                this.healthOfTransformer = response.data[0].percentage;
                if(this.healthOfTransformer >= 85){
                   this.healthColor = "green";
                } else if(this.healthOfTransformer < 85 && this.healthOfTransformer >= 70){
                  this.healthColor = "orange";
                } else if(this.healthOfTransformer < 70 ){
                  this.healthColor = "red";
                }
              }
            }
    });
  });
  }

  transformerSelectionWeather(selectedTransformer) {
    if (this.selectedTransformerForWeather) {
      this.getWeatherData(selectedTransformer);
    }
  }
}
