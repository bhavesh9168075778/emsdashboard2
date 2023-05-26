import { IfStmt } from '@angular/compiler';
import { Component, OnInit,ViewChild,ElementRef,Renderer2  } from '@angular/core';
// @ts-ignore
import ApexCharts from 'apexcharts';
import { uniqueId, values } from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StudioLed } from "studioled";
import { EmsdashboardService } from '../services/emsdashboard.service';
import { TransformerManagerService } from '../services/transformerManager.service';
import { DashboardService } from '../services/dashboard.service';
import { DeviceMasterService } from '../services/device-master.service';

interface MyData {
  startTime: string;
  type: string;
  threshold: string;
  actual: string;
}

@Component({
  selector: 'app-ems',
  templateUrl: './ems.component.html',
  styleUrls: ['./ems.component.scss']
})
export class EmsComponent implements OnInit {
  @ViewChild('energyconsumption_graph',{static: true}) energyconsumption_graph :ElementRef ;
  @ViewChild('consumption_graph_m',{static: true}) consumption_graph_m :ElementRef ;
  @ViewChild('consumption_graph_mb',{static: true}) consumption_graph_mb :ElementRef ;
  @ViewChild('chart1',{static: true}) loadchart :ElementRef ;
  @ViewChild('chart2',{static: true}) mdchart :ElementRef ;
  @ViewChild('chart3',{static: true}) pfchart :ElementRef ;
  @ViewChild('chart4',{static: true}) currentchart :ElementRef ;
  @ViewChild('bill',{static: true}) kwhbill :ElementRef ;
  @ViewChild('unit',{static: true}) kwhunit :ElementRef ;
  @ViewChild('fbill',{static: true}) fkwhbill :ElementRef ;
  @ViewChild('funit',{static: true}) fkwhunit :ElementRef ;
  @ViewChild('monthwiseConsumption',{static: true}) monthWiseConsumption :ElementRef ;
  @ViewChild('daywiseConsumption',{static: true}) daywiseConsumption :ElementRef ;
  @ViewChild('minutewiseConsumption',{static: true}) minutewiseConsumption :ElementRef ;
 
 
  myData: MyData[] = [
    { startTime: '10:00 AM', type: 'pf', threshold: 'grh', actual: 'hrh' },
    { startTime: '10:00 AM', type: 'pf', threshold: 'hgj', actual: 'rth' },
    { startTime: '10:00 AM', type: 'pf', threshold: 'dj', actual: 'rth' },
    { startTime: '10:00 AM', type: 'pf', threshold: 'hrh', actual: 'htrh' },
  ];

  heading_dummy_alert: string[] = ['startTime', 'type', 'threshold', 'actual'];

 
 
 
 
 
 
 
 
 
 
  cap= {
    radius: 5,
    border: {
        color: 'red',
        width: 3
        }
};
tooltip = {
  enable: true
};
public annotaions: object;
endValue = 10000000;
KWHValue:any;
KWHValuer:any=[500];

KWHValuel:any=[100];
pfValue;
labelStyles= {
  position: 'Inside',
  format: '{value}',
  offset : 4,
  color:'red',
  width:2
    };
    kwhData = 1953790.85;
    cost;
    color = "green";
    energyMeterId = [];
    selectedEnergyMeter;
    AllEnergyMeterData;
    recentGraphDiv;
    recentGraph;
    lengtho=0;
    recentpfGraphDiv;
    recentpfGraph;
    averagepf;
    pf;
    latestDate;
    uniqueDeviceId;
    Deviceid;
    monthDiv;
    energyconsumption;
    consumptiongraphm;
    consumptiongraphmb;
    dayDiv;
    minuteDiv;
    totalkwhcurrentmonth;
    selectedDevice;
    energyMeterIdArray
    meterCountValue ;
    digits: number[];
    digitsc: number[];
  ngAfterViewInit(){
    this.recentGraph = this.loadchart;
    let pfdiv = this.pfchart;
    let loadDiv = this.loadchart;
    this.recentpfGraphDiv = this.mdchart;
    let currDiv = this.currentchart;
    this.monthDiv = this.monthWiseConsumption;
    this.energyconsumption=this.energyconsumption_graph;
    this.consumptiongraphm=this.consumption_graph_m;
    this.consumptiongraphmb=this.consumption_graph_mb;
    this.dayDiv = this.daywiseConsumption;
    this.minuteDiv = this.minutewiseConsumption;
    setTimeout(this.pfGraph,100,pfdiv);
    setTimeout(this.currentGraph,100,currDiv);
}
  constructor(private ngxLoader: NgxUiLoaderService,private renderer: Renderer2,private EmsdashboardService:EmsdashboardService,private deviceManagerSer:DeviceMasterService,private transMngSer:TransformerManagerService ) { }

  ngOnInit() {
  this.ngxLoader.startLoader('emsDashboard');
  this.getDeiceIds();
  }
  getDeiceIds(){
    this.deviceManagerSer.getEMSDeviceId(JSON.parse(localStorage.getItem('userData')).userid).subscribe((response:any) => {
      if(response.result.length>0){
        
      let Deviceids = []
      response.result.forEach(function (value) {
        Deviceids.push(value.deviceId+"(" +value.sitename+")");
      });
      this.Deviceid = Deviceids[0]
      this.uniqueDeviceId = Deviceids;
      this.getselectedDeviceIddata(Deviceids[0]);
    }
    });
   }
   getselectedDeviceIddata(deviceid){
    this.selectedDevice = deviceid;
    
    deviceid = deviceid.split('(')[0];
    this.transMngSer.getEnergyMeters(deviceid).toPromise().then((response1: any) => {
      console.log("qwertyuiop",response1)
      if(response1.result.length>0){
        let energyMeterId = [];
        response1.result.forEach(function (value) {
          energyMeterId.push(value.meterSerialNumber +"(" +value.assetName   +")");
      });
      this.energyMeterIdArray = energyMeterId;
      this.selectedEnergyMeter = energyMeterId[0] ;
      this.getKwhDATA(deviceid);
    }
    });
   }
  
 loadGraph(data,date){
  var options = {
    chart: {
      height: '100%',
      width:'100%',
      type: "bar",
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    colors:[ '#1DD111'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      colors: ["black"]
    },
    series: [
      {
        name:"kwh",
        data: data
      }
    ],
   yaxis:{
     show:false
   },
   xaxis:{
    labels: {
      show: false,
    },
    type: 'category',
      categories:date
   },
   responsive: [{
    breakpoint: 100,
    options: {},
}]
  };  
  console.log("Divs DAta",this.recentGraph)
    this.recentGraphDiv = new ApexCharts(this.recentGraph.nativeElement, options);

      this.recentGraphDiv.render();
  this.ngxLoader.stopLoader('recentData');
 }
 getDigits(number: number): number[] {
  let digits = [];
  if(number == 0){
    digits = [0,0,0]
  }
  while (number > 0) {
    let digit = number % 10;
    digits.unshift(digit);
    number = Math.floor(number / 10);
  }

  return digits;
}
meterCount(deviceid:any){

  this.EmsdashboardService.getMeterCount(deviceid).subscribe((response1: any) => {
    if(response1.result.length > 0){
      console.log("getmetercount",response1)
    } 
  });
}
 getKwhDATA(deviceid){
 this.consumption_graph();
 this.consumption_graphb();
  let currentUserData = JSON.parse(localStorage.getItem('userData')); 
  this.EmsdashboardService.getKWH({userid:currentUserData.userid}).subscribe(async (response: any) => {
    this.EmsdashboardService.getMeterCount(deviceid).subscribe((response1: any) => {
      if(response1.result != 0){
      let meterCount =  response1.result;
      this.meterCountValue = meterCount;
    console.log("Meter Ayssghdbj",meterCount)

    if(response.code == 1 && response.result.length>0){
      console.log("thisop",response.result)
      let cost = response.result[0][0].cost
    if(response.result[0].length > 0){
      this.AllEnergyMeterData = response.result[0];
      let kwhValue = 0;
      let count = 0;
       this.lengtho = response.result[0].length;
       console.log("uuuuuuuuuuuuu",this.lengtho);
      this.averagepf = 0;
      for(let i = response.result[0].length-meterCount; i < response.result[0].length;i++){
        kwhValue = Number(kwhValue) + Number(response.result[0][i].kwh);
        this.averagepf = Number(this.averagepf) + Number(response.result[0][i].pf );
        if(Number(response.result[0][i].kwh) !=0){
          count++;
        }
        
        this.energyMeterId.push(response.result[0][i]);
      }
      this.KWHValuel = Number(this.KWHValuel).toFixed(2);
      this.KWHValuer = Number(this.KWHValuer).toFixed(2);
      this.pf = Number(this.averagepf/count).toFixed(2);
      let data = [];
      let time = [];
      
      console.log("energyashb",this.energyMeterId);
      this.energyMeterId = this.energyMeterId.map((a:any) => {
        a.energyMeterIds = a.energyMeterId;
        return a;
      }); 
      this.KWHValue = this.energyMeterId[0].kwh;
      this.digits = this.getDigits(Math.round(this.KWHValue));
      console.log("+++++++++++++++______________+++++++++++++_______",this.digits)
     this.pfValue = this.energyMeterId[0].pf;
      this.latestDate = this.energyMeterId[0].DATES;
      let lastValues = [];
      let lastpfValues = [];
      let lastDate = [];
      let dataforGraph = [];
      let DeviceIds = [];
      for(let i=0;i<response.result[0].length;i++){
        DeviceIds.push(response.result[0][i].Deviceid)
        if(response.result[0][i].energyMeterId == this.energyMeterId[0].energyMeterId){
          dataforGraph.push(response.result[0][i]);
        }
      }
      for(let j = dataforGraph.length-2 ;j>dataforGraph.length-8;j--){
        lastValues.push(dataforGraph[j].kwh);
        lastpfValues.push(dataforGraph[j].pf);
        lastDate.push(dataforGraph[j].DATES);
      }
       this.uniqueDeviceId = {"Deviceid":DeviceIds.filter(
        (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
      )};
        console.log(this.uniqueDeviceId);

    } else{
      this.KWHValue = 0;
      this.ngxLoader.stopLoader('emsDashboard');
    }
  
  if(response.result.length >=3 || response.result.length >= 6){
    
    let data = [];
    let prvYearData = ["0","0"];
    let date = [];
    let month = ['jan','Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let currentMonthTotalKwh;
    const d = new Date();
    let currentMonth = d.getMonth();
    response.result[2].forEach(function (value) {
      data.push(Number(value.kwh).toFixed(2));
      date.push(month[value.month-1]);
      if(currentMonth == value.month-1){
        currentMonthTotalKwh =  Math.round(Number(value.kwh));
      }
      console.log("DAte iudshuihuhduisd",date);
    });
    let cost = response.result[0][0].cost
    let costting =  Math.round(Number(currentMonthTotalKwh * cost));
    response.result[5].forEach(function (value) {
      prvYearData.push(Number(value.kwh).toFixed(2));
    });
    console.log("Month wise data",response.result[2])
    this.ngxLoader.stopLoader('emsDashboard');
    this.totalkwhcurrentmonth=currentMonthTotalKwh;
    this.totalkwhcurrentmonth=Number(this.totalkwhcurrentmonth).toFixed(2)
    this.monthWiseConsumptionGraph(prvYearData,data,date);
    this.billAmount(currentMonthTotalKwh,costting,cost);
    this.energyre_co_lo_graph(this.KWHValuer,this.totalkwhcurrentmonth,this.KWHValuel);
      

  }
  if(response.result.length >=4 || response.result.length >=7){
    let data = [];
    let prvMonthData = [];
    let date = [];
    response.result[3].forEach(function (value) {
          data.push(Number(value.kwh).toFixed(2));
          date.push(value.day);
    });
    response.result[6].forEach(function (value) {
      prvMonthData.push(Number(value.kwh).toFixed(2));
    });
    
    this.dayWiseConsumptionGraph(prvMonthData,data,date);
  }
  if(response.result.length >=5 || response.result.length >=8){
    let data = [];
    let YesterdaysData = [];
    let time = [];
    response.result[4].forEach(function (value) {
      data.push(Number(value.kwhdata).toFixed(2));
      time.push(value.hour);
    });
    response.result[7].forEach(function (value) {
      YesterdaysData.push(Number(value.kwhdata).toFixed(2));
    });
    console.log("Minute data +++++++++",data);
    this.minuteWiseConsumptionGraph(YesterdaysData,data,time);
  }
}
this.ngxLoader.stopLoader('emsDashboard');
} else {
  this.ngxLoader.stopLoader('emsDashboard');
}
  });
  });
}
energyMeterSelection(selectedEnergyMeter){
  let dataforGraph = [];
  let lastValues = [];
  let lastpfValues = [];
  let lastDate = [];
  selectedEnergyMeter = selectedEnergyMeter.split('(')[0];
  for(let i=0;i<this.AllEnergyMeterData.length;i++){
    if(this.AllEnergyMeterData[i].energyMeterId == selectedEnergyMeter ){
      dataforGraph.push(this.AllEnergyMeterData[i]);
    }
  }
  console.log(dataforGraph)
  this.KWHValue = dataforGraph[dataforGraph.length-1].kwh;
  this.pfValue =  dataforGraph[dataforGraph.length-1].pf;
  this.digits = this.getDigits(Math.round(this.KWHValue));
  for(let j =dataforGraph.length-2 ;j>dataforGraph.length-8;j--){
    lastValues.push(dataforGraph[j].kwh);
    lastpfValues.push(dataforGraph[j].pf);
    lastDate.push(dataforGraph[j].DATES)
  }
  this.ngxLoader.startLoader('recentData');

  this.recentGraphDiv.updateSeries([{
    data: lastValues
  }]);
  this.recentpfGraph.updateSeries([{
    data: lastpfValues
  }]);
    this.ngxLoader.stopLoader('recentData');

}
 mdGraph(mdDiv){
  var options = {
    chart: {
      height: '100%',
      width:'100%',
      type: "area",
      toolbar: {
        show: false
      },
      redrawOnParentResize: true
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "MD",
        data: [20, 42, 38, 45, 19, 36, 30]
      }
    ],
    colors:[ '#1DD111'],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      },
    },
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 3,
      opacity: 0.5
    },
    yaxis:{
      show:false
    },
    xaxis:{
      labels: {
        show: false,
      },
     },
  };
  
  var chart = new ApexCharts(mdDiv.nativeElement, options);
  
  chart.render();
  
 }
 pfGraph(data,date){
  this.ngxLoader.startLoader('recentData');
  var options = {
    chart: {
      height: '100%',
      width:'100%',
      type: "area",
      toolbar: {
        show: false
      },
      redrawOnParentResize: true
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: "PF",
        data:data
      }
    ],
    colors:[ '#1DD111'],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      },
    },
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 3,
      opacity: 0.5
    },
    yaxis:{
      show:false
    },
    xaxis:{
      labels: {
        show: false,
      },
      categories:date
     },
  };
  
  
  this.recentpfGraph = new ApexCharts(this.recentpfGraphDiv.nativeElement, options);
  this.recentpfGraph.render();
  this.ngxLoader.stopLoader('recentData');

 }
 currentGraph(currDiv){
  var options = {
    series: [{
    name: 'IR',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'IY',
    data: [11, 32, 45, 32, 34, 52, 41]
  },
  {
    name: 'IB',
    data: [45, 2, 54, 32, 65, 12, 34]
  }],
    chart: {
      height: '100%',
      width:'100%',
      type: "area",
      toolbar: {
        show: false
      }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  colors:['rgb(171, 59, 55)', 'rgb(216, 220, 86)','rgb(104, 208, 106)'],
  legend: {
    show: false,
  },
  yaxis:{
    show:false
  },
  xaxis: {
    type: 'datetime',
    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],

      labels: {
        show: false,
      },
 
  },

  };
  var chart = new ApexCharts(currDiv.nativeElement, options);
  chart.render();

 }
 consumption_graphb()
 {
     var options = {
      series: [
        {
          type: "rangeArea",
          name: "Testing area BR",
          data: [
            { x: "Jan", y: [1100, 1900] },
            { x: "Feb", y: [1200, 1800] },
            { x: "Mar", y: [900, 2900] }
          ]
        },
        {
          type: "rangeArea",
          name: "Fiteration AR",
          data: [
            { x: "Jan", y: [3100, 3400] },
            { x: "Feb", y: [4200, 5200] },
            { x: "Mar", y: [3900, 4900] }
          ]
        },
        {
          type: "rangeArea",
          name: "Autoclave CR",
          data: [
            { x: "Jan", y: [1500, 1900] },
            { x: "Feb", y: [1800, 2300] },
            { x: "Mar", y: [2000, 2800] }
          ]
        },
        {
          type: "rangeArea",
          name: "Comporessor DR",
          data: [
            { x: "Jan", y: [800, 2800] },
            { x: "Feb", y: [2800, 1900] },
            { x: "Mar", y: [1900, 800] }
          ]
        },
        {
          type: "rangeArea",
          name: "Winding Machine ER",
          data: [
            { x: "Jan", y: [1000, 1500] },
            { x: "Feb", y: [1200, 1800] },
            { x: "Mar", y: [1500, 2200] }
          ]
        },
        {
          type: "rangeArea",
          name: "Crane 15/5",
          data: [
            { x: "Jan", y: [1000, 1500] },
            { x: "Feb", y: [1200, 1800] },
            { x: "Mar", y: [1500, 2200] }
          ]
        },
        {
          type: "rangeArea",
          name: "Crane 10/5",
          data: [
            { x: "Jan", y: [1000, 1500] },
            { x: "Feb", y: [1200, 1800] },
            { x: "Mar", y: [1500, 2200] }
          ]
        },
        
         
              
      ]
      ,
      chart: {
        height: 230,
        width: 470,
        type: "rangeArea",
        color:"white",
        animations: {
          speed: 500
        }
      },
      
      dataLabels: {
        enabled: false,
        color:"white",
      dropShadow: {
        blur: 3,
        opacity: 0.8
      },
      },
      fill: {
        opacity: [0.24, 0.24, 1, 1]
      },
      forecastDataPoints: {
        count: 2,
        dashArray: 4
      },
      stroke: {
        curve: "straight",
        width: [0, 0, 2, 2]
      },
      legend: {
        show: true,
       inverseOrder: true,
       labels: {
        useSeriesColors: true
   },
        markers: {
          hover: {
            sizeOffset: 5
          }
        },
       
          
        
      },
      labels: ["Crane 10/5","Crane 15/5","Winding Machine", "Comporessor","Autoclave","Fiteration","Testing area"],
      colors: ['#D4FF9C','#85DC9B', '#41B59B', '#028D92', '#00647C','#5D83A4','#9BA5C5'],

      title: {
        text: "Consumption by individual asset",
        style: {
          fontFamily: 'Lucida Grande,Lucida Sans Unicode,RooneySans-Regular,Trebuchet MS,sans-serif',
          fontSize: '15px',
          color: 'white'
        }
      },
      yaxis: {
      
        labels: {
          show: true,
          style: {
            colors: 'white'
          }
        }
      },
      xaxis: {
      
        labels: {
          show: true,
          style: {
            colors: 'white'
          }
        }
      },
     
      markers: {
        hover: {
          sizeOffset: 5
        }
      }

     };
     var chart = new ApexCharts(this.consumption_graph_mb.nativeElement, options);
  chart.render();
 }


consumption_graph()
{
  var options = {
    tooltip: {
      theme: 'dark',
      style: {
        backgroundColor: '#333',
        color: '#fff'
      }
    },
    series: [24, 15, 21, 37, 15,10,9],
    chart: {
      height:230,
      width: 380,
      type: "donut",
      dropShadow: {
        enabled: true,
        color: "#111",
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2
      }
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            useSeriesColors: true, 
            show: true,
            color:"white",
            total: {
              showAlways: true,
              show: true,
              color:"white",              
            }
          }
        }
      }
    },
    legend: {
     labels: {
         useSeriesColors: true
    },
  },
    labels: ["Testing area", "Fiteration", "Autoclave", "Comporessor", "Winding Machine","Crane 15/5","Crane 10/5"],
    colors: ['#D4FF9C','#85DC9B', '#41B59B', '#028D92', '#00647C','#5D83A4','#9BA5C5'],
    dataLabels: {
      enable:true,
      color:"white",
      dropShadow: {
        blur: 3,
        opacity: 0.8
      },
      
    },
    states: {
      hover: {
        filter: {
          type: "none"
        }
      }
    },
    theme: {
      palette: "palette2"
    },
    title: {
      text: "Consumption by individual asset",
      style: {
        fontFamily: 'Lucida Grande,Lucida Sans Unicode,RooneySans-Regular,Trebuchet MS,sans-serif',
        fontSize: '15px',
        color: 'white'
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
  
  var chart = new ApexCharts(this.consumption_graph_m.nativeElement, options);
  chart.render();
}


 energyre_co_lo_graph(KWHValuer,totalkwhcurrentmonth,KWHValuel)
 {
  console.log("qqqqqqqqqqqqqqqqqqw",totalkwhcurrentmonth)
  var options = {
    tooltip: {
      theme: 'dark', // Use a dark theme for the tooltip
      style: {
        backgroundColor: '#333', // Change the tooltip background color
        color: '#fff' // Change the tooltip text color
      }
    },
    series: [{
      data: [totalkwhcurrentmonth, KWHValuer,KWHValuel]
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
    offsetY: -125 ,
    offsetX: -50
      },
      categories: ['Consumed Energy','Received energy','Loss'],
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
  

  var chart = new ApexCharts(this.energyconsumption_graph.nativeElement, options);
  chart.render();

 }
 monthWiseConsumptionGraph(prvYearData,data,date){

 console.log("monthwise njkll2",data)
 
  var options = {
      tooltip: {
        theme: 'dark', // Use a dark theme for the tooltip
        style: {
          backgroundColor: '#333', // Change the tooltip background color
          color: '#fff' // Change the tooltip text color
        }
      },
    chart: {
      
      height: '100%',
      width: '100%',
      type: "bar",
      toolbar: {
        show: true
      }
    },
    grid: {
      show: false,
     
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    legend: {
      position: 'top',
      labels: {
        
        useSeriesColors: true
    },
    },
    title: {
      text: "Monthly Profile",
      style: {
        color: "white"
      }
    },
    dataLabels: {
      enabled: false,
     
    },
    stroke: {
      width: 1,
      colors: ["black"]
    },
    series: [
      {
        name:"Last Year",
        data: prvYearData,
      },{
        name:"Current Year",
        data: data,       
      }
    ],
    colors:['#C7C7C7', '#538811'],
   yaxis:{
     show:true,
     title: {
      text: "KWH",
      rotate: -90,
      offsetX: 0,
      offsetY: 0,
      
      style: {
        color: "white"
      }
    
  },
  labels: {

    style: {
      colors: 'white',
    }
  },
   },
 
   xaxis: {
    show:true,
    categories:  date,
    tickPlacement: 'between',
    labels: {
      show: true,
      rotate: 0,
      style: {
        colors: 'white',
      }
    },
  },
  responsive: [{
    breakpoint: 768,
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '100%',
          endingShape: 'rounded'
        }
      },
      legend: {
        position: 'bottom',
      }
    }
  }]
  };  
 
  var chart = new ApexCharts(this.monthDiv.nativeElement, options);
  chart.render();

 }
 dayWiseConsumptionGraph(prvMonthData,data,day){
  const today = new Date()
  var date = new Date(today.getFullYear(), today.getMonth(), 1);
  var days = [];
  while (date.getMonth() === today.getMonth()) {
    days.push(new Date(date).getUTCDate());
    date.setDate(date.getDate() + 1);
  }
  console.log("DAysssssss", days);
  var options = {
      tooltip: {
        theme: 'dark', // Use a dark theme for the tooltip
        style: {
          backgroundColor: '#333', // Change the tooltip background color
          color: '#fff' // Change the tooltip text color
        }
      },
    series: [{
    name: 'Last Month',
    data: prvMonthData
  }, {
    name: 'Current Month',
    data: data
  }],
    chart: {
      height: '100%',
      width:'100%',
    type: 'area',
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        customIcons: []
      },
      plotOptions: {
        bar: {
          rangeBarOverlap: false,
        }
      },
      export: {
        csv: {
          filename: "Consumption",
          columnDelimiter: ',',
          headerCategory: 'category',
          headerValue: 'value',
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString()
          }
        },
        svg: {
          filename: "Consumption",
        },
        png: {
          filename: "Consumption",
        }
      },
      autoSelected: 'zoom' 
    },
  },
  grid: {
    show: false,
   
  },
  colors:['#C7C7C7', '#538811'],
  legend: {
    position: 'top',
    labels: {
        
      useSeriesColors: true
  },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  yaxis:{
    title: {
      text: "KWH",
      rotate: -90,
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "white"
      }
  },
  labels: {

    style: {
      colors: 'white',
    }
  },
  },
  xaxis: {
    type: 'number',
    categories:day,
    tickAmount: 15,
    tickPlacement: 'between',
    labels: {
      show: true,
      rotate: 0,
      style: {
        colors: 'white',
      }
    },
  },
  title: {
    text: "Daily Profile",
     style: {
        color: "white"
      }
  },
  };
  var chart = new ApexCharts(this.dayDiv.nativeElement, options);
  chart.render();
 }
 minuteWiseConsumptionGraph(YesterdaysData,data,time){
  const today = new Date()
  var date = new Date(today.getFullYear(), today.getMonth(), 1);
  var days = [];
  while (date.getMonth() === today.getMonth()) {
    days.push(new Date(date).getUTCDate());
    date.setDate(date.getDate() + 1);
  }
  console.log("DAysssssss", days);
  var options = {
    colors:['#C7C7C7', '#538811'],
    tooltip: {
        theme: 'dark', // Use a dark theme for the tooltip
        style: {
          backgroundColor: '#333', // Change the tooltip background color
          color: '#fff' // Change the tooltip text color
        }
      },
    series: [{
    name: "Yesterday",
    data: YesterdaysData,
    },
 {
    name: "Today",
    data: data,
    
  }],  
    chart: {
      height: '100%',
      width:'100%',
    type: 'area',
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
       
      },
      export: {
      
        csv: {
          filename: "Consumption",
          columnDelimiter: ',',
          headerCategory: 'category',
          headerValue: 'value',
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString()
          }
        },
        svg: {
          filename: "Consumption",
        },
        png: {
          filename: "Consumption",
        }
      },
      autoSelected: 'zoom' 
    },
  },
  grid: {
    show: false,
   
  },
  legend: {
    position: 'top',
    labels: {
        
      useSeriesColors: true
  },
    
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  yaxis:{
    title: {
      text: "KWH",
      rotate: -90,
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "white"
      }
  },
  labels: {

    style: {
      colors: 'white',
    }
  },
  },
  xaxis: {
    type: 'number',
    categories:time,
    tickAmount: 5,
    tickPlacement: 'between',
    labels: {
      show: true,
      rotate: 0,
      style: {
        colors: 'white',
      }
    },
  },
  title: {
    text: "Hourly Profile",
     style: {
        color: "white"
      }
  },
  };
  var chart = new ApexCharts(this.minuteDiv.nativeElement, options);
  chart.render();
 }
 billAmount(unit,cost,costperUnit){
   this.cost = Number(unit*costperUnit).toFixed(0);
   this.cost = Number(this.cost).toFixed(2)
 }

}
