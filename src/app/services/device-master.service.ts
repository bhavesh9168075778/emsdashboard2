import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeviceMasterService {

    constructor(private http: HttpClient) { }

    saveDeviceData(data: any) {
         let payload = data;
         console.log('PAYLOAD:', payload);
        return this.http.post('addDevice', payload);
    }

    getDeviceData(deviceType) {
       return this.http.get('getAllDevice?deviceType='+deviceType);
    }
    getEMSDeviceId(data){
      return this.http.get('getEMSDeviceId?id='+data);
    }
    updateDeviceData(data:any) {
      let payload = data;
      console.log('PAYLOAD:', payload);
     return this.http.post('updateDevice', payload);
    }

    getDeviceById(data: any) {
      // getUserList?roleid=${data.roleid}&userid=${data.userid}
     // let payload = data;
      return this.http.get(`getDeviceById?deletedFlag=${data.deletedFlag}&deviceId=${data.deviceId}`);
   }
   downloadCrc(deviceId){
    return this.http.get('crc?deviceid='+deviceId,{responseType:'blob'});
   }
   downloadFrimware(deviceId){
    return this.http.get('Firmware?deviceid='+deviceId,{responseType:'blob'});
   }
   
    deleteData(deviceId: any) {
      let payload = deviceId;
      return this.http.post('deleteDevice',payload);
    }
}