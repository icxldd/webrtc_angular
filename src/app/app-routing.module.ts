import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'mirror',
        loadChildren: () => import('./mirror/mirror.module').then(m => m.MirrorModule)
    },
    {
        path: 'webrtc',
        loadChildren: () => import('./webrtc/webrtc.module').then(m => m.WebrtcModule)
    },
    { path: '', pathMatch: 'full', redirectTo: 'webrtc' },
    { path: '**', redirectTo: 'webrtc' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false, initialNavigation: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
