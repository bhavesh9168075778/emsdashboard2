import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import * as _ from "lodash";
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import * as moment from 'moment';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit, AfterViewChecked {
  mandatoryParameter = [];
  tempmandatoryParameter = [];
  tempnonmandatoryParameter = [];
  nonmandatoryParameter = [];
  data = [{ name: 'qwe', min: 8, max: 96, hg: 89, fgf: 5 }]
  tableData = [];
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  now: number;
  ismobileView: boolean = false;
  emsDashboard = [
    {
      id: 1,
      name: 'Dashboard',
      haschildMenu: false,
      showSubmenu: false,
      link: '/ems',
      icon: 'fa fa-pie-chart',
      childmenu: [
      ]
    },
    {
      id: 2,
      name: 'Individual Dashboard',
      haschildMenu: false,
      showSubmenu: false,
      link: '/emsindividualdashboard',
      icon: 'fa fa-area-chart',
      childmenu: [
      ]
    },
    {
      id: 3,
      name: 'Tree',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/emstree',
      icon: 'fa fa-sitemap'
    },
    {
      id: 4,
      name: 'Report',
      haschildMenu: false,
      showSubmenu: false,
      link: '/emsreport',
      icon: 'fa fa-table',
      childmenu: [
      ]
    },
   
    {
      id: 5,
      name: 'Energy Meter Manager',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/energymetermanager',
      icon: 'fa fa-tachometer'
    },
    {
      id: 6,
      name: 'Site Manager',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/site',
      icon: 'fa fa-th-large',
    },
    {
      id: 7,
      name: 'Device Master',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/deviceMaster',
      icon: 'fa fa-list'
    },
     
    {
      id: 8,
      name: 'User Maintenance',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/user',
      icon: 'fa fa-user-o'
    },
    
  ]
  dashboardArray = [
    {
      id: 1,
      name: 'Dashboard',
      haschildMenu: true,
      showSubmenu: false,
      link: '/dashboard',
      icon: 'fa fa-pie-chart',
      childmenu: [
        {
          id: 1,
          name: 'All Transformer Status',
          link: '/dashboard'
        },
        {
          id: 2,
          name: 'Individual Status',
          link: '/individual-status'
        }
      ]
    },
    {
      id: 2,
      name: 'Transformer',
      haschildMenu: true,
      showSubmenu: false,
      icon: 'fa fa-list',
      childmenu: [
        {
          id: 1,
          name: 'Transformer Manager',
          link: '/transformerManager'
        },

      ]
    },
    {
      id: 5,
      name: 'Analytics',
      haschildMenu: true,
      showSubmenu: false,
      icon: 'fa fa-line-chart',
      childmenu: [
        {
          id: 1,
          name: 'Demand Trends',
          link: '/demand-trend'
        },
        {
          id: 2,
          name: 'Availability Status',
          link: '/downtime-analysis'
        },
      ]
    },
    {
      id: 7,
      name: 'Report',
      haschildMenu: true,
      showSubmenu: false,
      icon: 'fa fa-bar-chart',
      childmenu: [
        {
          id: 1,
          name: 'Gateway Data Report',
          link: '/report'
        },
        {
          id: 2,
          name: 'Alert Report',
          link: '/alertReport'
        },
      ]
    },
    {
      id: 3,
      name: 'User Maintenance',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/user',
      icon: 'fa fa-user-o'
    },
    {
      id: 4,
      name: 'Site Manager',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/site',
      icon: 'fa fa-th-large',
    },
    {
      id: 6,
      name: 'Device Master',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/deviceMaster',
      icon: 'fa fa-list'
    },
    /* {
      id: 8,
      name: 'Alert Report',
      haschildMenu: false,
      showSubmenu: false,
      childmenu: [],
      link: '/alertReport',
      icon: 'fa fa-bar-chart'
    }, */
  ];
  displayname: any;
  currentUserData = JSON.parse(localStorage.getItem('userData'));
  notificationParameter: any[];
  tableHeader: any[];
  tableBody: any;
  notificationCount: number = 0;

  constructor(private router: Router, private globalService: GlobalService, private cdRef: ChangeDetectorRef) {
    setInterval(() => {
      this.now = Date.now();
    }, 1);

    if (this.currentUserData.roleid == 2 && this.currentUserData.dashboard != 2) {
      this.dashboardArray = _.remove(this.dashboardArray, (o: any) => {
        return o.id !== 6;
      });
    } else if (this.currentUserData.roleid == 3 && this.currentUserData.dashboard != 2) {
      this.dashboardArray = _.remove(this.dashboardArray, (o: any) => {
        return o.id == 1 || o.id == 5 || o.id == 7;
      });
    } else if(this.currentUserData.dashboard === 2){
      this.dashboardArray = this.emsDashboard;
      if (this.currentUserData.roleid == 2){
        this.dashboardArray = _.remove(this.dashboardArray, (o: any) => {
          return o.id == 1 || o.id == 2 || o.id == 3 || o.id == 4||  o.id == 5 || o.id == 6 || o.id == 8;
        });
      } else if(this.currentUserData.roleid == 3){
        this.dashboardArray = _.remove(this.dashboardArray, (o: any) => {
          return o.id == 1 || o.id == 2 || o.id == 3 || o.id == 4 ;
        });
      }else if(this.currentUserData.roleid == 1){
        this.dashboardArray = _.remove(this.dashboardArray, (o: any) => {
          return o.id == 5 || o.id == 6 || o.id == 7 || o.id == 8 ;
        });
      }
      
    }
  }

  ngAfterViewChecked() {
    let islargeScreen = this.isLargeScreen();
    if (islargeScreen) { // check if it change, tell CD update view
      this.ismobileView = false;
    } else {
      this.ismobileView = true;
    }
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    
    let payloadtogetTransformer = {
      "countryid": null,
      "stateid": null,
      "cityid": null,
      "zoneid": null,
      "locationid": null,
      "transformerid": null,
    };
   this.access();
    this.globalService.golbalMaster('notification').subscribe((response: any) => {
      if (response && response.code === '1') {
        console.log("response====Notification===", response)
        this.notificationParameter = _.filter(response.result, (o: any) => {
          return o.userid == this.currentUserData.userid;
        });
        if (this.notificationParameter.length > 0) {
          let result = JSON.parse(this.notificationParameter[0].value)
          this.tempmandatoryParameter = _.filter(result.data, (o: any) => {
            return o.mandatory == true;
          });
          this.tempnonmandatoryParameter = _.filter(result.data, (o: any) => {
            return o.id == 4 || o.id == 5 || o.id == 6 || o.id == 7 || o.id == 8 || o.id == 9 || o.id == 10;
          });
          console.log("response====Notification= this.listData==", this.tempmandatoryParameter)
          console.log("ioshdchsdchcisdohcoishdhhci",this.dashboardArray);

        }
        this.getfilteredTransformers(JSON.stringify(payloadtogetTransformer), JSON.stringify(localStorage.getItem('userData')));
      }
    });
  }
  
access(){
  var userdata = JSON.parse(localStorage.getItem('userData'));
  this.globalService.getLoginUserData(userdata.userid).subscribe((response: any) => {
    if (response  && response.result.length > 0) {
      if((response.result[0].updownreportaccess == 1 && userdata.roleid == 2 ) || userdata.roleid == 1 && userdata.dashboard!=2){
        this.dashboardArray[3].childmenu.push({
          id:3,
          name: 'Up/Down Time Report',
          link: '/upDownReport'
        })
        this.dashboardArray[2].childmenu.push({
          id: 3,
          name: 'Up/Down Time Status',
          link: '/updowntime-analysis'
        });
      }
      if((response.result[0].hvlvreportaccess == 1 && userdata.roleid == 2) || userdata.roleid == 1 && userdata.dashboard!=2){      
        this.dashboardArray[3].childmenu.push({
          id:4,
          name: 'HVLV Difference Report',
          link: '/hvlvdiff'
        })
      }
     if(response.result[0].updownreportaccess == 1 && userdata.roleid == 3 && userdata.dashboard!=2){
      this.dashboardArray[2].childmenu.push({
        id:3,
        name: 'Up/Down Time Report',
        link: '/upDownReport'
      })
      this.dashboardArray[1].childmenu.push({
        id: 3,
        name: 'Up/Down Time Status',
        link: '/updowntime-analysis'
      });
    }
    if(response.result[0].hvlvreportaccess == 1 && userdata.roleid == 3 && userdata.dashboard!=2){      
      this.dashboardArray[2].childmenu.push({
        id:4,
        name: 'HVLV Difference Report',
        link: '/hvlvdiff'
      })
     }
    }
      
  });
}
  getfilteredTransformers(payloadtogetTransformer, userData) {
    let temptransformerList = [];
    this.globalService.getfilteredTransformers(payloadtogetTransformer, localStorage.getItem('userData')).subscribe((response: any) => {
      if (response && response.code === '1' && response.result.length > 0) {
        console.log('response=====getfilteredTransformers=========', response);
        for (let i = 0; i < response.result.length; i++) {
          temptransformerList.push(response.result[i].transformerid);
        }
        this.getnotificationData(temptransformerList);
      }
    });
  }

  getnotificationData(temptransformerList) {
    this.mandatoryParameter = [];
    this.nonmandatoryParameter = [];
    this.globalService.getnotification({ transformerList: temptransformerList }).subscribe((response: any) => {
      if (response && response.code === '1') {
        console.log('response=====getnotificationData=========', response);

        this.mandatoryParameter = _.flatMap(this.tempmandatoryParameter, (o: any) => {
          if (o.name === 'Online') { o.value = response.notificationCount.online };
          if (o.name === 'Offline') { o.value = response.notificationCount.offline };
          if (o.name === 'Normal') { o.value = response.notificationCount.normal };
          if (o.name === 'Unbalance') { o.value = response.notificationCount.unbalance };
          if (o.name === 'Overload') { o.value = response.notificationCount.overload };
          if (o.name === 'Underload') { o.value = response.notificationCount.underload };
          if (o.name === 'Oil Temp') { o.value = response.notificationCount.oiltemperature };
          if (o.name === 'LowPf') { o.value = response.notificationCount.lowPowerfactor };
          if (o.name === 'WindTemp') { o.value = response.notificationCount.windingTemperature };
          if (o.name === 'Oil Level') { o.value = response.notificationCount.oillevel };
          return o;
        });

        let tempshownotificationCount = _.filter(this.mandatoryParameter, (o: any) => {
          return o.color === 'red';
        });
        this.notificationCount = _.sumBy(tempshownotificationCount, (o: any) => o.value);
        const normalCount=_.find(this.mandatoryParameter,{name:"Normal"});
        localStorage.setItem("normalCount",normalCount.value);
        console.log('response=====this.mandatoryParameter=========', this.mandatoryParameter);

        this.nonmandatoryParameter = _.flatMap(this.tempnonmandatoryParameter, (o: any) => {
          if (o.name === 'Online') { o.value = response.notificationCount.online };
          if (o.name === 'Offline') { o.value = response.notificationCount.offline };
          if (o.name === 'Normal') { o.value = response.notificationCount.normal };
          if (o.name === 'Unbalance') { o.value = response.notificationCount.unbalance };
          if (o.name === 'Overload') { o.value = response.notificationCount.overload };
          if (o.name === 'Underload') { o.value = response.notificationCount.underload };
          if (o.name === 'Oil Temp') { o.value = response.notificationCount.oiltemperature };
          if (o.name === 'LowPf') { o.value = response.notificationCount.lowPowerfactor };
          if (o.name === 'WindTemp') { o.value = response.notificationCount.windingTemperature };
          if (o.name === 'Oil Level') { o.value = response.notificationCount.oillevel };
          return o;
        });
        console.log('response=====this.nonmandatoryParameter=========', this.nonmandatoryParameter);
        this.displayNotificationTable(response.result.transformerlist, response.result.alertList);
      }
    });
  }

  setroute(item) {
    console.log("item++", item)
    localStorage.setItem('currentPath', item.link);
  }

  resizeChart() {
    window.dispatchEvent(new Event('resize'));
  }

  isLargeScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width > 720) {
      this.ismobileView = false;
      return true;
    } else {
      this.ismobileView = true;
      return false;
    }
  }

  menuClick(index) {
    this.dashboardArray[index].showSubmenu = !this.dashboardArray[index].showSubmenu;
    if (!this.isExpanded) {
      this.isExpanded = !this.isExpanded;
    }
  }

  logout() {
    if(confirm("Confirm to Logout ")) {
      localStorage.clear();
      this.router.navigate(['/auth/signin']);
    }
  }

  displayNotificationTable(transformerResult, alertResult) {
    this.tableData = [
      {
        type: 'Online',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(transformerResult), (result: any) => {

          result.maxtimestamp = moment(result.latest_date).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result.value = 'GSM';
          result.alertType = 'Online';
          return result.datarecieved == 1;
        })
      },
      {
        type: 'Offline',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(transformerResult), (result1: any) => {
          console.log("moment(result1.latest_date)=============", result1.latest_date, moment(result1.latest_date))
          result1.maxtimestamp = moment(result1.latest_date).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result1.value = 'disConnected'
          result1.alertType = 'Offline'
          return result1.datarecieved == 0
        })
      },
      {
        type: 'Normal',
        header: ['Transformer ID', 'Alert Type'],
        data: _.filter(_.cloneDeep(transformerResult), (result2: any) => {
          let alert = _.filter(alertResult, (a: any) => {
            return a.transformerid === result2.transformerid
          });
          result2.maxtimestamp = moment(result2.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result2.alertType = 'Normal';
          return result2.datarecieved == 1 && alert.length == 0;
        })
      },
      {
        type: 'Unbalance',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result3: any) => {
          result3.maxtimestamp = moment(result3.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result3.alertType = 'Iunbalanced'
          result3.value = result3.mparametervalue
          return result3.parametername === 'apIunbalance'
        })
      },
      {
        type: 'Overload',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result4: any) => {
          result4.maxtimestamp = moment(result4.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result4.alertType = 'Overload'
          result4.value = result4.mparametervalue
          return result4.parametername === 'apOverload'
        })
      },
      {
        type: 'Underload',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result5: any) => {
          result5.maxtimestamp = moment(result5.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result5.alertType = 'Underload'
          result5.value = result5.mparametervalue
          return result5.parametername === 'apUnderload'
        })
      },
      {
        type: 'Oil Temp',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result6: any) => {
          result6.maxtimestamp = moment(result6.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result6.alertType = 'Oiltemperature'
          result6.value = result6.mparametervalue
          return result6.parametername === 'apOiltemperature'
        })
      },
      {
        type: 'LowPf',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result7: any) => {
          result7.maxtimestamp = moment(result7.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result7.alertType = 'LowPowerfactor'
          result7.value = result7.mparametervalue
          return result7.parametername === 'apLowPowerfactor'
        })
      },
      {
        type: 'WindTemp',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result8: any) => {
          result8.maxtimestamp = moment(result8.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result8.alertType = 'WindingTemperature'
          result8.value = result8.mparametervalue
          return result8.parametername === 'apWindingTemperature'
        })
      },
      {
        type: 'Oil Level',
        header: ['Transformer ID', 'Alert Type', 'Time', 'value'],
        data: _.filter(_.cloneDeep(alertResult), (result9: any) => {
          result9.maxtimestamp = moment(result9.maxtimestamp).utc().format("DD-MMM-YYYY HH:mm:ss a");
          result9.alertType = 'Oillevel'
          result9.value = result9.mparametervalue
          return result9.parametername === 'apOillevel'
        })
      }
    ];
    console.log("this.tableData==============", this.tableData)
  }

  checkboxChange(a) {
    console.log('a++++++++++++', a)
    if (a.mandatory) {
      this.mandatoryParameter.push(a);
    } else {
      const index = this.mandatoryParameter.indexOf(a);
      if (index > -1) {
        this.mandatoryParameter.splice(index, 1);
      }
    }
    let tempshownotificationCount = _.filter(this.mandatoryParameter, (o: any) => {
      return o.color === 'red';
    });
    this.notificationCount = _.sumBy(tempshownotificationCount, (o: any) => o.value);
    console.log('Updated +++++', _.union(this.mandatoryParameter, this.nonmandatoryParameter))
    this.globalService.updatenotification({ value: JSON.stringify({ "data": _.union(this.mandatoryParameter, this.nonmandatoryParameter) }), userid: 1 }).subscribe((response: any) => {
      if (response && response.code === '1') {
        console.log('Updated Successfully')
      }
    })

  }

  showTable(d) {
    this.tableHeader = [];
    this.tableBody = [];
    console.log('d++++++++++++', d);
    this.displayname = d.name;
    let temptableHeader = _.filter(this.tableData, (o: any) => {
      return o.type === d.name;
    });
    console.log('d+++temptableHeader+++++++++', temptableHeader);
    this.tableHeader = temptableHeader[0].header;
    this.tableBody = temptableHeader[0].data;
  }

  handleMenuClose(){
    if(this.ismobileView){
      this.sidenav.toggle();this.resizeChart()
    }else{
      this.isExpanded = !this.isExpanded;this.resizeChart()
    }
  }
}
