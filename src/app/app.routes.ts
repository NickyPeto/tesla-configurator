import { Routes } from '@angular/router';
import { guardStep1 } from './core/guards/guard-step1/guard-step1.guard';
import { guardStep2Guard } from './core/guards/guard-step2/guard-step2.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'step/1',
    pathMatch: 'full',
  },

  {
    path: 'step/1',
    loadComponent: () =>
      import('./features/steps/step1/step1.component').then(
        (c) => c.Step1Component
      ),
  },
  {
    path: 'step/2',
    loadComponent: () =>
      import('./features/steps/step2/step2.component').then(
        (c) => c.Step2Component
      ),
    canActivate: [guardStep1],
  },
  {
    path: 'step/3',
    loadComponent: () =>
      import('./features/steps/step3/step3.component').then(
        (c) => c.Step3Component
      ),
    canActivate: [guardStep2Guard],
  },
  {
    path: '**',
    redirectTo: 'step/1',
    pathMatch: 'full',
  },
];
