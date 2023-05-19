import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient) { }

  golbalMaster(masterName) {
    return this.http.get(`globalMaster?name=${masterName}`);
  }
getLoginUserData(userID){
  return this.http.get(`getLoginUserData?userid=${userID}`);
}
  getStateList(country) {
    return this.http.get(`getStateList?countryid=${country.id}`);
  }
  countrySelection(countryid){
    return this.http.get(`getCountryCode?countryid=${countryid}`);
  }
  getCityList(state) {
    return this.http.get(`getCityList?countryid=${state.country_id}&stateid=${state.id}`);
  }

  getZoneList(city) {
    return this.http.get(`getZoneList?cityid=${city.id}`);
  }

  getSiteLocationList(zone) {
    return this.http.get(`getSiteLocationList?zoneid=${zone.id}`);
  }

  getfilteredTransformers(data, userData) {
    return this.http.get(`filteredTransformers?filterdata=${data}&userData=${userData}`);
  }

  getnotification(body) {
    return this.http.post(`notification`, body);
  }

  updatenotification(body) {
    return this.http.post(`updatenotification`, body);
  }

  setLoginLocalStorage(response) {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('userData', JSON.stringify({ roleid: response.roleid, userid: response.userid, name: response.name,countryid:response.country_id, utility: response.utility ? response.utility : null,dashboard:response.dashboard}));
  }

  getLoginLocalStorage() {
    return localStorage.getItem('userData');
  }

}
