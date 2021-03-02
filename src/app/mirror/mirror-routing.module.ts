import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DycToolComponent } from './components/dyc-tool/dyc-tool.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dyc-tool',
        component: DycToolComponent
    },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MirrorRoutingModule { }
