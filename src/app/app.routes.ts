import { Routes } from '@angular/router';

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
  },
  {
    path: 'step/3',
    loadComponent: () =>
      import('./features/steps/step3/step3.component').then(
        (c) => c.Step3Component
      ),
  },
];
