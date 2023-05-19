import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private router: Router, private dialogRef: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = environment.apiUrl;

        if (req.responseType == 'json' && req.url == 'login') {
            req = req.clone({
                url: url + req.url,
                setHeaders: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
        } else if (req.url.indexOf("api.openweathermap.org") > -1) {
            req = req.clone({
                url: req.url
            });
        } else {
            req = req.clone({
                url: url + req.url,
                setHeaders: {
                    'x-access-token': localStorage.getItem('token'),
                },
            });
        }

        return next.handle(req).pipe(
            tap(
                event => {
                    return event;
                },
                error => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) {
                            localStorage.removeItem('token');
                            this.dialogRef.closeAll();
                            this.router.navigate(['/auth/signin']);
                            //return Observable.throw(error);
                        }
                    }
                }
            )
        )
    }
}