import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MirrorRoutingModule } from './mirror-routing.module';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DycToolComponent } from './components/dyc-tool/dyc-tool.component';
import * as fromService from './services';

@NgModule({
    declarations: [LoginComponent, HomeComponent, DycToolComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MirrorRoutingModule
    ],
    providers:[
        fromService.ComponentDesignDataStoreService,
        fromService.PageMetaDataStoreService,
        fromService.ResourceDataStoreService
    ]
})
export class MirrorModule { }
