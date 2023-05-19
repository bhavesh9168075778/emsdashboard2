import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList(data) {
    return this.http.get(`getUserList?roleid=${data.roleid}&userid=${data.userid}`);
  }

  addUser(body) {
    return this.http.post('user', body)
  }

  updateUser(body, userid) {
    return this.http.put(`user?userid=${userid}`, body)
  }

  deleteUser(data) {
    return this.http.delete(`user?data=${data}`);
  }
getLoginUserdata(userid){
  return this.http.get(`getLoginUserData?userid=${userid}`);
}
  getUserAdmin(data) {
    return this.http.get(`getuserAdmin?utility_id=${data.utility_id}&role_id=${data.role_id}`);
  }

}
