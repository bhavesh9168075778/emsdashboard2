import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
    constructor(private http: HttpClient) { }

 getDistinctTransformerId() {
    return this.http.get('getDistinctTransformerId');
 }

 getDistinctSite() {
   return this.http.get('getDistinctSite');
 }

 getAlertReportData(payload: any) {
   let url= '';
   console.log('PAyload:', payload);
   return this.http.post('getAlertsReport', payload);
 }

 getAlertsData(roleid,userid) {
  let url= '';
  return this.http.get(`getAlertsData?roleid=${roleid}&userid=${userid}`);
}

 getReportData(payload:any) {
    let url= '';
    // console.log('FILTERS:', filter);
    // if(filter.length > 0) {
    //     url = `getReport1?` + filter;
    // }
   //  else if(filter.transformerId && filter.date) {
   //      url = `getReport1?transformerId=${filter.transformerId}` + '&' + `date=${filter.date}`
   //      console.log('URL:', url);
   //  }
    // else {
    //     url = `getReport1`;
    // }
    console.log('PAyload:', payload);
   return this.http.post('getReport1', payload);
}

//  getReportData(filter:any) {
//      let url= '';
//      console.log('FILTERS:', filter);
//      if(filter.length > 0) {
//          url = `getReport1?` + filter;
//      }
//     //  else if(filter.transformerId && filter.date) {
//     //      url = `getReport1?transformerId=${filter.transformerId}` + '&' + `date=${filter.date}`
//     //      console.log('URL:', url);
//     //  }
//      else {
//          url = `getReport1`;
//      }
//     return this.http.get(url);
//  }
     
}