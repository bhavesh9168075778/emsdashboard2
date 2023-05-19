import { Injectable,NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmsdashboardService {

  constructor(private _zone: NgZone, private _sseService: SseService, private http: HttpClient) { }
  
  getServerSentEvent(url): Observable<any> {
    return Observable.create((observer) => {
      const es = this._sseService.getEventSource(url);
      es.onmessage = (event) => {
        this._zone.run(() => observer.next(event));
      };
      es.onerror = (error) => {
        observer.error(error);
      };
    });
  }
getParameterConfig(meterid){
  return this.http.get(`getEmsParameterConfig?meterid=`+meterid);
}
 getKWH(data){
  return this.http.post(`getKWHDATA`,data);
 }
 getMeterCount(deviceid){
   return this.http.get(`getMeterCount?deviceid=`+deviceid);
 }
 getEnergyMeterData(data){
   return this.http.post(`getEnergyMeterData`,data);
 }
}
