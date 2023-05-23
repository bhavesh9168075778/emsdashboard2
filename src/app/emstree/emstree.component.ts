import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emstree',
  templateUrl: './emstree.component.html',
  styleUrls: ['./emstree.component.scss']
})
export class EmstreeComponent implements OnInit {
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
    {"floor":"1 floor","meterName":"abcbd","alert": 7},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 2},
    {"floor":"1 floor","meterName":"yuewgw","alert": 4},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 3}
  ],
  [
    {"floor":"1 floor","meterName":"abcbd","alert": 9},
    {"floor":"1 floor","meterName":"iuhnuv","alert": 5},
    {"floor":"1 floor","meterName":"yuewgw","alert": 8},
    {"floor":"1 floor","meterName":"diuwifuhf","alert": 1}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 6},
    {"floor":2,"meterName":"iuhnuv","alert": 9},
    {"floor":2,"meterName":"yuewgw","alert": 3},
    {"floor":2,"meterName":"diuwifuhf","alert": 2}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 5},
    {"floor":2,"meterName":"iuhnuv","alert": 4},
    {"floor":2,"meterName":"yuewgw","alert": 7},
    {"floor":2,"meterName":"diuwifuhf","alert": 6}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 1},
    {"floor":2,"meterName":"iuhnuv","alert": 8},
    {"floor":2,"meterName":"yuewgw","alert": 2},
    {"floor":2,"meterName":"diuwifuhf","alert": 5}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 3},
    {"floor":2,"meterName":"iuhnuv","alert": 7},
    {"floor":2,"meterName":"yuewgw","alert": 1},
    {"floor":2,"meterName":"diuwifuhf","alert": 9}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 8},
    {"floor":2,"meterName":"iuhnuv","alert": 6},
    {"floor":2,"meterName":"yuewgw","alert": 9},
    {"floor":2,"meterName":"diuwifuhf","alert": 4}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 2},
    {"floor":2,"meterName":"iuhnuv","alert": 1},
    {"floor":2,"meterName":"yuewgw","alert": 5},
    {"floor":2,"meterName":"diuwifuhf","alert": 8}
  ],
  [
    {"floor":2,"meterName":"abcbd","alert": 7},
    {"floor":2,"meterName":"iuhnuv","alert": 3},
    {"floor":2,"meterName":"yuewgw","alert": 4},
    {"floor":2,"meterName":"diuwifuhf","alert": 6}
  ]
]
;
  constructor() { }

  ngOnInit() {
  }

}
