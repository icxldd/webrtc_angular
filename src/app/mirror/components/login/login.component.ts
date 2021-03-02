import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseUrl } from 'query-string';
import { switchMap, tap } from 'rxjs/operators';
import * as fromService from '../../../services';

@Component({
    selector: 'mirror-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public form: FormGroup;
    private returnUrl: string;
    public constructor(
        private identitySrv: fromService.IdentityService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.form = fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

    }

    public ngOnInit(): void {
        const latestLoginInfoStr: string = localStorage.getItem('latest_login');
        if (latestLoginInfoStr) {
            const latestLoginInfo: { username: string; password: string } = JSON.parse(latestLoginInfoStr);
            this.form.patchValue(latestLoginInfo);
        }

        let { query } = parseUrl(this.router.url) as any;
        this.returnUrl = query.return;
    }

    public login(): void {
        this.identitySrv.login(this.form.value)
            .pipe(tap(res => {
                localStorage.setItem('latest_login', JSON.stringify(this.form.value));
                localStorage.setItem('access_token', res.access_token);
            }))
            .pipe(switchMap(() => this.identitySrv.getProfile()))
            .subscribe(res => {
                localStorage.setItem('identityId', res.identityId);
                localStorage.setItem('username', res.name);
                // tslint:disable-next-line: no-floating-promises
                this.router.navigateByUrl(this.returnUrl ? decodeURIComponent(this.returnUrl) : '/');
            });
    }

}
