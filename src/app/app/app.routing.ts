import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MemoryComponent } from '../memory/memory.component';
import { CrucigramaComponent } from '../crucigrama/crucigrama.component';
import { SopaletrasComponent } from '../sopaletras/sopaletras.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'memory', component: MemoryComponent},
    {path: 'crucigrama', component: CrucigramaComponent},
    {path: 'sopa', component: SopaletrasComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);