import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TransformerManagerService } from '../services/transformerManager.service';
import { DeviceMasterService } from '../services/device-master.service';
import { EmsdashboardService } from '../services/emsdashboard.service';
import { CustomDateComponent } from '../reports/customdate/custom-date.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { DateTime } from '@syncfusion/ej2-angular-charts';

interface MyData {
  startTime: string;
  type: string;
  threshold: string;
  actual: string;
}

@Component({
  selector: 'app-ems-individual-dashboard',
  templateUrl: './ems-individual-dashboard.component.html',
  styleUrls: ['./ems-individual-dashboard.component.scss']
})

export class EmsIndividualDashboardComponent implements OnInit {


  @ViewChild('energyconsumption_graph', { static: true }) energyconsumption_graph: ElementRef;
  @ViewChild('efficiency_graph', { static: true }) efficiency_graph: ElementRef;
  @ViewChild('individual_graph', { static: true }) individual_graph: ElementRef;
  @ViewChild('chart2', { static: true }) chart: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;



  myData: MyData[] = [
    { startTime: '10:00 AM', type: 'pf', threshold: 'grh', actual: 'hrh' },
    { startTime: '10:00 AM', type: 'pf', threshold: 'hgj', actual: 'rth' },
    { startTime: '10:00 AM', type: 'pf', threshold: 'dj', actual: 'rth' },
    { startTime: '10:00 AM', type: 'pf', threshold: 'hrh', actual: 'htrh' },
  ];

  heading_dummy_alert: string[] = ['startTime', 'type', 'threshold', 'actual'];


  AllEnergyMeterData;
  Deviceid;
  uniqueDeviceId;
  selectedDevice;
  energyMeterId = [];
  energyMeterIdArray;
  selectedEnergyMeter;
  parametersList;
  efficiency_g;
  chart_i;
  chart_e;
  lengtho = 0;
  totalkwhcurrentmonth: any = 0;
  individual_graph_g;
  energyconsumption;
  KWHValue;
  averagepf;
  latestDate;
  meterCountValue;
  digits: number[];
  KWHValuer: any = 0;
  KWHValuel: any = 0;
  selectedTimeDuration;
  selectedParameter;
  meteridforParameters
  customDateRange;
  customeSelectedDate;
  data;
  latestkwh_p;
  pf;
  graphDiv;
  Graphdata;
  dataSource;
  pfValue;
  allData;
  majorTicks = {
    interval: 10,
    color: 'red',
    height: 10,
    width: 3,
    position: 'Inside',
    offset: 5
  };
  minorTicks = {
    interval: 5,
    color: 'green',
    height: 5,
    width: 2,
    position: 'Inside',
    offset: 5
  };
  labelStyles = {
    position: 'Inside',
    format: '{value}',
    offset: 4,
    color: 'red',
    width: 2
  };
  cap = {
    radius: 5,
    border: {
      color: 'red',
      width: 3
    }
  };
  heading: any = [];;
  timeOptions: any = ['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month', 'Custom'];

  jsonArray: any = [];






  ngAfterViewInit() {
    this.graphDiv = this.chart;
    this.energyconsumption = this.energyconsumption_graph;
    this.efficiency_g = this.efficiency_graph;
    this.individual_graph_g = this.individual_graph;
  }

  constructor(private ngxLoader: NgxUiLoaderService, private deviceManagerSer: DeviceMasterService, private transMngSer: TransformerManagerService, private matDialog: MatDialog, private EmsdashboardService: EmsdashboardService) { }

  ngOnInit() {
    this.ngxLoader.startLoader('individual_graph');
    this.getDeiceIds();
  }
  getDeiceIds() {
    this.deviceManagerSer.getEMSDeviceId(JSON.parse(localStorage.getItem('userData')).userid).subscribe((response: any) => {
      if (response.result.length > 0) {

        let Deviceids = []
        response.result.forEach(function (value) {
          Deviceids.push(value.deviceId + "(" + value.sitename + ")");
        });
        this.Deviceid = Deviceids[0]
        this.uniqueDeviceId = Deviceids;
        this.getselectedDeviceIddata(Deviceids[0]);


      }
    });


  }
  getselectedDeviceIddata(deviceid) {
    this.selectedDevice = deviceid;
    this.efficiencygraph();
    this.individual_graph_parameter();

    deviceid = deviceid.split('(')[0];
    this.transMngSer.getEnergyMeters(deviceid).toPromise().then((response1: any) => {
      if (response1.result.length > 0) {
        let energyMeterId = [];
        response1.result.forEach(function (value) {
          energyMeterId.push(value.meterSerialNumber + "(" + value.assetName + ")");
        });
        this.energyMeterIdArray = energyMeterId;


        this.selectedEnergyMeter = energyMeterId[0];
        this.getKwhDATA(deviceid);
        this.EmsdashboardService.getParameterConfig(this.selectedEnergyMeter.split('(')[0]).toPromise().then((response1: any) => {
          if (response1.result.length > 0) {
            let Parameters = response1.result[0];
            delete Parameters['deletedflag'];
            delete Parameters['id'];
            delete Parameters['energyMeterId'];
            console.log(Parameters);
            let paramKeys = []
            for (let keys in Parameters) {
              console.log("Keys", Parameters[keys])
              if (Parameters[keys] == 1) {
                paramKeys.push(keys)
              }
            }
            this.parametersList = paramKeys;
            this.selectedParameter = this.parametersList[0];
            this.selectedTimeDuration = this.timeOptions[0];
            this.filter('DeviceID', this.selectedDevice, 'onLoad');



          }
        });
      }
    });
  }
  getDigits(number: number): number[] {
    let digits = [];
    if (number == 0) {
      digits = [0, 0, 0]
    }
    while (number > 0) {
      let digit = number % 10;
      digits.unshift(digit);
      number = Math.floor(number / 10);
    }

    return digits;
  }

  getKwhDATA(deviceid) {

        this.averagepf=0;
       
        this.transMngSer.getEnergyMeterReportData({ "meterid": this.selectedEnergyMeter.split('(')[0], "duration": "This Month" }).toPromise().then((response: any) => {
          console.log("this is default value for today", response.result)
          var count = 0;
          this.latestkwh_p = 0;
          for (let i = 0; i < response.result.length; i++) {
            this.latestkwh_p = Number(this.latestkwh_p) + Math.abs(Number(response.result[i].latestkwh));
            this.averagepf = Number(this.averagepf) + Math.abs(Number(response.result[i].pf));
            this.totalkwhcurrentmonth = Math.abs(Number(response.result[i].kwh));
            if (Number(Math.abs(response.result[i].pf)) > 0) {
              count++;
            }

          }
          this.totalkwhcurrentmonth = Number(this.totalkwhcurrentmonth).toFixed(0);
          this.latestkwh_p = Number(this.latestkwh_p).toFixed(0);

          this.pf = Number(this.averagepf / count).toFixed(2);
          if (this.averagepf == 0) {
            this.pf = 0;
          }
          this.energyre_co_lo_graph();
          this.ngxLoader.stopLoader('individual_graph');
        
        });
  }

  energyMeterSelection(selectedEnergyMeter) {
    console.log("yes we call it",)
    let dataforGraph = [];
    let lastValues = [];
    let lastpfValues = [];
    let lastDate = [];
    selectedEnergyMeter = selectedEnergyMeter.split('(')[0];
    for (let i = 0; i < this.AllEnergyMeterData.length; i++) {
      if (this.AllEnergyMeterData[i].energyMeterId == selectedEnergyMeter) {
        dataforGraph.push(this.AllEnergyMeterData[i]);
      }
    }

    this.KWHValue = dataforGraph[dataforGraph.length - 1].kwh;
    this.pfValue = dataforGraph[dataforGraph.length - 1].pf;
    console.log("poiuytrewq", this.pfValue)
    for (let j = dataforGraph.length - 2; j > dataforGraph.length - 8; j--) {
      lastValues.push(dataforGraph[j].kwh);
      lastpfValues.push(dataforGraph[j].pf);
      lastDate.push(dataforGraph[j].DATES)
    }
  }
  getmonthdetail(param) {
    this.selectedEnergyMeter = param;
    let meterid = param;
    if (param == "All") {
      meterid = this.meteridforParameters;
    }
    this.transMngSer.getEnergyMeterReportData({ "meterid": param.split('(')[0], "duration": "This Month", "deviceid": this.selectedDevice.split('(')[0], "range": this.customDateRange }).toPromise().then((response: any) => {
      this.latestkwh_p = 0;
      this.averagepf = 0;
      let count = 0;
      for (let i = 0; i < response.result.length; i++) {
        this.latestkwh_p = Number(this.latestkwh_p) + Math.abs(Number(response.result[i].latestkwh));
        this.averagepf = Number(this.averagepf) + Math.abs(Number(response.result[i].pf));
        this.totalkwhcurrentmonth = Math.abs(Number(response.result[i].kwh));
        if (Number(Math.abs(response.result[i].pf)) > 0) {
          count++;
        }

      }
      this.totalkwhcurrentmonth = Number(this.totalkwhcurrentmonth).toFixed(0);
    
      this.pf = Number(this.averagepf / count).toFixed(2);
      if (this.averagepf == 0) {
        this.pf = 0;
      }
      this.latestkwh_p = Number(this.latestkwh_p).toFixed(0);
    });
  }


  filter(type, param, event) {
    this.ngxLoader.startLoader('individual_graph_ems');
    console.log("qqqqqwertyuiopojkhbfvsdvsdvvghghgfhvgvbvjvjygjv", type, param, event)
    this.jsonArray = [];
    if (type == "DeviceID") {
      console.log("if fromfaflnnnnx.cv,bm")
      this.selectedDevice = param;
      this.transMngSer.getEnergyMeters(param.split('(')[0]).toPromise().then((response: any) => {
        let energyMeterId = [];
        response.result.forEach(function (value) {
          energyMeterId.push(value.meterSerialNumber + "(" + value.assetName + ")");
        });
        this.selectedEnergyMeter = energyMeterId[0];
        energyMeterId.push("All");
        this.energyMeterIdArray = energyMeterId;
        this.selectedEnergyMeter = energyMeterId[0];
        this.meteridforParameters = energyMeterId[0].split('(')[0];
        this.selectedTimeDuration = this.timeOptions[0];

        this.transMngSer.getEnergyMeterReportData({ "meterid": energyMeterId[0].split('(')[0], "duration": this.timeOptions[0] }).toPromise().then((response: any) => {

          console.log("deviseid", response.result.Deviceid);
          this.jsonArray = [];
          this.allData =  response.result;
          for (let i = 0; i < response.result.length; i++) {
            const result = response.result[i];
            const date = result.DATE;
            const PF = result.pf;

            let jsonObject = {
              x: date,
              y: PF
            };

            this.jsonArray.push(jsonObject);
          }
          console.log("poiuyhjmmvbmvmvnmvnmvnmvnbjghjgjgk", this.jsonArray);
          this.updateGraphData(this.jsonArray);
          this.ngxLoader.stopLoader('individual_graph_ems');


        });
      });
    }
    if (type == "energyMeter") {
      this.ngxLoader.startLoader('individual_graph_ems');
  
      this.jsonArray = [];
      this.selectedEnergyMeter = param;
      let meterid = param;
      if (param == "All") {
        meterid = this.meteridforParameters;
      }

      this.transMngSer.getEnergyMeterReportData({ "meterid": param.split('(')[0], "duration": this.selectedTimeDuration, "deviceid": this.selectedDevice.split('(')[0], "range": this.customDateRange }).toPromise().then((response: any) => {
        this.allData = response.result;
        let jsonArray = [];
          for (let i = 0; i < response.result.length; i++) {
            const result = response.result[i];
            const date = result.DATE; // Assuming "DATE" is the key for the date property in each result object
            const selectedParameter = this.selectedParameter; // Replace this with the actual variable or value that holds the selected parameter
            const PF = result[this.selectedParameter]; // Use square brackets to access the selected parameter dynamically

            let jsonObject = {
              x: date,
              y: PF
            };
             jsonArray.push(jsonObject);
          }
          this.updateGraphData(jsonArray);
        this.getmonthdetail(param);
        this.ngxLoader.stopLoader('individual_graph_ems');
      });
    }
    if (type == "parameter") {
      this.ngxLoader.startLoader('individual_graph_ems');
  
      this.jsonArray = [];
      this.selectedParameter = param;
        for (let i = 0; i < this.allData.length; i++) {
          const result = this.allData[i];
          if(result[param]){
          let jsonObject = {
            x: result.DATE,
            y: result[param]
          };
          this.jsonArray.push(jsonObject);
        }
        }
        this.updateGraphData(this.jsonArray);
        this.ngxLoader.stopLoader('individual_graph_ems');
    }
    if (type == "date") {
      this.ngxLoader.startLoader('individual_graph_ems');
  
      console.log("from date selected parameter", this.selectedParameter)
      this.selectedTimeDuration = param;
      let duration;
      if (param == "Today") {
        duration = "Today";
      } else if (param == "Yesterday") {
        duration = "Yesterday";
      } else if (param == "This Week") {
        duration = "This Week"
      } else if (param == "This Month") {
        duration = "This Month";
      } else if (param == "Last Month") {
        duration = "Last Month"
      }   
      if (param == "Custom") {
        const dialogConfig = new MatDialogConfig();
        let dialogRef = this.matDialog.open(CustomDateComponent, {
          autoFocus: false,
          height: '350px', width: '450px', data: { "details": "", "action": "Add", selectedDate: this.customeSelectedDate }
        });
        dialogRef.afterClosed().subscribe(value => {
          this.customDateRange = value;
          this.transMngSer.getEnergyMeterReportData({ "meterid": this.selectedEnergyMeter.split('(')[0], "duration": param, "range": value, "deviceid": this.selectedDevice.split('(')[0] }).toPromise().then((response: any) => {

            if (response.result.length > 0) {
              this.allData = response.result;
              this.data = response;
              if (event == 'onLoad') {
                this.filterByParameters(this.selectedParameter)
              } else {
                this.changeGraphDataByParameter(this.selectedParameter)
              }
              let parameterList: any = ['DATE', 'energyMeterId'];
              this.dataSource = new MatTableDataSource(response.result);
              parameterList.push(this.selectedParameter)
              this.heading = parameterList;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

            } else {

            }
          });
        });
      } else {
        this.jsonArray = [];
        this.transMngSer.getEnergyMeterReportData({ "meterid": this.selectedEnergyMeter.split('(')[0], "duration": duration, "deviceid": this.selectedDevice.split('(')[0] }).toPromise().then((response: any) => {
          this.allData = response.result;
          console.log("qazxcvbnm,lsdfghjklppoiuytre", this.selectedParameter)
          for (let i = 0; i < response.result.length; i++) {
            const result = response.result[i];
            const date = result.DATE; // Assuming "DATE" is the key for the date property in each result object
            const selectedParameter = this.selectedParameter; // Replace this with the actual variable or value that holds the selected parameter
            const PF = result[this.selectedParameter]; // Use square brackets to access the selected parameter dynamically

            let jsonObject = {
              x: date,
              y: PF
            };
            this.jsonArray.push(jsonObject);
          }

          this.updateGraphData(this.jsonArray);
          this.ngxLoader.stopLoader('individual_graph_ems');
        });
      }
    }


  }

  filterByParameters(parameter) {
    console.log("siodjfjfsidisdjf", this.data);
    let param = parameter;
    let parameterValueArray = [];
    let dateArray = [];
    for (let i = 0; i < this.data.result.length; i++) {
      if (this.data.result[i].hasOwnProperty(param)) {
        parameterValueArray.push(this.data.result[i][param]);
        dateArray.push(this.data.result[i].DATE)
      }
    }
    console.log(parameterValueArray)

  }
  changeGraphDataByParameter(parameter) {
    console.log("Yes perameter called and perameter is ", parameter)
    let param = parameter;
    let parameterValueArray = [];
    let dateArray = [];
    for (let i = 0; i < this.data.result.length; i++) {
      if (this.data.result[i].hasOwnProperty(param)) {
        parameterValueArray.push(this.data.result[i][param]);
        dateArray.push(this.data.result[i].DATE)
      }

    }

    let parameterList: any = ['DATE', 'energyMeterId'];
    this.dataSource = new MatTableDataSource(this.data.result);
    parameterList.push(param)
    this.heading = parameterList;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  updateGraphDataFor_E(totalkwhcurrentmonth, KWHValuer, KWHValuel) {


    this.chart_e.updateSeries([{
      data: [totalkwhcurrentmonth, KWHValuer, KWHValuel]
    }]);

  }
  energyre_co_lo_graph() {

    var options = {
      tooltip: {
        theme: 'dark', // Use a dark theme for the tooltip
        style: {
          backgroundColor: '#333', // Change the tooltip background color
          color: '#fff' // Change the tooltip text color
        }
      },
      series: [{
        nmae:"KVAH",
        data: [this.totalkwhcurrentmonth, this.KWHValuer, this.KWHValuel]
      }],
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%',
      },
      grid: {
        show: false,

      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,

        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#7966E7"],
      xaxis: {
        title: {

          text: "KVAH",
          style: {
            color: "white",
            fontFamily: 'Lucida Grande,Lucida Sans Unicode,RooneySans-Regular,Trebuchet MS,sans-serif',
            fontSize: '5px'
          },
          position: 'top', // set position to 'bottom'
          offsetY: -125,
          offsetX: -50
        },
        categories: ['Consumed Energy', 'Received energy', 'Loss'],
        labels: {
          show: true,
          rotate: 0,
          style: {
            fontFamily: 'Lucida Grande,Lucida Sans Unicode,RooneySans-Regular,Trebuchet MS,sans-serif',
            fontSize: '10px',
            colors: 'white'
          }
        }
      },
      yaxis: {

        labels: {
          show: true,
          style: {
            colors: 'white'
          }
        }
      }
    };


    this.chart_e = new ApexCharts(this.energyconsumption_graph.nativeElement, options);
    this.chart_e.render();

  }

  efficiencygraph() {
    var options = {
      series: [67],
      chart: {
        height: 210,
        type: "radialBar",
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%"
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: false
            },
            value: {
              color: "white",
              offsetY: 15,
              fontSize: "22px"
            }
          },
          track: {
            background: "#e6e6e6",
            strokeWidth: "100%",
          },
          fill: 'red', // updated stock color
        }
      }
    };




    var chart = new ApexCharts(this.efficiency_graph.nativeElement, options);
    chart.render();
  }
  updateGraphData(jsonArray) {

    console.log("Yes i am updategraph data", jsonArray)
    this.chart_i.updateSeries([{
      data: jsonArray
    }]);


  }

  individual_graph_parameter() {
 
    var options = {
      series: [{
        name: "Value",
        data: this.jsonArray

      }],
      chart: {
        type: 'area',
        height: 300,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {

        text: 'Individual Analysis of Meter',
        align: 'left',
        style: {
          color: "white",
          fontFamily: 'Lucida Grande,Lucida Sans Unicode,RooneySans-Regular,Trebuchet MS,sans-serif',
          fontSize: '12px'
        },
      },
      subtitle: {
        text: 'Value Movements',
        align: 'left',
        style: {
          color: "white",
          fontFamily: 'Lucida Grande,Lucida Sans Unicode,RooneySans-Regular,Trebuchet MS,sans-serif',
          fontSize: '8px'
        },
      },
      xaxis: {
        type: 'DateTime',
        tickAmount: 2.2,
        tickPlacement: 'between',
        intervalType: 'Hours',
        labels: {
          format: 'dd/MM',
          show: true,
          style: {
            colors: 'white'
          },
          rotate: 0,
        },

      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: 'white'
          }
        }
      },
      legend: {
        horizontalAlign: 'left'
      }
    };



    this.chart_i = new ApexCharts(this.individual_graph.nativeElement, options);
    this.chart_i.render();

  }




}
