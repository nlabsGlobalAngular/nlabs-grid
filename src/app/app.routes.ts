import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../grid-template/grid-template').then(m => m.GridTemplate)
    }
];