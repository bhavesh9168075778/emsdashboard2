import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
    constructor(private http: HttpClient) { }

 getAlertData() {
    return this.http.get('alertData');
 }
    
}