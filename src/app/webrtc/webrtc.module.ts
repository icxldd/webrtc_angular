import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebrtcComponent } from './webrtc.component';
import { WebrtcRoutingModule } from './webrtc.routing';
import { HomeComponent } from './home/home.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { RoomComponent } from './room/room.component';

@NgModule({
  imports: [
    CommonModule,
    WebrtcRoutingModule,
    NgZorroAntdMobileModule
  ],
  declarations: [WebrtcComponent,HomeComponent,RoomComponent]
})
export class WebrtcModule { }
