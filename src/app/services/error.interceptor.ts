import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    public constructor(
        private router: Router
    ) { }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(response => {

            const returnUrl: string = encodeURIComponent(this.router.url);
            if (response.status === 401) {
                // tslint:disable-next-line: no-floating-promises
                this.router.navigateByUrl(`/mirror/login?return=${returnUrl}`);
            }
            return throwError(response);
        }));
    }
}
