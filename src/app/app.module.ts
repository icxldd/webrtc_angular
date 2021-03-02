import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as fromService from './services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebrtcModule } from './webrtc/webrtc.module';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { HomeComponent } from './webrtc/home/home.component';
import { RoomComponent } from './webrtc/room/room.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [
        fromService.AuthInterceptor,
        fromService.ErrorInterceptor,
        fromService.IdentityService,
        { provide: HTTP_INTERCEPTORS, useClass: fromService.AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: fromService.ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
