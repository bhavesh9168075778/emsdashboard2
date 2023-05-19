import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { DashboardService } from '../services/dashboard.service';
import * as moment from 'moment';
import * as _ from "lodash";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { trigger } from '@angular/animations';
import { ReportService } from '../services/report.service';
import {  MatTableDataSource } from '@angular/material';
import { filter } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TransformerManagerService } from 'src/app/services/transformerManager.service';
import { Console } from 'console';

@Component({
  selector: 'app-individual-dashboard',
  templateUrl: './individual-dashboard.component.html',
  animations:[
    trigger('fadeIn',[

    ])
  ],
  styleUrls: ['./individual-dashboard.component.css']
})
export class IndividualDashboardComponent implements OnInit {
      public innerWidth: any;
      public canvasWidth ;
      public needleValue ;
      public centralLabel ;
      public name ;
      public bottomLabel;
      public options ;
      public ValuesForOilTemp;
      public markerSize: number;
      public pointerCap: Object;
      public lineStyle: Object;
      public RangeColor: any;
      public valueForPhaseA: any;
      public valueForPhaseB: any;
      public valueForPhaseC: any;
      public latestDataDate: any;
      public pointerBorder: Object;
      paramFilter: string;
      allParameters = [];
      commonColumns = ["Transformer Id", "Deviceid", "DATE"];
      physicalParams: any;
      electricalParams = [];
      reportColumns: any;
      dataSource;
      filter: any = {};
      date: any = {};
      phaseActivePower;
      kvarating:any;
      avgPowerFactorValue;
      windingtemprature: any[] = [];
      parameterValuedisplay:any={};
      gradient : any;
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
          text: 'Value',
          font: {
            family: 'Arial',
            size: 18,
            color: '#000000'
          }
        }
      },
      shapes: []
    },
    config: { displaylogo: false, modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'] }
  };

  selectedTransformer = null;
  transformerList = [];
  AverageVoltageValue;
  PhaseApparentPowerValue;
  selectedParameter = null;
  parameterList = [];
  parameterListTemp = [];
  masterparameterList = [];

  durationList = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
    { id: 5, name: 'Last Month' },
    { id: 6, name: 'Custom' }
  ];
  selectedDuration = this.durationList[0];

  showDateRange: boolean;

  data = [];
  showtableData = false;
  tableData;

  ageTransformer;
  constructor(private globalService: GlobalService,private  reportService: ReportService, private _dashboardService: DashboardService, private transformerMangSer: TransformerManagerService,private ngxLoader: NgxUiLoaderService) {
  }

  async ngOnInit() {
    this.markerSize = 10;
    this.pointerCap = {
        radius: 7,
        border: {
            width: 5
        }
    };
    this.pointerBorder= {
      color: 'green',
      width: 1
  };
    this.lineStyle = {
      color: 'red'
  };
    this.ngxLoader.startLoader('individualdashboard');
    let payloadtogetTransformer = {
      "countryid": null,
      "stateid": null,
      "cityid": null,
      "zoneid": null,
      "locationid": null,
      "transformerid": null,
    }
    await this.getParameterList();
    await this.getfilteredTransformers(JSON.stringify(payloadtogetTransformer), JSON.stringify(localStorage.getItem('userData')));
    this.ngxLoader.stopLoader('individualdashboard');
  }

  getParameterList() {
    return new Promise((resolve, reject) => {
      this.globalService.golbalMaster('filterparameters').subscribe((response: any) => {
        if (response && response.code === '1' && response.result.length > 0) {
          console.log('response====Filter Parameters========', response);
          //this.selectedParameter = response.result[0];
          //this.parameterList = response.result;
          this.parameterListTemp = response.result;
          resolve(this.parameterListTemp);
        }
      });
    });
  }

  getfilteredTransformers(payloadtogetTransformer, userData) {
    return new Promise((resolve, reject) => {
      this.globalService.getfilteredTransformers(payloadtogetTransformer, localStorage.getItem('userData')).subscribe((response: any) => {
        this.ngxLoader.stopLoader('individualdashboard');
        if (response && response.code === '1' && response.result.length > 0) {
          console.log('response=====Individual Dashboard=========', response);
          this.selectedTransformer = response.result[0];
          this.transformerList =response.result.map((a:any) => {
            a.transformerDetail=a.transformerid + "[" + a.sitename + "]";
            return a;
          })
          //this.transformerList = response.result;
          //this.setParameterListForTransformer(this.selectedTransformer);
          let currentDate = moment(moment().format('YYYY-MM-DD'));
          let manufactureYear = moment(moment(this.selectedTransformer.manufacturingdate).format('YYYY-MM-DD'));
          this.ageTransformer = currentDate.diff(manufactureYear, 'years');
          let duration = this.durationSelectionAlert({ id: 1, name: 'Today' });
          this.getData(this.selectedTransformer, this.selectedParameter, duration);
          resolve(this.transformerList);
        }
      });
    });
  }
  /* setParameterListForTransformer(selectedTransformer: any) {
    if (selectedTransformer.harmonic_current === 0) {
      this.parameterList = _.remove(this.parameterList, function (n) {
        return n.name !== "Harmonics Current";
      });
    }
    if (selectedTransformer.harmonic_voltage === 0) {
      this.parameterList = _.remove(this.parameterList, function (n) {
        return n.name !== "Harmonics Voltage";
      });
    }
    if (selectedTransformer.systemKwh === "0") {
      this.parameterList = _.remove(this.parameterList, function (n) {
        return n.name !== "System_kwh";
      });
    }
  } */

  durationSelectionAlert(selectedDuration) {
    console.log('selectedDuration====', selectedDuration)
    let date = {
      startdate: moment().format('YYYY-MM-DD'),
      enddate: moment().format('YYYY-MM-DD'),
      filters:'Today'
    };
    if (selectedDuration.id == 2) {
      date.startdate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      date.enddate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      date.filters = 'Yesterday';
    }
    if (selectedDuration.id == 3) {
      date.startdate = moment().startOf('week').format('YYYY-MM-DD');
      date.enddate = moment().endOf('week').format('YYYY-MM-DD');
      date.filters = 'This Week';
    }
    if (selectedDuration.id == 4) {
      date.startdate = moment().startOf('month').format('YYYY-MM-DD');
      date.enddate = moment().endOf('month').format('YYYY-MM-DD');
      date.filters = 'This Month';
    }
    if (selectedDuration.id == 5) {
      date.startdate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
      date.enddate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      date.filters = 'Last Month';
    }
    if (selectedDuration.id == 6) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
    console.log('selectedDuration==durationSelectionAlert==', date)
    return date;
  }

  transformerSelection(selectedTransformer) {
    /* this.parameterList=_.cloneDeep(this.parameterListTemp);
    this.setParameterListForTransformer(selectedTransformer); */
    let currentDate = moment(moment().format('YYYY-MM-DD'));
    let manufactureYear = moment(moment(selectedTransformer.manufacturingdate).format('YYYY-MM-DD'));
    this.ageTransformer = currentDate.diff(manufactureYear, 'years');
    const selectedDuration = this.durationSelectionAlert(this.selectedDuration);
    this.getData(selectedTransformer, this.selectedParameter, selectedDuration);
  }

  parameterSelection(selectedParameter) {
    const selectedDuration = this.durationSelectionAlert(this.selectedDuration);
    this.getData(this.selectedTransformer, selectedParameter, selectedDuration);
  }

  durationSelection(selectedDuration) {
    const duration = this.durationSelectionAlert(selectedDuration);
    this.getData(this.selectedTransformer, this.selectedParameter, duration);
  }

  changeDateRange(event) {
    console.log("event----------", event)
    if (this.showDateRange) {
       this.date = {
        startdate: moment(event.value[0]).format('YYYY-MM-DD'),
        enddate: moment(event.value[1]).format('YYYY-MM-DD'),
        filters: "Custom"
      };
      this.getData(this.selectedTransformer, this.selectedParameter, this.date);
    }
  }

  getData(selectedTransformer, selectedParameter, selectedDuration) {
    this.ngxLoader.startLoader('individualdashboardgraph');
    console.log('payload=====Selected Parameter====', selectedParameter);
    //let duration = this.durationSelectionAlert(selectedDuration);
    let payload = { transformerid: '', startdate: '', enddate: '' };
    payload.transformerid = `'${selectedTransformer.transformerid}'`;
    payload.startdate = selectedDuration.startdate;
    payload.enddate = selectedDuration.enddate;

    this.filter.transformerId = selectedTransformer.transformerid;
    if(selectedDuration.filters === 'Today' || selectedDuration.filters === 'Yesterday'){
        this.filter.filter = selectedDuration.filters;
        this.filter.date = selectedDuration.enddate;
    }
    else if (selectedDuration.filters  === 'This Week' || selectedDuration.filters  === 'This Month' || selectedDuration.filters  === 'Last Month') {
            this.filter.filter = selectedDuration.filters;
            this.filter.startDate = selectedDuration.startdate;;
            this.filter.endDate = selectedDuration.enddate;
          }


    else if(selectedDuration.startdate && selectedDuration.enddate) {
            console.log("In custom date");
            delete this.filter.date;
            console.log("selected duration start date", selectedDuration.startdate+"Selected Duration  lasrdate",selectedDuration.enddate)
            this.filter.filter = selectedDuration.filters;
            this.filter.startDate = selectedDuration.startdate;
            this.filter.endDate = selectedDuration.enddate;
          }
    this.windingtemprature = [];
    console.log("Filters for winding temp",this.filter);
    this.reportService.getReportData(this.filter).toPromise().then(async (response: any) => {
      // this.transformerIds = await this.getDdlData();
       this.allParameters = this.commonColumns.concat(response.physicalParams, response.electricalParam);
       console.log("Table Column data",this.allParameters );
       this.physicalParams = this.commonColumns.concat(response.physicalParams);
       this.electricalParams = this.commonColumns.concat(response.electricalParam);
       if (this.paramFilter === 'Physical Parameters') {
           this.reportColumns = this.commonColumns.concat(response.physicalParams);
       } else if (this.paramFilter === 'Electrical Params') {
           if (response.electricalParam.length > 0) {
               this.reportColumns = this.commonColumns.concat(response.electricalParam);
           } else {
               this.reportColumns = [];
           }
       }
       else if (this.paramFilter === 'All') {
           this.reportColumns = this.commonColumns.concat(response.physicalParams, response.electricalParam);
       } else {
           if(response && response.physicalParams && response.electricalParam && response.reportData && response.reportData.length > 0) {
               this.reportColumns = this.commonColumns.concat(response.physicalParams, response.electricalParam);
           } else {
               this.reportColumns = [];
           }
       }
       if(response && response.reportData && response.reportData.length > 0) {
           this.dataSource = new MatTableDataSource(response.reportData);
            this.PhaseApparentPowerValue = response.reportData[response.reportData.length-1]['3_Phase_Apparent_Power'];
            this.avgPowerFactorValue = response.reportData[response.reportData.length-1]['Avg_Power_Factor'];
            this.phaseActivePower = response.reportData[response.reportData.length-1]['3_Phase_Active_Power'];
           console.log('REPORT DATA:', response.reportData);

           this.transformerMangSer.getTransformerDetails({transformerId: selectedTransformer.transformerid, deletedFlag:'D'}).subscribe((response:any) => {
            console.log('TransformerDetails:', response);
            this.gradient =  response.details.message.description[0]['kwhreading'];
            this.kvarating = response.details.message.description[0]['ratedLoad'];
          })
           const columnLength =response.reportData.length;
           let arr:number[] = new Array();
           for(let i=0; i<columnLength; i++){

             var addition: number = Number(response.reportData[i]['L1'])+Number(response.reportData[i]['L2'])+Number(response.reportData[i]['L3']);
             var LoadPercentage: number = ((addition/3)/Number(this.kvarating))*100;
             var windingTemprature: number =  Number(response.reportData[i]['Oil_Temperature'])+((this.gradient*LoadPercentage)/100);

             this.windingtemprature.push(windingTemprature.toFixed(2));

           }
           console.log("Winding Temprature", this.windingtemprature);

           this.data = response.reportData;

       } else {
           this.dataSource = [];
           this.data = [];
       }

   })

    console.log('payload=========', payload);
    let filteredParams: any = [];
    this._dashboardService.loadIndividualDashboard(payload).subscribe((response: any) => {
      /*       if (response && response.code === '1') {
              let params: any = response.physicalParams;
              // const elecParams: any = response.elecParams;
              // if ( elecParams &&  elecParams.length > 0) {
                const elecParameters = ['KVA', 'PF', 'Ampere', 'Voltage', 'Harmonics Current', 'Harmonics Voltage', 'Load Percentage', 'I Unbalance', 'V Unbalance', 'V Variance', 'KVAr', 'KW', 'KWh'];
                params =  params.concat(elecParameters)
             // }
              this.masterparameterList.map(x => {
                if (params.includes(x.name)) {
                  filteredParams.push(x);
                }

              });
            }
            this.parameterList = filteredParams; */
      if (response && response.code === '1' && response.result.length > 0) {
        let isParameter = false;
        for(let i=0;i<response.elecParams.length;i++){
          if(response.elecParams[i] == 'Lug Temperature'){
            isParameter = true;
          }
        }
        let params: any = response.physicalParams;
        const elecParameters = ['KVA', 'PF', 'Ampere', 'Voltage', 'Load Percentage', 'I Unbalance', 'V Unbalance', 'V Variance', 'KVAr', 'KW','Lug Temperature']
        params = params.concat(elecParameters);
        console.log("Params++++++++++++",isParameter);
        for (let i = 0; i < this.parameterListTemp.length; i++) {
          const element = this.parameterListTemp[i];
          if (params.includes(element.name)) {
            if(element.name == "Lug Temperature"){
              if(isParameter){
                filteredParams.push(element);
              }
          } else {
            filteredParams.push(element);
          }
          }
        }
        filteredParams=_.map(filteredParams,(o:any)=>{
          if(o.name === 'Harmonics Current'){
            o.name= 'Current THD';
          }else if(o.name === 'Harmonics Voltage'){
            o.name= 'Voltage THD';
          }
          return o;
        })
        this.parameterList = filteredParams;
        console.log("All Parameters",this.parameterList);
        //console.log("Params+++++parameterList+++++++",this.parameterList);
        if (selectedParameter) {
        } else {
          this.selectedParameter = this.parameterList[0];
          selectedParameter = this.parameterList[0];
          //console.log("+++++this.selectedParameter+++++++",this.selectedParameter);
        }
        this.ngxLoader.stopLoader('individualdashboardgraph');
        console.log("Waveform result",response)
        let responseData = _.flatMap(response.result, (o: any) => {
          let readings = JSON.parse(o.readings);
          o.modifiedreadings = readings;
          o.Load =   ((((Number(readings.L1) + Number(readings.L2) + Number(readings.L3)) / 3) / Number(o.ratedLoad)) * 100);
          let avgCurrent = (readings.L1 + readings.L2 + readings.L3) / 3;
          let currentDeviation = _.maxBy([(readings.L1 - avgCurrent), (readings.L2 - avgCurrent), (readings.L3 - avgCurrent)]);
          o.iUnbalance = ((currentDeviation * 100) / avgCurrent).toFixed(2);
          let avgVoltage = (readings.RY_Voltage + readings.YB_Voltage + readings.BR_Voltage) / 3;
          let voltageDeviation = _.maxBy([(readings.RY_Voltage - avgVoltage), (readings.YB_Voltage - avgVoltage), (readings.BR_Voltage - avgVoltage)]);
          o.vUnbalance = ((voltageDeviation * 100) / avgVoltage).toFixed(2);
          o.Frequency = readings.Frequency;
          return o;
        });

        console.log('response====loadIndividualDashboard======', response);
        let filter = this.getSelectedParameterFilter(selectedParameter,response.paramsalertValues);
        if (selectedParameter.showcalulationtable == 1) {
          this.showtableData = true;
        } else {
          this.showtableData = false;
        }
        this.getChartData(responseData, filter);
      } else {
        this.showtableData = false;
        this.data = [];
        this.ngxLoader.stopLoader('individualdashboardgraph');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('individualdashboardgraph');
    });
  }

  getSelectedParameterFilter(selectedParameter,paramsalertValuesList) {
    let parameterValue:any={};
    this.parameterValuedisplay={};
    let obj = { filter: '', type: 'direct', phases: null ,parameterValue:null,ismultiBreakpoint:false,multiBreakpointValue:[]}
    if (selectedParameter.id == 1) {
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apOiltemperature"});
      obj.filter = 'Oil_Temperature';
      /* this.parameterValuedisplay.name1="Oil Temperature";
      this.parameterValuedisplay.value1=parameterValue.parameterValue; */
      obj.parameterValue=parameterValue.parameterValue;
    }
    if (selectedParameter.id == 2) {
      this.parameterValuedisplay.name1="Rated KVA ";
      this.parameterValuedisplay.value1=this.selectedTransformer.kvarating;
      obj.phases = { phaseA: 'R_apparent_Power', phaseB: 'Y_apparent_Power', phaseC: 'B_apparent_Power' };
    }
    if (selectedParameter.id == 3) {
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apLowPowerfactor"});
      obj.phases = { phaseA: 'R_Power_Factor', phaseB: 'Y_Power_Factor', phaseC: 'B_Power_Factor' };
      obj.filter = 'PF';
      /* this.parameterValuedisplay.name1="PF";
      this.parameterValuedisplay.value1=parameterValue.parameterValue; */
      obj.parameterValue=parameterValue.parameterValue;
    }
    if (selectedParameter.id == 4) {
      obj.filter = 'Frequency';
    }
    if (selectedParameter.id == 5) {
      obj.ismultiBreakpoint=true;
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apOverload"});
      obj.multiBreakpointValue.push(parameterValue.parameterValue);
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apUnderload"});
      obj.multiBreakpointValue.push(parameterValue.parameterValue);
      /*
      this.parameterValuedisplay.name1="OverLoad";
      this.parameterValuedisplay.value1=parameterValue.parameterValue;
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apUnderload"});
      this.parameterValuedisplay.name2="Underload";
      this.parameterValuedisplay.value2=parameterValue.parameterValue; */


      obj.phases = { phaseA: 'L1', phaseB: 'L2', phaseC: 'L3' };
    }
    if (selectedParameter.id == 6) {
      obj.ismultiBreakpoint=true;
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apHighvolt"});
      obj.multiBreakpointValue.push(parameterValue.parameterValue);
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apLowvolt"});
      obj.multiBreakpointValue.push(parameterValue.parameterValue);
      obj.phases = { phaseA: 'R_Ph_N', phaseB: 'Y_Ph_N', phaseC: 'B_Ph_N' };
    }
    if (selectedParameter.id == 7) {
      obj.phases = { phaseA: 'IR_THD', phaseB: 'IY_THD', phaseC: 'IB_THD' };
    }
    if (selectedParameter.id == 8) {
      obj.phases = { phaseA: 'VR_THD', phaseB: 'VY_THD', phaseC: 'VB_THD' };
    }
    if (selectedParameter.id == 9) {
      obj.filter = 'Ambient_Temperature';
    }
    if (selectedParameter.id == 10) {
      obj.filter = 'Humidity';
    }
    if (selectedParameter.id == 11) {
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apWindingtemperature"});
      obj.filter = 'Winding_Temperature';
      /* this.parameterValuedisplay.name1="Winding Temperature";
      this.parameterValuedisplay.value1=parameterValue.parameterValue; */
      obj.parameterValue=parameterValue.parameterValue;
    }
    if (selectedParameter.id == 12) {
      obj.filter = 'Load';
    }
    if (selectedParameter.id == 13) {
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apIunbalance"});
      obj.filter = 'iUnbalance';
      /* this.parameterValuedisplay.name1="I Unbalance";
      this.parameterValuedisplay.value1=parameterValue.parameterValue; */
      obj.parameterValue=parameterValue.parameterValue;
    }
    if (selectedParameter.id == 14) {
      parameterValue=_.find(paramsalertValuesList,{parameterName: "apVunbalance"});
      obj.filter = 'vUnbalance';
      /* this.parameterValuedisplay.name1="V Unbalance";
      this.parameterValuedisplay.value1=parameterValue.parameterValue; */
      obj.parameterValue=parameterValue.parameterValue;
    }
    if (selectedParameter.id == 15) {
      obj.phases = { phaseA: 'R_Ph_N', phaseB: 'Y_Ph_N', phaseC: 'B_Ph_N' };
    }
    if (selectedParameter.id == 16) {
      obj.phases = { phaseA: 'R_Reactive_Power', phaseB: 'Y_Reactive_Power', phaseC: 'B_Reactive_Power' };
    }
    if (selectedParameter.id == 17) {
      obj.phases = { phaseA: 'R_Active_Power', phaseB: 'Y_Active_Power', phaseC: 'B_Active_Power' };
      obj.filter = 'KW';
    }
    if (selectedParameter.id == 18) {
      obj.filter = 'System_kwh';
      obj.type = 'json';
    }
    if (selectedParameter.id == 19) {
      obj.filter = 'Oil_Level';
    }
   
    if (selectedParameter.id == 20) {
      obj.filter = 'Winding_Temp_By_Cal';
    }
    if (selectedParameter.id == 21) {
      obj.phases = { phaseA: 'Lug_Temp_R', phaseB: 'Lug_Temp_Y', phaseC: 'Lug_Temp_B' };
      
    }
    return obj;
  }


  getChartData(data, filterObj) {
    this.data = [];
    this.graph.layout.shapes = [];
    if (filterObj.parameterValue) {
      this.graph.layout.shapes = [
        {
          type: 'line',
          xref: 'paper',
          x0: 0,
          y0: filterObj.parameterValue,
          x1: 1,
          y1: filterObj.parameterValue,
          line: {
            color: 'rgb(255, 0, 0)',
            width: 4
          }
        }
      ];
    }else if(filterObj.ismultiBreakpoint){
      for (let i = 0; i < filterObj.multiBreakpointValue.length; i++) {
        this.graph.layout.shapes.push({
          type: 'line',
          xref: 'paper',
          x0: 0,
          y0: filterObj.multiBreakpointValue[i],
          x1: 1,
          y1: filterObj.multiBreakpointValue[i],
          line: {
            color: 'rgb(255, 0, 0)',
            width: 4
          }
        })

      }
    }
    if (filterObj.filter && filterObj.type === 'direct') {
      let filterKey = filterObj.filter;
      console.log(" Selected value",filterKey);
      let needsvalue;
      let bottomvalue;
      let value = _.map(data, filterKey);
      if(filterKey == "Winding_Temp_By_Cal"){
        value = this.windingtemprature;
      }
      const time = _.map(data, 'DATE');
      this.innerWidth = window.innerWidth;
      console.log("Window  Size",this.innerWidth)
      let lengthofarray = value.length-1;
      if(value[lengthofarray] == 4 ){
        needsvalue = 10;
        bottomvalue = '30%';
      } else if(value[lengthofarray] == 5){
        needsvalue = 50;
        bottomvalue = '50%';
      } else if(value[lengthofarray] == 6){
        needsvalue = 90;
        bottomvalue = '90%';
      } else {
        needsvalue = 0;
        bottomvalue = '0%';
      }
      let widthOfCanvas;
     if(this.innerWidth < 500){
        widthOfCanvas = 350;
     } else {
        widthOfCanvas = 700;
     }
         this.canvasWidth = widthOfCanvas
         this.needleValue = needsvalue
         this.centralLabel = ''
        this.name = ''
        this.bottomLabel = ''
        this.options = {
            hasNeedle: true,
            needleColor: 'black',
            needleUpdateSpeed: 5000,
            arcColors: ['red','green','red'],
            arcDelimiters: ['20','80'],
            rangeLabel: ['Low','High'],
            needleStartValue: 0,
        }


      const selectedDuration = this.durationSelectionAlert(this.selectedDuration);
      var startdate = new Date(selectedDuration.startdate);
      var enddate = new Date(selectedDuration.enddate);

      var time_difference = startdate.getTime() - enddate.getTime();
      var days_difference = -(time_difference / (1000*60*60*24)) % 365;
      console.log("drtn=",days_difference);
      /* const date = _.map(data, 'mdate'); */
      console.log("====getOilTempData======", value, time);
      let ValuesOilTemp=value.length-1;
      this.ValuesForOilTemp = value[ValuesOilTemp];
      if(filterObj.parameterValue == null){
        this.RangeColor = "green";
      } else {
          if(this.ValuesForOilTemp >=filterObj.parameterValue){
              this.RangeColor = "red";
          } else {
            this.RangeColor = "green";
          }
      }
      console.log("oil temp data",filterObj.parameterValue);
      if(days_difference >= 4){
        let traces = {
          x: time,
          y: value,
          mode: 'lines',
          type: 'scatter',
          /*  text: date */
        };
        this.data = [traces];
        console.log("====getOilTempData=traces=====", this.data);
      } else {
        let traces = {
          x: time,
          y: value,
          mode: 'lines+markers',
          type: 'scatter',
          /*  text: date */
        };
        this.data = [traces];
        console.log("====getOilTempData=traces=====", this.data);
      }

      if (this.showtableData) {
        this.tableData = {
          max: _.maxBy(data, filterKey)[filterKey],
          min: _.minBy(data, filterKey)[filterKey],
          range: _.maxBy(data, filterKey)[filterKey] - _.minBy(data, filterKey)[filterKey],
          avg: _.sumBy(data, (o: any) => Number(o[filterKey])) / data.length
        };
        console.log("====tableData=showtableData=====", this.tableData);
      }
    } else if (filterObj.filter && filterObj.type === 'json') {
      let filterKey = filterObj.filter;
      let value = _.map(data, (o: any) => { return o.modifiedreadings[filterKey] });

      const time = _.map(data, 'DATE');
      /*  const date = _.map(data, 'mdate'); */
      console.log("====getOilTempData==ELSE====", value, time);
      let traces = {
        x: time,
        y: value,
        mode: 'lines+markers',
        type: 'scatter',
        /* text: date */
      };

      this.data = [traces];
    }

    if (filterObj.phases) {
      let filterKey = filterObj.phases;
      var phaseAValue;
      var phaseBValue;
      var phaseCValue;
      if( filterObj.filter == "KW" || filterObj.filter == "PF") {
           phaseAValue = _.map(data, (o: any) => { return  Math.abs(o.modifiedreadings[filterKey.phaseA]) });
           phaseBValue = _.map(data, (o: any) => { return  Math.abs(o.modifiedreadings[filterKey.phaseB]) });
           phaseCValue = _.map(data, (o: any) => { return  Math.abs(o.modifiedreadings[filterKey.phaseC]) });
       } else {
         phaseAValue = _.map(data, (o: any) => { return  o.modifiedreadings[filterKey.phaseA] });
         phaseBValue = _.map(data, (o: any) => { return  o.modifiedreadings[filterKey.phaseB] });
         phaseCValue = _.map(data, (o: any) => { return  o.modifiedreadings[filterKey.phaseC] });
       }
       let averageVoltageData =  _.map(data, (o: any) => { return o['Average_Voltage'] }); 
       let lengthForAValue = phaseAValue.length-1;
       this.valueForPhaseA = phaseAValue[lengthForAValue];
       this.valueForPhaseB = phaseBValue[lengthForAValue];
       this.valueForPhaseC = phaseCValue[lengthForAValue];
       this.AverageVoltageValue = averageVoltageData[lengthForAValue];
       

      const time = _.map(data, 'DATE');
      const date = _.map(data, 'mdate');
      const timelength = time.length -1;
      this.latestDataDate = time[timelength] ;
      console.log("latest Date",this.latestDataDate);
      let traces1 = {
        x: time,
        y: phaseAValue,
        name: 'R Phase',
        mode: 'lines+markers',
        type: 'scatter',
        marker:{
          color:'red'
        }
        /*  text: date */
      };
      let traces2 = {
        x: time,
        y: phaseBValue,
        name: 'Y Phase',
        mode: 'lines+markers',
        type: 'scatter',
        marker:{
          color:'yellow'
        }
        /* text: date */
      };
      let traces3 = {
        x: time,
        y: phaseCValue,
        name: 'B Phase',
        mode: 'lines+markers',
        type: 'scatter',
        marker:{
          color:'blue'
        }
        /* text: date */
      };
      console.log("====getOilTempData=traces=PHASES====", data,filterObj.phases);
      let tracesList:any=[traces1, traces2, traces3];
      if(filterObj.phases.phaseA === 'L1'){
        const tempTraces={
        x:  time,
        y: _.map(data, (o: any) => { return o.modifiedreadings['LN'] }),
        name: 'LN',
        mode: 'lines+markers',
        type: 'scatter',
        marker:{
          color:'green'
        }
        };
        tracesList.push(tempTraces);
      }

      if(filterObj.phases.phaseA === 'R_Power_Factor'){
        const tempTraces={
          x:  time,
          y: _.map(data, (o: any) => { return Math.abs(o.modifiedreadings['Avg_Power_Factor']) }),
          name: 'Avg Power Factor',
          mode: 'lines+markers',
          type: 'scatter',
          marker:{
            color:'green'
          }
          };
          tracesList.push(tempTraces);
      }

      if(filterObj.phases.phaseA === 'R_Ph_N'){
        const tempTraces={
          x:  time,
          y: _.map(data, (o: any) => { return o['Average_Voltage'] }),
          name: 'Avg Voltage',
          mode: 'lines+markers',
          type: 'scatter',
          marker:{
            color:'green'
          }
          };
          tracesList.push(tempTraces);
      }
      if(filterObj.phases.phaseA === 'R_apparent_Power'){
        console.log("oiuhuhuh",data)
        const tempTraces={
          x:  time,
          y: _.map(data, (o: any) => { return o['3_Phase_Apparent_Power'] }),
          name: '3 Phase Apparent Power ',
          mode: 'lines+markers',
          type: 'scatter',
          marker:{
            color:'green'
          }
          };
          tracesList.push(tempTraces);
      }
      if(filterObj.phases.phaseA === 'R_Active_Power'){
        console.log("oiuhuhuh",data)
        const tempTraces={
          x:  time,
          y: _.map(data, (o: any) => { return o['3_Phase_Active_Power'] }),
          name: '3 Phase Active Power ',
          mode: 'lines+markers',
          type: 'scatter',
          marker:{
            color:'green'
          }
          };
          tracesList.push(tempTraces);
      }
      this.data = tracesList;
    }


  }


}
