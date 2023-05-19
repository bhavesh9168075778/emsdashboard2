import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";
import { DashboardService } from '../.../../../services/dashboard.service';
import { GlobalService } from '../.../../../services/global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { count } from 'console';

@Component({
  selector: 'app-onlineofflineanalysis',
  templateUrl: './onlineofflineanalysis.component.html',
  styleUrls: ['./onlineofflineanalysis.component.scss']
})
export class OnlineofflineanalysisComponent implements OnInit {

OnlineCount : any;
OfflineCount : any;
minOfOnline : Number;
maxOfOnline : Number;
minOfOffline : Number;
maxOfOffline : Number;
offlineTime : Number;
onlineTime : Number;
  graph = {
    layout: {
      autosize: true,
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
          text: 'Minutes',
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
  data = [];
  showDateRange = false;
  currentUserData = JSON.stringify(localStorage.getItem('userData'));
  selectedTransformer = null;
  transformerList = [];

  durationList = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
    { id: 5, name: 'Last Month' },
    { id: 6, name: 'Custom' }
  ];
  selectedDuration = this.durationList[3];

  constructor(private globalService: GlobalService, private _dashboardService: DashboardService, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
    this.filteredTransformers();
  }

  filtertransformerPayload() {
    let payloadtogetTransformer = {
      "countryid": null,
      "stateid": null,
      "cityid": null,
      "zoneid": null,
      "locationid": null,
      "transformerid": this.selectedTransformer ? this.selectedTransformer.transformerid : null,
    }
    return payloadtogetTransformer;
  }

  filteredTransformers() {
    this.ngxLoader.startLoader('availabilitystatus');
    let payloadtogetTransformer = this.filtertransformerPayload();
    this.globalService.getfilteredTransformers(JSON.stringify(payloadtogetTransformer), localStorage.getItem('userData')).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        this.ngxLoader.stopLoader('availabilitystatus');
        console.log("filtered response=============>", response)
        this.transformerList = response.result;
        this.transformerList.map(e => {
          e.label = `${e.transformerid}[ ${e.sitename} ]`;
      });
        this.selectedTransformer = response.result[0];
        const duration = this.durationSelectionAlert(this.selectedDuration);
        this.getShutDownData(this.selectedTransformer, duration);
      } else {
        this.ngxLoader.stopLoader('availabilitystatus');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('availabilitystatus');
    });
  }

  durationSelection(selectedDuration) {
    const duration = this.durationSelectionAlert(selectedDuration);
    this.getShutDownData(this.selectedTransformer, duration);
  }

  transformerSelection() {
    const duration = this.durationSelectionAlert(this.selectedDuration);
    this.getShutDownData(this.selectedTransformer, duration);
  }

  durationSelectionAlert(selectedDuration) {
    console.log('selectedDuration====', selectedDuration)
    let date = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      filter: "graph"
    };
    if (selectedDuration.id == 2) {
      date.startDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      date.endDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 3) {
      date.startDate = moment().startOf('week').format('YYYY-MM-DD');
      date.endDate = moment().endOf('week').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 4) {
      date.startDate = moment().startOf('month').format('YYYY-MM-DD');
      date.endDate = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 5) {
      date.startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
      date.endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    }
    if (selectedDuration.id == 6) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
    return date;
  }

  changeDateRange(event) {
    console.log("event----------", event)
    if (this.showDateRange) {
      let date = {
        startdate: moment(event.value[0]).format('YYYY-MM-DD'),
        enddate: moment(event.value[1]).format('YYYY-MM-DD')
      };
      this.getShutDownData(this.selectedTransformer, date);
    }
  }

  getShutDownData(selectedTransformer, selectedDuration) {
    selectedDuration.transformerId =selectedTransformer.transformerid;
    console.log("Downtime for transformer",selectedDuration);
    var onlineArray =  [];
    var onlineDate = [];
    var offlineArray = [];
    var offlineDate = [];
    var graphData = [];
    var onlinetotal = 0;
    var onlinecount = 0;
    var offlinetotal = 0;
    var offlinecount = 0;
    this._dashboardService.transformerDowntime(selectedDuration).subscribe((response: any) => {
        console.log('response of transformer DownTime', response.data );
        this.data=response.data;
        for(let i=0;i<=response.data.length-1;i++){
        if(response.data[i].status == 'online'){
           onlineArray.push(response.data[i].TotalONOFFTimeInMinutes);
           onlinetotal += response.data[i].TotalONOFFTimeInMinutes;
           onlinecount++;
           onlineDate.push(response.data[i].timestamp)
           graphData.push({"value": response.data[i].TotalONOFFTimeInMinutes,"date":response.data[i].DATE,"text":"online"})
        } else {
          offlineArray.push(response.data[i].TotalONOFFTimeInMinutes);
          offlinetotal += response.data[i].TotalONOFFTimeInMinutes;
          offlinecount++;
          offlineDate.push(response.data[i].timestamp)
          graphData.push({"value": response.data[i].TotalONOFFTimeInMinutes,"date":response.data[i].DATE,"text":"offline"})
        }
      }
      this.populateGraph(graphData);
      this.minOfOnline = Math.min.apply(null, onlineArray);
      this.maxOfOnline = Math.max.apply(null, onlineArray);
      this.minOfOffline = Math.min.apply(null, offlineArray);
      this.maxOfOffline = Math.max.apply(null, offlineArray);
      this.onlineTime = Number(onlinetotal);
      this.offlineTime = Number(offlinetotal);
      this.OnlineCount = onlineArray.length;
      this.OfflineCount = offlineArray.length;
    });
  }

  populateGraph(result) {
    var color = [];
    for(let i=0;i<=result.length-1;i++){
      if(result[i].text == 'offline'){
        color.push('rgb(222,0,0)');
      } else if(result[i].text == 'online'){
        color.push('rgb(0,255,0)');
      }
    }
   console.log(color);
    var trace1 = {
      x: _.map(result, 'date'),
      y: _.map(result, 'value'),
      text:_.map(result, 'text'),
      marker:{
        color: color
      },
      type: "bar"
    };
    
    this.data = [trace1];
    
  }

  calculatePercentage(transformerdate, totalOnline, fetchFrequency) {
    console.log('transformerdate++', transformerdate, totalOnline);
    let totalOnlineOffline;
    if (moment(transformerdate).isSame(moment(), 'day')) {
      let ms = moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(moment(moment().startOf('day'), "DD/MM/YYYY HH:mm:ss"));
      let d = moment.duration(ms);
      totalOnlineOffline = ((d.days() * 24 * 60) + (d.hours() * 60) + (d.minutes())) / fetchFrequency;
      console.log("IF==========", d.days(), d.hours(), d.minutes(), totalOnlineOffline, totalOnline)
    } else {
      totalOnlineOffline = (24 * 60) / fetchFrequency;
      console.log("ELSE==========", totalOnlineOffline)
    }
    return ((totalOnline / totalOnlineOffline) * 100).toFixed(2);
  }

}
