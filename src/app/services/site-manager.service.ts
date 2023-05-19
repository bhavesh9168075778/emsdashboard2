import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SiteManagerService {

  constructor(private http: HttpClient) { }

  getSiteList(data) {
    return this.http.get(`getSiteList?roleid=${data.roleid}&userid=${data.userid}`);
  }

  getTransformerList(data) {
    return this.http.get(`getTransformerList?roleid=${data.roleid}&userid=${data.userid}`);
  }
  
  getEnergyMeterList(data) {
    return this.http.get(`getEnergyMeterList?roleid=${data.roleid}&userid=${data.userid}`);
  }
  getUserListSite() {
    return this.http.get('getUserListSite');
  }

  addSite(body) {
    return this.http.post('sitemanager', body)
  }

  deleteSite(data) {
    return this.http.delete(`deleteSite?siteid=${data.id}`);
  }

  updateSiteData(body, siteid) {
    return this.http.put(`sitemanager?siteid=${siteid}`, body)
  }
}
