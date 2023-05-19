import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from './services/global.service';

@Injectable()
export class AccessAuthGuard implements CanActivate {
    constructor(private router: Router, private globalService: GlobalService) {

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let currentUserData = JSON.parse(this.globalService.getLoginLocalStorage());
        if (currentUserData.roleid == 2 && (state.url === "/deviceMaster")) {
            this.router.navigate(['/access-denied'])
        } else if (currentUserData.roleid == 3
            && (state.url === "/transformerManager" || state.url === "/user" || state.url === "/site" || state.url === "/deviceMaster")) {
            this.router.navigate(['/access-denied'])
        }
        return true;
    }
}