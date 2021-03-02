import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';


const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
      path: 'room',
      component: RoomComponent,
  },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebrtcRoutingModule { }

