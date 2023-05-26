import { Component, OnInit } from '@angular/core';
import { TransformerManagerService } from '../services/transformerManager.service';
import { DeviceMasterService } from '../services/device-master.service';
import { EmsdashboardService } from '../services/emsdashboard.service';
@Component({
  selector: 'app-emstree',
  templateUrl: './emstree.component.html',
  styleUrls: ['./emstree.component.scss']
})
export class EmstreeComponent implements OnInit {
matername;
alert_count;
  arr:any = [
  [
    {"floor":"Unit 2 Silvasaa","meterName":"Core Lamination area","alert": 3},
    {"floor":"Unit 2 Silvasaa","meterName":"Bhavesh","alert": 7},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 2},
    {"floor":"1 floor","meterName":"yuewgw","alert": 9},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 5}
  ],
  [
    {"floor":"1 floor","meterName":"abcbd","alert": 4},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 1},
    {"floor":"1 floor","meterName":"yuewgw","alert": 6},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 8},
    {"floor":"1 floor","meterName":"yuewgw","alert": 6},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 8},
    {"floor":"1 floor","meterName":"abcbd","alert": 4},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 1},
    {"floor":"1 floor","meterName":"yuewgw","alert": 6},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 8},
    {"floor":"1 floor","meterName":"yuewgw","alert": 6},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 8}
  ],
  [
    {"floor":"2 floor","meterName":"abcbd","alert": 7},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 2},
    {"floor":"1 floor","meterName":"yuewgw","alert": 4},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 3}
  ],
  [
    {"floor":"3 floor","meterName":"abcbd","alert": 9},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 5},
    {"floor":"1 floor","meterName":"yuewgw","alert": 8},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 1}
  ],
  [
    {"floor":4,"meterName":"abcbd","alert": 6},
    {"floor":2,"meterName":"iuhnuv","alert": 9},
    {"floor":2,"meterName":"yuewgw","alert": 3},
    {"floor":2,"meterName":"diuwifuhf","alert": 2}
  ],
  [
    {"floor":5,"meterName":"abcbd","alert": 5},
    {"floor":2,"meterName":"iuhnuv","alert": 4},
    {"floor":2,"meterName":"yuewgw","alert": 7},
    {"floor":2,"meterName":"diuwifuhf","alert": 6}
  ],
  [
    {"floor":6,"meterName":"abcbd","alert": 1},
    {"floor":2,"meterName":"iuhnuv","alert": 8},
    {"floor":2,"meterName":"yuewgw","alert": 2},
    {"floor":2,"meterName":"diuwifuhf","alert": 5}
  ],
  [
    {"floor":7,"meterName":"abcbd","alert": 3},
    {"floor":2,"meterName":"iuhnuv","alert": 7},
    {"floor":2,"meterName":"yuewgw","alert": 1},
    {"floor":2,"meterName":"diuwifuhf","alert": 9}
  ],
  [
    {"floor":8,"meterName":"abcbd","alert": [{'parametername':'lowpf'},{'parametername':'highpf'}]},
    {"floor":2,"meterName":"iuhnuv","alert": 6},
    {"floor":2,"meterName":"yuewgw","alert": 9},
    {"floor":2,"meterName":"diuwifuhf","alert": 4}
  ],
  [
    {"floor":9,"meterName":"abcbd","alert": 2},
    {"floor":2,"meterName":"iuhnuv","alert": 1},
    {"floor":2,"meterName":"yuewgw","alert": 5},
    {"floor":2,"meterName":"diuwifuhf","alert": 8}
  ],
  [
    {"floor":10,"meterName":"abcbd","alert": 7},
    {"floor":2,"meterName":"iuhnuv","alert": 3},
    {"floor":2,"meterName":"yuewgw","alert": 4},
    {"floor":2,"meterName":"diuwifuhf","alert": 6}
  ]
];
  
constructor(private deviceManagerSer: DeviceMasterService, private transMngSer: TransformerManagerService, private EmsdashboardService: EmsdashboardService) { }


  ngOnInit() {

  }

  getAlertCount(ar1: any): string {
    let tooltipText = `Meter Name: ${ar1.meterName}\n`;
   this.alert_count =0;
   if(Array.isArray(ar1.alert)){
    if (Array.isArray(ar1.alert) && ar1.alert.length > 0) {
     this.alert_count++;
      tooltipText += 'Alerts:\n';
      ar1.alert.forEach((alertItem: any) => {
        tooltipText += `${alertItem.parametername}\n`;
      });
    }
  } else {
    tooltipText += ar1.alert;
  }
    return tooltipText;
  }
  
}
