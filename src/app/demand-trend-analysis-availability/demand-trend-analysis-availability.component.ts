import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";
import { DashboardService } from '../services/dashboard.service';
import { GlobalService } from '../services/global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-demand-trend-analysis-availability',
  templateUrl: './demand-trend-analysis-availability.component.html',
  styleUrls: ['./demand-trend-analysis-availability.component.css']
})
export class DemandTrendAnalysisAvailabilityComponent implements OnInit {

  graph = {
    layout: {
      barmode: 'group',
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
          text: 'Percentage',
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
        this.getAvailabilityStatus(this.selectedTransformer, duration);
      } else {
        this.ngxLoader.stopLoader('availabilitystatus');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('availabilitystatus');
    });
  }

  durationSelection(selectedDuration) {
    const duration = this.durationSelectionAlert(selectedDuration);
    this.getAvailabilityStatus(this.selectedTransformer, duration);
  }

  transformerSelection() {
    const duration = this.durationSelectionAlert(this.selectedDuration);
    this.getAvailabilityStatus(this.selectedTransformer, duration);
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
    return date;
  }

  changeDateRange(event) {
    console.log("event----------", event)
    if (this.showDateRange) {
      let date = {
        startdate: moment(event.value[0]).format('YYYY-MM-DD'),
        enddate: moment(event.value[1]).format('YYYY-MM-DD')
      };
      this.getAvailabilityStatus(this.selectedTransformer, date);
    }
  }

  getAvailabilityStatus(selectedTransformer, selectedDuration) {
    this.data = [];
    this.ngxLoader.startLoader('availabilitystatusgraph');
    let payload = { transformerid: '', startdate: '', enddate: '' };
    payload.transformerid = `'${selectedTransformer.transformerid}'`;
    payload.startdate = selectedDuration.startdate;
    payload.enddate = selectedDuration.enddate;
    this._dashboardService.loadIndividualDashboard(payload).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        this.ngxLoader.stopLoader('availabilitystatusgraph');
        console.log("Availabilty Status===response========", response)
        console.log("Availabilty Status===DATA========", _(response.result)
          .groupBy('transformerdate').value())
        let fetchFrequency = response.fetchFrequency[0].value;

        let finalresult = _(response.result).uniqBy('Recordid')
          .groupBy('transformerdate')
          .flatMap((data, transformerdate) => ({
            value: this.calculatePercentage(moment(transformerdate).format('YYYY-MM-DD'), data, fetchFrequency),
            transformerdate: moment(transformerdate).format('YYYY-MM-DD')

          })).value();

        this.populateGraph(finalresult);
        console.log("Availabilty Status===finalresult========", finalresult)
      } else {
        this.ngxLoader.stopLoader('availabilitystatusgraph');
      }
    }, (error) => {
      this.ngxLoader.stopLoader('availabilitystatusgraph');
    });
  }

  populateGraph(result) {
    this.data = [{
      x: _.map(result, 'transformerdate'),
      y: _.map(result, 'value'),
      type: "bar"
    }];
  }

  calculatePercentage(transformerdate, totalOnlines, fetchFrequency) {
    console.log('Calculate Percentage Data',  totalOnlines);

    let totalOnlineOffline;
    let totalOnline = totalOnlines.length;
    
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
