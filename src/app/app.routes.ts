import { Routes } from '@angular/router';
import { Step1Component } from './features/steps/step1/step1.component';
export const routes: Routes = [
  {
    path: '',
    component: Step1Component,
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
