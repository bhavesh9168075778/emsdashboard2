import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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

  loadProfile(data) {
    return this.http.post(`loadProfile`,data);
  }
  parameterConfig(transformerid) {
    return this.http.get(`getParameterConfig?transformerid=${transformerid}`);
  }
  getWeatherData(data) {
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}5&appid=d519f7e16e00303bc0e8e9b0850ead0a`);
  }
  getTransformerHealthIndex(getTransformerData){
    return this.http.get(`getHealthIndex?transformerID=${getTransformerData}`);
  }
  transformerDowntime(body){
    return this.http.post(`getTransformerDowntime`, body);
  }
  getHvLvDiff(body){
    return this.http.post(`getHVLVReport`, body);
  }
  alertCount(body) {
    return this.http.post(`alertCount`, body);
  }

  transformerCount(body) {
    return this.http.post(`transformerCount`,body);
  }

  loadIndividualDashboard(body) {
    return this.http.post(`loadIndividualDashboard`, body);
  }

  transformerTileData(body) {
    return this.http.post(`transformerTileData`, body);
  }
  kwhData(data){
    return this.http.post(`getKWHDATA`,data);
   }

}
