import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token: string = localStorage.getItem('access_token');
        if (token) {
            let secureHeaders: any = req.headers;
            secureHeaders = secureHeaders.append('Authorization', `bearer ${token}`);
            const secureReq: any = req.clone({ headers: secureHeaders });
            return next.handle(secureReq);
        }
        return next.handle(req);
    }
}
