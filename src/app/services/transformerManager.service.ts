import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransformerManagerService {

    constructor(private http: HttpClient) { }

    saveTransformerData(data: any) {
         let payload = data;
        return this.http.post('addUpdateTransformer', payload)
    }
    saveEMSData(data:any){
      return this.http.post('addUpdateEnergyMeter', data)
    }
    getTransformerData(roleid, userid, module) {
       return this.http.get(`getTransformerData?roleid=${roleid}&userid=${userid}&module=${module}`);
    }
    getEnergyMeters(deviceid){
      return this.http.get('getEnergyMeters?deviceid='+deviceid);
    }
    getEnergyMeterReportData(data){
      return this.http.post('getEnergyMeterReportData',data);
    }
    getEnergyMeterData(roleid, userid, module) {
      return this.http.get(`getEnergyMeterData?roleid=${roleid}&userid=${userid}&module=${module}`);
   }
    getDeviceDdl() {
      return this.http.get('getDeviceDdl');
    }

    getTransformerDetails(data:any) {
      console.log('DATA:', data);
      return this.http.get(`getTransformerDetails?transformerId=${data.transformerId}&deletedFlag=${data.deletedFlag}`);
    }
    getEnergyMeterDetails(data:any) {
      console.log('DATA:', data);
      return this.http.get(`getEnergyMeterDetails?energyMeterId=${data.energyMeterId}&deletedFlag=${data.deletedFlag}`);
    }
    deleteTransformer(data: any) {
      let payload = data;
      return this.http.post('deleteTransformer', payload);
    }
}